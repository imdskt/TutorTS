import { NextRequest, NextResponse } from 'next/server';
import { llm, MODEL } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const { material, question, answer } = await req.json();

    if (!material || !question || !answer) {
      return NextResponse.json({ error: 'Material, question, and answer are required' }, { status: 400 });
    }

    const systemPrompt = `You are an elite Socratic tutor. A student is answering a question based on a study text.
Evaluate their answer. If it is correct, congratulate them and briefly explain why.
If it is partially correct or incorrect, DO NOT just give them the correct answer. Provide conversational, encouraging feedback that nudges them toward the right answer. Ask a follow-up question to help them think it through.

You must output valid JSON strictly matching this schema:
{
  "isCorrect": boolean, // true if they fully understand, false if they need to try again
  "feedback": "Your conversational Socratic feedback here..."
}`;

    const userPrompt = `
--- Source Material ---
${material}

--- Question ---
${question}

--- Student's Answer ---
${answer}

Evaluate the student's answer.`;

    const response = await llm.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Failed to evaluate answer.");

    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error('[Evaluate Answer Error]', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
