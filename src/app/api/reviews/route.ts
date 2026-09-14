import { NextResponse } from "next/server";
import pool, { ensureDB } from "@/lib/db";

function sanitize(str: string): string {
  return str.replace(/[<>"'&]/g, (c) => {
    const map: Record<string, string> = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" };
    return map[c] || c;
  });
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    cleaned[key] = typeof val === "string" ? sanitize(val) : val;
  }
  return cleaned;
}

export async function GET() {
  try {
    await ensureDB();
    const result = await pool.query("SELECT * FROM reviews ORDER BY id DESC");
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: "Failed to read reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDB();
    const body = await request.json();
    if (!body.name || !body.rating || !body.text) {
      return NextResponse.json({ error: "Name, rating, and text are required" }, { status: 400 });
    }
    const data = sanitizeObject(body);
    const id = Date.now();
    const date = new Date().toISOString().split("T")[0];
    await pool.query(
      "INSERT INTO reviews (id, name, rating, text, date, type) VALUES ($1,$2,$3,$4,$5,$6)",
      [id, data.name, data.rating, data.text, date, data.type || "buyer"]
    );
    return NextResponse.json({ success: true, review: { id, ...data, date } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureDB();
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
    }
    await pool.query("DELETE FROM reviews WHERE id=$1", [body.id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}