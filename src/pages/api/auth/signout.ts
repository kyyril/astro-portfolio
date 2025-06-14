import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete("user_session", {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
};
