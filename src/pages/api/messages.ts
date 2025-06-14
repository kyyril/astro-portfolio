import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";
import { getSession } from "auth-astro/server";

const prisma = new PrismaClient();

export const GET: APIRoute = async ({ request }) => {
  try {
    const messages = await prisma.message.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        replies: {
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
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.trim() === "") {
      return new Response(JSON.stringify({ message: "Content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        content: content.trim(),
        authorId: session.user.id as string,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return new Response(JSON.stringify(newMessage), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id, content } = await request.json();

    if (!id || typeof id !== "string") {
      return new Response(
        JSON.stringify({ message: "Message ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!content || typeof content !== "string" || content.trim() === "") {
      return new Response(JSON.stringify({ message: "Content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (existingMessage.authorId !== session.user.id) {
      return new Response(
        JSON.stringify({
          message: "Forbidden: You can only update your own messages",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { content: content.trim() },
    });

    return new Response(JSON.stringify(updatedMessage), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating message:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = await request.json();

    if (!id || typeof id !== "string") {
      return new Response(
        JSON.stringify({ message: "Message ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (existingMessage.authorId !== session.user.id) {
      return new Response(
        JSON.stringify({
          message: "Forbidden: You can only delete your own messages",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await prisma.message.delete({
      where: { id },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
