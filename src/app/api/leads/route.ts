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
    const result = await pool.query("SELECT * FROM leads ORDER BY id DESC");
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: "Failed to read leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDB();
    const body = await request.json();
    if (!body.name || !body.phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }
    const data = sanitizeObject(body);
    const id = Date.now();
    await pool.query(
      "INSERT INTO leads (id, name, phone, email, interest, message, date, status, type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [id, data.name, data.phone, data.email || "", data.interest || "", data.message || "", data.date || "", data.status || "New", data.type || "buyer"]
    );
    return NextResponse.json({ success: true, lead: { id, ...data } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureDB();
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
    }
    const data = sanitizeObject(body);
    await pool.query(
      "UPDATE leads SET name=$1, phone=$2, email=$3, interest=$4, message=$5, date=$6, status=$7, type=$8 WHERE id=$9",
      [data.name, data.phone, data.email, data.interest, data.message, data.date, data.status, data.type, body.id]
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureDB();
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
    }
    await pool.query("DELETE FROM leads WHERE id=$1", [body.id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}