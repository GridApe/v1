import { NextResponse } from 'next/server';

interface FontFamily {
  label: string;
  value: string;
}

interface LinkStyle {
  inherit: boolean;
  linkColor: string;
  linkHoverColor: string;
  linkUnderline: boolean;
  linkHoverUnderline: boolean;
}

interface Values {
  containerPadding?: string;
  headingType?: string;
  fontFamily?: FontFamily;
  fontSize?: string;
  textAlign?: string;
  lineHeight?: string;
  linkStyle?: LinkStyle;
  text?: string;
  buttonColors?: {
    color: string;
    backgroundColor: string;
    hoverColor: string;
    hoverBackgroundColor: string;
  };
  backgroundColor?: string;
  padding?: string;
  border?: Record<string, unknown>;
  borderRadius?: string;
  src?: {
    url: string;
    width: number;
    height: number;
  };
  href?: {
    name: "web";
    values: {
      href: string;
      target: "_blank" | "self";
    };
  };
}

interface Content {
  type: "heading" | "text" | "button" | "image";
  values: Values;
}

interface Column {
  id: string;
  contents: Content[];
  values: Values;
}

interface Row {
  id: string;
  cells: number[];
  columns: Column[];
  values: Values;
}

interface UnlayerDesign {
  counters: {
    u_column: number;
    u_row: number;
    u_content_button: number;
    u_content_heading: number;
    u_content_text: number;
    u_content_image: number;
  };
  body: {
    rows: Row[];
    values: Values;
  };
  schemaVersion: number;
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert email template designer for the Unlayer email editor. Create a professional, responsive email template following these rules:

1. Template Structure:
- Every email must have a header, main content, and footer
- Use consistent spacing and padding throughout
- Ensure all colors are in hex format
- Include proper content hierarchy with headings and text blocks

2. Required Sections:
{
  "counters": {
    "u_column": 3,
    "u_row": 3,
    "u_content_button": 1,
    "u_content_heading": 1,
    "u_content_text": 2,
    "u_content_image": 1
  },
  "body": {
    "rows": [
      {
        "id": "header",
        "cells": [1],
        "columns": [
          {
            "id": "header-column",
            "contents": [
              {
                "type": "image",
                "values": {
                  "src": {
                    "url": "https://i.imgur.com/n5SiSAP.png",
                    "width": 200,
                    "height": 50
                  },
                  "textAlign": "center",
                  "containerPadding": "10px"
                }
              }
            ],
            "values": {
              "backgroundColor": "#ffffff",
              "padding": "20px",
              "border": {},
              "borderRadius": "0px"
            }
          }
        ],
        "values": {}
      },
      {
        "id": "main-content",
        "cells": [1],
        "columns": [
          {
            "id": "content-column",
            "contents": [
              {
                "type": "heading",
                "values": {
                  "text": "[Main Heading]",
                  "textAlign": "left",
                  "lineHeight": "140%",
                  "fontSize": "28px",
                  "fontFamily": {
                    "label": "Arial",
                    "value": "arial,helvetica,sans-serif"
                  }
                }
              },
              {
                "type": "text",
                "values": {
                  "text": "[Main content text]",
                  "textAlign": "left",
                  "lineHeight": "140%",
                  "fontSize": "16px",
                  "fontFamily": {
                    "label": "Arial",
                    "value": "arial,helvetica,sans-serif"
                  }
                }
              },
              {
                "type": "button",
                "values": {
                  "text": "[Call to Action]",
                  "textAlign": "center",
                  "buttonColors": {
                    "color": "#ffffff",
                    "backgroundColor": "#2C7BE5",
                    "hoverColor": "#ffffff",
                    "hoverBackgroundColor": "#1A68D1"
                  },
                  "href": {
                    "name": "web",
                    "values": {
                      "href": "https://example.com",
                      "target": "_blank"
                    }
                  }
                }
              }
            ],
            "values": {}
          }
        ],
        "values": {
          "backgroundColor": "#ffffff",
          "padding": "20px 30px",
          "border": {},
          "borderRadius": "0px"
        }
      },
      {
        "id": "footer",
        "cells": [1],
        "columns": [
          {
            "id": "footer-column",
            "contents": [
              {
                "type": "text",
                "values": {
                  "text": "[Footer content]",
                  "textAlign": "center",
                  "lineHeight": "120%",
                  "fontSize": "12px",
                  "fontFamily": {
                    "label": "Arial",
                    "value": "arial,helvetica,sans-serif"
                  }
                }
              }
            ],
            "values": {
              "backgroundColor": "#f8f9fa",
              "padding": "20px",
              "border": {},
              "borderRadius": "0px"
            }
          }
        ],
        "values": {}
      }
    ],
    "values": {
      "backgroundColor": "#ffffff",
      "width": "600px",
      "padding": "0px"
    }
  },
  "schemaVersion": 12
}

3. Design Guidelines:
- Use a white (#ffffff) background for main content
- Use a light gray (#f8f9fa) background for the footer
- Set button colors with proper hover states
- Maintain consistent font families throughout
- Use proper heading hierarchy
- Ensure all text is legible with appropriate line height
- Add proper padding and spacing between elements

4. Content Rules:
- Keep headings concise and clear
- Include meaningful button text
- Ensure all links are properly formatted
- Keep footer text professional and include necessary legal information
- Use appropriate text alignment for different content types

Generate a complete template replacing placeholder content with relevant content based on the user's prompt. Return ONLY the JSON, no explanation or markdown.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer `,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Generate an Unlayer email template for: ${prompt}`
          }
        ],
        max_tokens: 2500,
        temperature: 0.7
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { success: false, message: 'OpenAI API request failed' },
        { status: openaiResponse.status }
      );
    }

    const responseData = await openaiResponse.json();
    let generatedJson = responseData.choices?.[0]?.message?.content?.trim();
    
    if (!generatedJson) {
      return NextResponse.json(
        { success: false, message: 'AI did not return content' },
        { status: 500 }
      );
    }

    try {
      const parsedJson = JSON.parse(generatedJson) as UnlayerDesign;
      
      if (!parsedJson.counters || !parsedJson.body?.rows || !parsedJson.schemaVersion) {
        throw new Error('Missing required top-level properties');
      }

      parsedJson.body.rows.forEach((row, index) => {
        if (!row.id || !Array.isArray(row.cells) || !Array.isArray(row.columns)) {
          throw new Error(`Invalid structure in row ${index}`);
        }
        
        row.columns.forEach((column, colIndex) => {
          if (!column.id || !Array.isArray(column.contents)) {
            throw new Error(`Invalid structure in column ${colIndex} of row ${index}`);
          }
          
          column.contents.forEach((content, contentIndex) => {
            if (!content.type || !content.values) {
              throw new Error(`Invalid content structure at index ${contentIndex} in column ${colIndex}, row ${index}`);
            }
          });
        });
      });

      return NextResponse.json({ 
        success: true, 
        template: parsedJson 
      });

    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      
      const jsonMatch = generatedJson.match(/```(?:json)?([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[1].trim()) as UnlayerDesign;
          return NextResponse.json({ 
            success: true, 
            template: extractedJson 
          });
        } catch (extractError) {
          console.error('Extracted JSON parsing error:', extractError);
        }
      }

      return NextResponse.json(
        { success: false, message: 'Invalid JSON format received from AI' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate email template' },
      { status: 500 }
    );
  }
}
