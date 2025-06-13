import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({
      error: "AI chat is disabled.",
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
};
