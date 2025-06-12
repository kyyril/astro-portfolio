import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code');
  
  if (!code) {
    return redirect('/guestbook?error=no_code');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: import.meta.env.GITHUB_CLIENT_ID,
        client_secret: import.meta.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return redirect('/guestbook?error=token_error');
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();

    if (!userData.id) {
      return redirect('/guestbook?error=user_error');
    }

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { githubId: userData.id.toString() },
      create: {
        githubId: userData.id.toString(),
        username: userData.login,
        avatarUrl: userData.avatar_url,
        email: userData.email,
      },
      update: {
        username: userData.login,
        avatarUrl: userData.avatar_url,
        email: userData.email,
      },
    });

    // Set session cookie (simplified - in production, use proper JWT)
    cookies.set('user_session', JSON.stringify({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
    }), {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return redirect('/guestbook');
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return redirect('/guestbook?error=server_error');
  }
};