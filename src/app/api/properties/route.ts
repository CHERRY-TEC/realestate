import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "properties.json");

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
    const props = readData();
    return NextResponse.json(props);
  } catch {
    return NextResponse.json({ error: "Failed to read properties" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.location || !body.size || !body.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const props = readData();
    const newProp = { ...sanitizeObject(body), id: Date.now() };
    props.push(newProp);
    writeData(props);
    return NextResponse.json({ success: true, property: newProp }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
    }
    const props = readData();
    const idx = props.findIndex((p: { id: number }) => p.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Property not found" }, { status: 404 });
    props[idx] = { ...props[idx], ...sanitizeObject(body) };
    writeData(props);
    return NextResponse.json({ success: true, property: props[idx] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
    }
    const props = readData();
    const filtered = props.filter((p: { id: number }) => p.id !== body.id);
    writeData(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
