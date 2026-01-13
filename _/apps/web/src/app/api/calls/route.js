import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, transcript } = body;

    if (!title || !transcript) {
      return Response.json(
        { error: "Title and transcript are required" },
        { status: 400 },
      );
    }

    // Process transcript with AI
    const aiResponse = await fetch(
      `${process.env.APP_URL}/integrations/chat-gpt/conversationgpt4`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an AI assistant that analyzes sales call transcripts. Extract the following information:
1. Summary: A brief overview of the call (2-3 sentences)
2. Key Insights: Important points discussed, customer needs, interests (bullet points)
3. Pain Points: Problems or challenges mentioned by the customer (bullet points)
4. Next Steps: Action items and follow-ups needed (bullet points)

Return your response in JSON format with these exact keys: summary, key_insights, pain_points, next_steps.
Each field should be a string. Use newline characters for bullet points.`,
            },
            {
              role: "user",
              content: `Analyze this sales call transcript:\n\n${transcript}`,
            },
          ],
          json_schema: {
            name: "call_analysis",
            schema: {
              type: "object",
              properties: {
                summary: { type: "string" },
                key_insights: { type: "string" },
                pain_points: { type: "string" },
                next_steps: { type: "string" },
              },
              required: [
                "summary",
                "key_insights",
                "pain_points",
                "next_steps",
              ],
              additionalProperties: false,
            },
            strict: true,
          },
        }),
      },
    );

    if (!aiResponse.ok) {
      throw new Error("AI processing failed");
    }

    const aiData = await aiResponse.json();
    const analysis = JSON.parse(aiData.choices[0].message.content);

    // Insert into database
    const result = await sql`
      INSERT INTO calls (user_id, title, transcript, summary, key_insights, pain_points, next_steps)
      VALUES (${session.user.id}, ${title}, ${transcript}, ${analysis.summary}, ${analysis.key_insights}, ${analysis.pain_points}, ${analysis.next_steps})
      RETURNING *
    `;

    return Response.json({ call: result[0] });
  } catch (error) {
    console.error("POST /api/calls error:", error);
    return Response.json({ error: "Failed to create call" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const calls = await sql`
      SELECT id, title, summary, created_at
      FROM calls
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return Response.json({ calls });
  } catch (error) {
    console.error("GET /api/calls error:", error);
    return Response.json({ error: "Failed to fetch calls" }, { status: 500 });
  }
}
