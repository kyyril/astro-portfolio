import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
  const session = cookies.get('user_session');
  
  if (!session?.value) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const user = JSON.parse(session.value);
    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};