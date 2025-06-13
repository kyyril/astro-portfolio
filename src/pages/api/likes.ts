import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";
import { getSession } from "auth-astro/server";

const prisma = new PrismaClient();

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const { emote, messageId } = await request.json();

    const validEmotes = ["🚀", "☕", "😅", "🫡", "🤩", "😁"];
    if (!emote || !validEmotes.includes(emote)) {
      return new Response(JSON.stringify({ message: "Invalid emote" }), {
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

    // Check if the user has already liked this message with this emote
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user.id as string,
        messageId: messageId,
        emote: emote,
      },
    });

    if (existingLike) {
      return new Response(
        JSON.stringify({
          message: "You have already liked this message with this emote",
        }),
        {
          status: 409, // Conflict
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const newLike = await prisma.like.create({
      data: {
        emote: emote,
        userId: session.user.id as string,
        messageId: messageId,
      },
    });

    return new Response(JSON.stringify(newLike), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating like:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const { messageId, emote } = await request.json();

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

    if (!emote || typeof emote !== "string") {
      return new Response(JSON.stringify({ message: "Emote is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const deletedLike = await prisma.like.deleteMany({
      where: {
        userId: session.user.id as string,
        messageId: messageId,
        emote: emote,
      },
    });

    if (deletedLike.count === 0) {
      return new Response(JSON.stringify({ message: "Like not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Error deleting like:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
