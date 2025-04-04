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

interface EmailFormData {
  emailAbout: string;
  businessType: string;
  targetAudience: string;
  emailStyle: string;
}

export async function POST(request: Request) {
  try {
    const formData: EmailFormData = await request.json();
    
    if (!formData.emailAbout || !formData.businessType || !formData.targetAudience || !formData.emailStyle) {
      return NextResponse.json(
        { message: 'All form fields are required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert email template designer for the Unlayer email editor. Create a professional, responsive email template based on the following specifications:

1. Email Content:
- Topic: ${formData.emailAbout}
- Business Type: ${formData.businessType}
- Target Audience: ${formData.targetAudience}
- Tone/Style: ${formData.emailStyle}

2. Style Guidelines based on Tone (${formData.emailStyle}):
${formData.emailStyle === 'Inspirational' ? `
- Use motivational and uplifting language
- Include inspiring quotes or statistics
- Focus on possibilities and positive outcomes
- Use warm, vibrant colors
` : formData.emailStyle === 'Informative' ? `
- Present clear, factual information
- Include relevant data and statistics
- Use a structured, logical layout
- Maintain professional, neutral colors
` : formData.emailStyle === 'Assertive' ? `
- Use confident, direct language
- Include clear calls-to-action
- Focus on benefits and value propositions
- Use bold, strong colors
` : formData.emailStyle === 'Formal' ? `
- Maintain professional, respectful tone
- Use proper business language
- Include formal greetings and closings
- Use conservative color scheme
` : formData.emailStyle === 'Neutral' ? `
- Balance professional and approachable tone
- Use clear, straightforward language
- Maintain moderate formatting
- Use balanced color scheme
` : `
- Use casual, friendly language
- Include conversational elements
- Keep formatting relaxed
- Use friendly, approachable colors
`}

3. Template Structure:
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
                    "backgroundColor": "${
                      formData.emailStyle === 'Inspirational' ? '#FF6B6B' :
                      formData.emailStyle === 'Informative' ? '#4A90E2' :
                      formData.emailStyle === 'Assertive' ? '#E74C3C' :
                      formData.emailStyle === 'Formal' ? '#34495E' :
                      formData.emailStyle === 'Neutral' ? '#2C7BE5' :
                      '#27AE60'
                    }",
                    "hoverColor": "#ffffff",
                    "hoverBackgroundColor": "${
                      formData.emailStyle === 'Inspirational' ? '#FF5252' :
                      formData.emailStyle === 'Informative' ? '#357ABD' :
                      formData.emailStyle === 'Assertive' ? '#C0392B' :
                      formData.emailStyle === 'Formal' ? '#2C3E50' :
                      formData.emailStyle === 'Neutral' ? '#1A68D1' :
                      '#219A52'
                    }"
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

4. Content Guidelines:
- Create a compelling subject line
- Write content that resonates with ${formData.targetAudience}
- Include industry-specific terminology for ${formData.businessType}
- Maintain the selected ${formData.emailStyle} tone throughout
- Ensure all content is relevant to ${formData.emailAbout}
- Include appropriate call-to-action buttons
- Add a professional footer with necessary disclaimers

Generate a complete template replacing placeholder content with relevant content based on these specifications. Return ONLY the JSON, no explanation or markdown.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.7
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      return NextResponse.json(
        { success: false, message: errorData },
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

      // Validate template structure
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
      const jsonMatch = generatedJson.match(/```(?:json)?([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[1].trim()) as UnlayerDesign;
          return NextResponse.json({ 
            success: true, 
            template: extractedJson 
          });
        } catch (extractError) {
          // console.error('Extracted JSON parsing error:', extractError);
        }
      }

      return NextResponse.json(
        { success: false, message: 'Invalid JSON format received from AI' },
        { status: 500 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to generate email template' },
      { status: 500 }
    );
  }
}
