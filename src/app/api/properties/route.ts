import { NextResponse } from "next/server";
import pool, { ensureDB } from "@/lib/db";

export const maxDuration = 60;

function sanitize(str: string): string {
  if (str.length > 10000) return str;
  return str.replace(/[<>"'&]/g, (c) => {
    const map: Record<string, string> = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" };
    return map[c] || c;
  });
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === "string" && !val.startsWith("data:")) {
      cleaned[key] = sanitize(val);
    } else {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

export async function GET() {
  try {
    await ensureDB();
    const result = await pool.query("SELECT * FROM properties ORDER BY id ASC");
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: "Failed to read properties" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDB();
    const body = await request.json();
    if (!body.name || !body.location || !body.size || !body.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const data = sanitizeObject(body);
    const id = Date.now();
    await pool.query(
      "INSERT INTO properties (id, name, type, location, size, price, status, feat1, feat2, feat3, image, description, video_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
      [id, data.name, data.type || "Agricultural", data.location, data.size, data.price, data.status || "Available", data.feat1 || "", data.feat2 || "", data.feat3 || "", data.image || "", data.description || "", data.video_url || ""]
    );
    return NextResponse.json({ success: true, property: { id, ...data } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureDB();
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
    }
    const data = sanitizeObject(body);
    await pool.query(
      "UPDATE properties SET name=$1, type=$2, location=$3, size=$4, price=$5, status=$6, feat1=$7, feat2=$8, feat3=$9, image=$10, description=$11, video_url=$12 WHERE id=$13",
      [data.name, data.type, data.location, data.size, data.price, data.status, data.feat1, data.feat2, data.feat3, data.image, data.description, data.video_url, body.id]
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
      return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
    }
    await pool.query("DELETE FROM properties WHERE id=$1", [body.id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}