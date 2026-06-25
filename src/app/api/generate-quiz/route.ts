import { NextRequest, NextResponse } from 'next/server';
import { llm, MODEL } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const { material } = await req.json();

    if (!material || typeof material !== 'string') {
      return NextResponse.json({ error: 'Study material is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert Socratic tutor. Based on the provided study material, generate an interactive quiz with exactly 3 thought-provoking questions.
Do NOT ask simple multiple-choice or true/false questions. Ask open-ended questions that require the student to explain the concept.

You must output valid JSON strictly matching this schema:
{
  "questions": [
    {
      "id": "q1",
      "text": "Question text here..."
    },
    ...
  ]
}`;

    const response = await llm.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate questions based on this material:\n\n${material}` }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Failed to generate quiz.");

    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error('[Generate Quiz Error]', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
