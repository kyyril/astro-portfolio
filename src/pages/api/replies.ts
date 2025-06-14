import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  console.log("[API/REPLIES] POST request received");
  const session = cookies.get("user_session");

  if (!session?.value) {
    console.warn("[API/REPLIES] Authentication required: No session found");
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = JSON.parse(session.value);
    console.log(`[API/REPLIES] User from session: ${JSON.stringify(user)}`);

    const { guestbookEntryId, content } = await request.json();
    console.log(
      `[API/REPLIES] Received data - guestbookEntryId: ${guestbookEntryId}, content: ${content}`
    );

    if (!guestbookEntryId) {
      console.error(
        "[API/REPLIES] Validation error: Guestbook Entry ID is required"
      );
      return new Response(
        JSON.stringify({ error: "Guestbook Entry ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!content || content.trim().length === 0) {
      console.error(
        "[API/REPLIES] Validation error: Reply content is required"
      );
      return new Response(
        JSON.stringify({ error: "Reply content is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (content.length > 500) {
      console.error("[API/REPLIES] Validation error: Reply content too long");
      return new Response(
        JSON.stringify({
          error: "Reply content too long (max 500 characters)",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify the guestbook entry exists
    const existingEntry = await prisma.guestbookEntry.findUnique({
      where: { id: guestbookEntryId },
    });

    if (!existingEntry) {
      console.error(
        `[API/REPLIES] Guestbook Entry not found for ID: ${guestbookEntryId}`
      );
      return new Response(
        JSON.stringify({ error: "Guestbook Entry not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const reply = await prisma.reply.create({
      data: {
        content: content.trim(),
        authorId: user.id,
        guestbookEntryId: guestbookEntryId,
        userId: user.id, // Assuming userId is the same as authorId for simplicity, or adjust as needed
      },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    console.log(
      `[API/REPLIES] Reply created successfully: ${JSON.stringify(reply)}`
    );
    return new Response(JSON.stringify(reply), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[API/REPLIES] Error creating reply:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create reply",
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
  console.log("[API/REPLIES] PUT request received");
  const session = cookies.get("user_session");

  if (!session?.value) {
    console.warn("[API/REPLIES] Authentication required: No session found");
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = JSON.parse(session.value);
    const { id, content } = await request.json();
    console.log(
      `[API/REPLIES] Received data for PUT - id: ${id}, content: ${content}`
    );

    if (!id) {
      console.error(
        "[API/REPLIES] Validation error: Reply ID is required for update"
      );
      return new Response(JSON.stringify({ error: "Reply ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!content || content.trim().length === 0) {
      console.error(
        "[API/REPLIES] Validation error: Reply content is required for update"
      );
      return new Response(
        JSON.stringify({ error: "Reply content is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (content.length > 500) {
      console.error(
        "[API/REPLIES] Validation error: Reply content too long for update"
      );
      return new Response(
        JSON.stringify({
          error: "Reply content too long (max 500 characters)",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingReply = await prisma.reply.findUnique({
      where: { id },
    });

    if (!existingReply) {
      console.error(`[API/REPLIES] Reply not found for ID: ${id}`);
      return new Response(JSON.stringify({ error: "Reply not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (existingReply.authorId !== user.id) {
      console.warn(
        `[API/REPLIES] Unauthorized attempt to update reply by user ${user.id} for reply author ${existingReply.authorId}`
      );
      return new Response(
        JSON.stringify({ error: "Unauthorized to update this reply" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updatedReply = await prisma.reply.update({
      where: { id },
      data: {
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    console.log(
      `[API/REPLIES] Reply updated successfully: ${JSON.stringify(
        updatedReply
      )}`
    );
    return new Response(JSON.stringify(updatedReply), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[API/REPLIES] Error updating reply:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to update reply",
        details: (error as Error).message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const DELETE: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  console.log("[API/REPLIES] DELETE request received");
  const session = cookies.get("user_session");

  if (!session?.value) {
    console.warn("[API/REPLIES] Authentication required: No session found");
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = JSON.parse(session.value);
    const { id } = await request.json();
    console.log(`[API/REPLIES] Received data for DELETE - id: ${id}`);

    if (!id) {
      console.error(
        "[API/REPLIES] Validation error: Reply ID is required for deletion"
      );
      return new Response(JSON.stringify({ error: "Reply ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingReply = await prisma.reply.findUnique({
      where: { id },
    });

    if (!existingReply) {
      console.error(`[API/REPLIES] Reply not found for ID: ${id}`);
      return new Response(JSON.stringify({ error: "Reply not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (existingReply.authorId !== user.id) {
      console.warn(
        `[API/REPLIES] Unauthorized attempt to delete reply by user ${user.id} for reply author ${existingReply.authorId}`
      );
      return new Response(
        JSON.stringify({ error: "Unauthorized to delete this reply" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await prisma.reply.delete({
      where: { id },
    });

    console.log(`[API/REPLIES] Reply deleted successfully: ID ${id}`);
    return new Response(
      JSON.stringify({ message: "Reply deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[API/REPLIES] Error deleting reply:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to delete reply",
        details: (error as Error).message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
