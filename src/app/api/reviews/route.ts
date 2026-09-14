import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "reviews.json");

function readData() {
  try {
    const raw = readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeData(data: unknown[]) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function sanitize(str: string): string {
  return str.replace(/[<>"'&]/g, (c) => {
    const map: Record<string, string> = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" };
    return map[c] || c;
  });
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === "string") {
      cleaned[key] = sanitize(val);
    } else {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

export async function GET() {
  try {
    const reviews = readData();
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Failed to read reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.rating || !body.text) {
      return NextResponse.json({ error: "Name, rating, and text are required" }, { status: 400 });
    }
    const reviews = readData();
    const newReview = { ...sanitizeObject(body), id: Date.now(), date: new Date().toISOString().split("T")[0] };
    reviews.push(newReview);
    writeData(reviews);
    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
    }
    const reviews = readData();
    const filtered = reviews.filter((r: { id: number }) => r.id !== body.id);
    writeData(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}