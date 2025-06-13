import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET: APIRoute = async () => {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(entries), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch entries",
        details: (error as Error).message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get("user_session");

  if (!session?.value) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = JSON.parse(session.value);
    const { message } = await request.json();

    if (!message || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (message.length > 500) {
      return new Response(JSON.stringify({ error: "Message too long" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const entry = await prisma.guestbookEntry.create({
      data: {
        message: message.trim(),
        userId: user.id,
      },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(entry), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating guestbook entry:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create entry",
        details: (error as Error).message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
