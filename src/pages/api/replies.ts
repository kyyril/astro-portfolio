import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get("user_session");

  if (!sessionCookie || !sessionCookie.value) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    const { content, messageId } = await request.json();

    if (!content || typeof content !== "string" || content.trim() === "") {
      return new Response(JSON.stringify({ message: "Content is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!messageId || typeof messageId !== "string") {
      return new Response(
        JSON.stringify({ message: "Message ID is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const newReply = await prisma.reply.create({
      data: {
        content: content.trim(),
        authorId: session.id as string,
        messageId: messageId,
      },
    });

    return new Response(JSON.stringify(newReply), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

// Optional: GET replies for a specific message if needed separately from fetching all messages
export const GET: APIRoute = async ({ request, url }) => {
  try {
    const messageId = new URL(url).searchParams.get("messageId");

    if (!messageId) {
      return new Response(
        JSON.stringify({ message: "Message ID is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const replies = await prisma.reply.findMany({
      where: { messageId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return new Response(JSON.stringify(replies), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
