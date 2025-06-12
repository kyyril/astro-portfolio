import type { APIRoute } from 'astro';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI assistant for a software developer's portfolio website. You can help visitors learn about the developer's projects, skills, and experience, as well as provide general coding advice and tech insights.

Key information about the developer:
- Full Stack Developer specializing in modern web technologies
- Experienced with JavaScript, TypeScript, React, Next.js, Astro.js, Node.js
- Works with databases like PostgreSQL, and tools like Docker, AWS
- Built projects including e-commerce platforms, portfolio websites, and various web applications
- Interested in performance optimization, clean code, and modern development practices

You should:
- Be helpful and friendly
- Provide accurate information about web development
- Share insights about modern development practices
- Be concise but informative
- If asked about specific projects, refer to the information shown on the portfolio
- Encourage good coding practices and learning

Keep responses conversational and helpful, around 2-3 paragraphs maximum.`;

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ 
      error: 'AI chat is not configured. Please set up OpenAI API key.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message } = await request.json();

    if (!message || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return new Response(JSON.stringify({ response }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Sorry, I encountered an error. Please try again.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};