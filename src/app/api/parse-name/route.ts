import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { fullName } = await request.json();
    
    if (!fullName || typeof fullName !== 'string') {
      return NextResponse.json(
        { error: 'Invalid full name provided' },
        { status: 400 }
      );
    }

    const prompt = `Parse the following full name into first name and last name. Handle various name formats including:
- Single names (use as first name, empty last name)
- Two names (first and last)
- Three or more names (first name + remaining as last name)
- Hispanic names (e.g., "Maria Elena Rodriguez Garcia")
- Names with titles or prefixes (ignore them)
- Middle names (include with last name)

Full name: "${fullName}"

Return ONLY a JSON object with "firstName" and "lastName" properties. No additional text or explanation.

Examples:
- "John Smith" → {"firstName": "John", "lastName": "Smith"}
- "Maria Elena Rodriguez Garcia" → {"firstName": "Maria", "lastName": "Elena Rodriguez Garcia"}
- "Robert James Wilson Jr" → {"firstName": "Robert", "lastName": "James Wilson Jr"}
- "Madonna" → {"firstName": "Madonna", "lastName": ""}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a name parsing specialist. Return only valid JSON with firstName and lastName properties.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content?.trim();
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const parsedResult = JSON.parse(content);
    
    // Validate the response structure
    if (typeof parsedResult.firstName !== 'string' || typeof parsedResult.lastName !== 'string') {
      throw new Error('Invalid response structure from OpenAI');
    }

    return NextResponse.json({
      firstName: parsedResult.firstName,
      lastName: parsedResult.lastName,
    });

  } catch (error) {
    console.error('Error parsing name:', error);
    
    // Fallback parsing in case of API error
    try {
      const { fullName } = await request.json();
      const parts = fullName.trim().split(/\s+/);
      
      if (parts.length === 1) {
        return NextResponse.json({
          firstName: parts[0],
          lastName: '',
        });
      } else if (parts.length === 2) {
        return NextResponse.json({
          firstName: parts[0],
          lastName: parts[1],
        });
      } else {
        return NextResponse.json({
          firstName: parts[0],
          lastName: parts.slice(1).join(' '),
        });
      }
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to parse name' },
        { status: 500 }
      );
    }
  }
}
