import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const result = await sql`
      SELECT *
      FROM calls
      WHERE id = ${id} AND user_id = ${session.user.id}
      LIMIT 1
    `;

    if (result.length === 0) {
      return Response.json({ error: "Call not found" }, { status: 404 });
    }

    return Response.json({ call: result[0] });
  } catch (error) {
    console.error("GET /api/calls/[id] error:", error);
    return Response.json({ error: "Failed to fetch call" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Build dynamic update query
    const setClauses = [];
    const values = [];
    let paramCount = 1;

    if (body.title !== undefined) {
      setClauses.push(`title = $${paramCount}`);
      values.push(body.title);
      paramCount++;
    }

    if (body.summary !== undefined) {
      setClauses.push(`summary = $${paramCount}`);
      values.push(body.summary);
      paramCount++;
    }

    if (body.key_insights !== undefined) {
      setClauses.push(`key_insights = $${paramCount}`);
      values.push(body.key_insights);
      paramCount++;
    }

    if (body.pain_points !== undefined) {
      setClauses.push(`pain_points = $${paramCount}`);
      values.push(body.pain_points);
      paramCount++;
    }

    if (body.next_steps !== undefined) {
      setClauses.push(`next_steps = $${paramCount}`);
      values.push(body.next_steps);
      paramCount++;
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    setClauses.push(`updated_at = NOW()`);

    const query = `
      UPDATE calls
      SET ${setClauses.join(", ")}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await sql(query, [...values, id, session.user.id]);

    if (result.length === 0) {
      return Response.json({ error: "Call not found" }, { status: 404 });
    }

    return Response.json({ call: result[0] });
  } catch (error) {
    console.error("PUT /api/calls/[id] error:", error);
    return Response.json({ error: "Failed to update call" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const result = await sql`
      DELETE FROM calls
      WHERE id = ${id} AND user_id = ${session.user.id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Call not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/calls/[id] error:", error);
    return Response.json({ error: "Failed to delete call" }, { status: 500 });
  }
}
