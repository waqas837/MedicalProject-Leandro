import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // Process ID with GPT-4 Vision using secure server-side API key
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at processing ID card images. You ONLY process driver's licenses, passports, and state ID cards. You also validate image quality. If the image is not an ID card or has poor quality, return an error."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `First verify this is an ID card (driver's license, passport, or state ID) AND the image quality is good (clear, well-lit, readable text). 

If it's NOT an ID card, return: {"error": "Not an ID card"}
If it's an ID card but poor quality (blurry, dark, unreadable), return: {"error": "Poor image quality - please retake with better lighting and focus"}
If it's a good quality ID card, extract the following information and return ONLY a valid JSON object:

Extract and return JSON with these exact keys:
{
  "firstName": "extracted first name or null",
  "lastName": "extracted last name or null", 
  "dob": "extracted date of birth in MM/DD/YYYY format or null",
  "idNumber": "extracted ID/license number or null"
}

Return ONLY the JSON object, no other text.`
              },
              {
                type: "image_url",
                image_url: { url: imageData }
              }
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    let result: any = { error: "Processing failed" };
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      
      try {
        // Remove markdown code blocks if present
        let cleanContent = content.trim();
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        result = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Failed to parse GPT JSON response:', parseError);
        result = { error: 'Failed to parse response', rawResponse: content };
      }
    } else {
      result = { error: 'GPT API failed', details: data };
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('ID Processing API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process ID image', details: (error as Error).message },
      { status: 500 }
    );
  }
}
