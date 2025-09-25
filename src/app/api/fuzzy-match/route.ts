import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { idName, officerName } = await request.json();
    
    if (!idName || !officerName) {
      return NextResponse.json(
        { error: 'Both idName and officerName are required' },
        { status: 400 }
      );
    }

    const prompt = `Compare these two names and determine if they likely refer to the same person. Consider variations like:
- Different spellings/typos
- Missing/extra middle names
- Different name order
- Cultural name variations
- Case differences

ID Name: "${idName}"
Officer Name: "${officerName}"

Return ONLY a JSON object with:
- "match": boolean (true if 65% or more confident they are the same person)
- "confidence": number (0-100 percentage)
- "reason": string (brief explanation)

Example: {"match": true, "confidence": 85, "reason": "Same first and last name with additional middle name"}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a name matching expert. Return only valid JSON with match, confidence, and reason properties.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content?.trim();
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const result = JSON.parse(content);
    
    // Validate the response structure
    if (typeof result.match !== 'boolean' || typeof result.confidence !== 'number') {
      throw new Error('Invalid response structure from OpenAI');
    }

    return NextResponse.json({
      match: result.match,
      confidence: result.confidence,
      reason: result.reason || 'No reason provided'
    });

  } catch (error) {
    console.error('Error in fuzzy name matching:', error);
    
    // Fallback to simple matching
    try {
      const { idName, officerName } = await request.json();
      const id = idName.toLowerCase().trim();
      const officer = officerName.toLowerCase().trim();
      
      const simpleMatch = id === officer || officer.includes(id) || id.includes(officer);
      
      return NextResponse.json({
        match: simpleMatch,
        confidence: simpleMatch ? 75 : 25,
        reason: 'Fallback simple matching due to AI error'
      });
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to match names' },
        { status: 500 }
      );
    }
  }
}
