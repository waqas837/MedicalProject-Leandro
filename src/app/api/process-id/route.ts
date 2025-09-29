import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Process the image with OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this ID card image and extract the following information in JSON format:
              {
                "firstName": "string",
                "lastName": "string", 
                "dob": "YYYY-MM-DD",
                "idNumber": "string"
              }
              
              Instructions:
              - Extract the full name (first and last name separately)
              - Extract date of birth in YYYY-MM-DD format
              - Extract ID number (driver's license number, passport number, etc.)
              - If any information is not clearly visible or readable, return "N/A" for that field
              - If this is not a valid ID card (driver's license, passport, state ID), return error: "Not an ID card"
              - If the image quality is too poor to read, return error: "Poor image quality - please retake with better lighting and focus"
              - Focus on the main text areas and ignore any watermarks or background elements
              - Be precise with the extraction - only return what you can clearly see`
            },
            {
              type: "image_url",
              image_url: {
                url: imageData
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.1
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Failed to process image with OpenAI' },
        { status: 500 }
      );
    }

    // Try to parse the JSON response
    try {
      const extractedData = JSON.parse(content);
      
      // Check if it's an error response
      if (extractedData.error) {
        return NextResponse.json(
          { error: extractedData.error },
          { status: 400 }
        );
      }

      // Validate the extracted data
      const result = {
        firstName: extractedData.firstName || null,
        lastName: extractedData.lastName || null,
        dob: extractedData.dob || null,
        idNumber: extractedData.idNumber || null
      };

      return NextResponse.json(result);

    } catch (parseError) {
      // If JSON parsing fails, try to extract information from text response
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      
      // Fallback: try to extract information using regex patterns
      const firstNameMatch = content.match(/"firstName":\s*"([^"]+)"/);
      const lastNameMatch = content.match(/"lastName":\s*"([^"]+)"/);
      const dobMatch = content.match(/"dob":\s*"([^"]+)"/);
      const idNumberMatch = content.match(/"idNumber":\s*"([^"]+)"/);

      const result = {
        firstName: firstNameMatch ? firstNameMatch[1] : null,
        lastName: lastNameMatch ? lastNameMatch[1] : null,
        dob: dobMatch ? dobMatch[1] : null,
        idNumber: idNumberMatch ? idNumberMatch[1] : null
      };

      return NextResponse.json(result);
    }

  } catch (error) {
    console.error('Error processing ID with OpenAI:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key is invalid or missing' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process ID card. Please try again with a clearer image.' },
      { status: 500 }
    );
  }
}
