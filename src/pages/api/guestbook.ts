import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET: APIRoute = async (): Promise<Response> => {
  try {
    // Fetch guestbook entries
    const entries = await prisma.guestbookEntry.findMany({
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                username: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc", // Order replies chronologically
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

export const PUT: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  const session = cookies.get("user_session");

  if (!session?.value) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = JSON.parse(session.value);
    const { id, message } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Entry ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    const existingEntry = await prisma.guestbookEntry.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return new Response(JSON.stringify({ error: "Entry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (existingEntry.userId !== user.id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized to update this entry" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updatedEntry = await prisma.guestbookEntry.update({
      where: { id },
      data: {
        message: message.trim(),
      },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                username: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc", // Order replies chronologically
          },
        },
      },
    });

    return new Response(JSON.stringify(updatedEntry), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating guestbook entry:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to update entry",
        details: (error as Error).message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// Delete a guestbook entry
export const DELETE: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  const session = cookies.get("user_session");

  if (!session?.value) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = JSON.parse(session.value);
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Entry ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingEntry = await prisma.guestbookEntry.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return new Response(JSON.stringify({ error: "Entry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (existingEntry.userId !== user.id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized to delete this entry" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await prisma.guestbookEntry.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Entry deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting guestbook entry:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to delete entry",
        details: (error as Error).message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  const session = cookies.get("user_session");

  if (!session?.value) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = JSON.parse(session.value);
    const existingUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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
