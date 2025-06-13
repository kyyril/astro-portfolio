import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const defaultRedirectUri = "http://localhost:4321/api/auth/github/callback";
  const redirectUri = import.meta.env.GITHUB_CALLBACK_URL || defaultRedirectUri;

  if (!clientId) {
    console.error("GITHUB_CLIENT_ID is not configured.");
    return new Response("GitHub OAuth not configured", { status: 500 });
  }

  console.log("Redirecting to GitHub with redirect_uri:", redirectUri);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "user:email",
  });

  return redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
};
