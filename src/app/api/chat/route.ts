import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a warm, insightful wellness coach and personal growth companion built into MyJournal — a premium journaling app for ambitious people.

Your role:
- Motivate users to journal consistently and maintain their streaks
- Suggest practical strategies for mental well-being, mindfulness, and self-reflection
- Recommend high-quality courses, books, YouTube channels, and free resources
- Give actionable health tips
- Celebrate wins, no matter how small

Tone: Warm, grounded, slightly poetic.
Keep responses concise but meaningful.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Gemini API key missing',
        },
        {
          status: 500,
        }
      )
    }

    const latestMessage =
      messages[messages.length - 1]?.content || ''

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_PROMPT}

User message:
${latestMessage}`,
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 500,
          },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error(data)

      return NextResponse.json(
        {
          error:
            data.error?.message ||
            'Gemini API failed',
        },
        {
          status: response.status,
        }
      )
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response'

    return NextResponse.json({
      message: text,
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        error: 'Something went wrong',
      },
      {
        status: 500,
      }
    )
  }
}