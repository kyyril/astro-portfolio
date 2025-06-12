import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ redirect }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const redirectUri = import.meta.env.GITHUB_CALLBACK_URL || 'http://localhost:4321/api/auth/github/callback';
  
  if (!clientId) {
    return new Response('GitHub OAuth not configured', { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'user:email',
  });

  return redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};