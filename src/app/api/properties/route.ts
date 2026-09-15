import { NextResponse } from "next/server";
import pool, { ensureDB } from "@/lib/db";
import { uploadVideo, deleteVideo } from "@/lib/storage";

export const maxDuration = 60;

function sanitize(str: string): string {
  if (str.length > 10000) return str;
  return str.replace(/[<>"'&]/g, (c) => {
    const map: Record<string, string> = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" };
    return map[c] || c;
  });
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
    const contentType = request.headers.get("content-type") || "";
    const data: Record<string, string> = {};
    let videoFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (key === "video" && value instanceof File) {
          videoFile = value;
        } else if (typeof value === "string") {
          data[key] = sanitize(value);
        }
      }
    } else {
      const body = await request.json();
      for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
          data[key] = sanitize(value);
        }
      }
    }

    if (!data.name || !data.location || !data.size || !data.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let videoUrl = data.video_url || "";
    if (videoFile && videoFile.size > 0) {
      const uploaded = await uploadVideo(videoFile);
      if (uploaded) videoUrl = uploaded;
    }

    const id = Date.now();
    await pool.query(
      "INSERT INTO properties (id, name, type, location, size, price, status, feat1, feat2, feat3, image, description, video_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
      [id, data.name, data.type || "Agricultural", data.location, data.size, data.price, data.status || "Available", data.feat1 || "", data.feat2 || "", data.feat3 || "", data.image || "", data.description || "", videoUrl]
    );
    return NextResponse.json({ success: true, property: { id, ...data, video_url: videoUrl } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureDB();
    const contentType = request.headers.get("content-type") || "";
    const data: Record<string, string> = {};
    let videoFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (key === "video" && value instanceof File) {
          videoFile = value;
        } else if (typeof value === "string") {
          data[key] = sanitize(value);
        }
      }
    } else {
      const body = await request.json();
      for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
          data[key] = sanitize(value);
        }
      }
    }

    if (!data.id) {
      return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
    }

    let videoUrl = data.video_url || "";
    if (videoFile && videoFile.size > 0) {
      const uploaded = await uploadVideo(videoFile);
      if (uploaded) videoUrl = uploaded;
    }

    await pool.query(
      "UPDATE properties SET name=$1, type=$2, location=$3, size=$4, price=$5, status=$6, feat1=$7, feat2=$8, feat3=$9, image=$10, description=$11, video_url=$12 WHERE id=$13",
      [data.name, data.type, data.location, data.size, data.price, data.status, data.feat1, data.feat2, data.feat3, data.image, data.description, videoUrl, data.id]
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
    const result = await pool.query("SELECT video_url FROM properties WHERE id=$1", [body.id]);
    if (result.rows[0]?.video_url) {
      await deleteVideo(result.rows[0].video_url);
    }
    await pool.query("DELETE FROM properties WHERE id=$1", [body.id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}