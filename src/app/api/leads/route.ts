import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "leads.json");

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
    const leads = readData();
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "Failed to read leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }
    const leads = readData();
    const newLead = { ...sanitizeObject(body), id: Date.now() };
    leads.push(newLead);
    writeData(leads);
    return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
    }
    const leads = readData();
    const idx = leads.findIndex((l: { id: number }) => l.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    leads[idx] = { ...leads[idx], ...sanitizeObject(body) };
    writeData(leads);
    return NextResponse.json({ success: true, lead: leads[idx] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
    }
    const leads = readData();
    const filtered = leads.filter((l: { id: number }) => l.id !== body.id);
    writeData(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
