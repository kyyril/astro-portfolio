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
