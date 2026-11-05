import { NextResponse } from "next/server";
import { getMedia, addMedia, addMultipleMedia, deleteMedia } from "@/lib/cmsDataStore";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || undefined;
    const search = searchParams.get("search") || undefined;
    const media = getMedia();
    let filtered = media;

    if (folder && folder !== "all") {
      filtered = filtered.filter((m) => m.folder === folder);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(s) ||
          m.altText?.toLowerCase().includes(s) ||
          m.url.toLowerCase().includes(s)
      );
    }

    return NextResponse.json({ success: true, data: filtered, total: filtered.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const folder = (formData.get("folder") as string) || "general";
      const altText = (formData.get("altText") as string) || "";

      // Support multiple files from "files" or "file" or both
      let incomingFiles: File[] = [];
      const filesFromList = formData.getAll("files") as File[];
      const filesFromSingle = formData.getAll("file") as File[];

      if (filesFromList.length > 0) {
        incomingFiles.push(...filesFromList.filter((f) => f && typeof f === "object" && f.name));
      }
      if (filesFromSingle.length > 0) {
        for (const f of filesFromSingle) {
          if (f && typeof f === "object" && f.name && !incomingFiles.includes(f)) {
            incomingFiles.push(f);
          }
        }
      }

      if (incomingFiles.length === 0) {
        return NextResponse.json({ success: false, error: "No image files provided." }, { status: 400 });
      }

      const uploadsDir = path.join(process.cwd(), "public", "assets", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
      const preparedMedia: Array<{
        name: string;
        url: string;
        size: number;
        mimeType: string;
        folder: "banners" | "products" | "categories" | "general";
        altText: string;
      }> = [];

      for (let i = 0; i < incomingFiles.length; i++) {
        const file = incomingFiles[i];
        
        // Validation: mime type check
        const ext = path.extname(file.name).toLowerCase();
        const mime = file.type || (ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg");
        
        if (!allowedMimes.includes(mime) && !mime.startsWith("image/")) {
          return NextResponse.json(
            { success: false, error: `Unsupported file format for "${file.name}". Please upload JPG, PNG, or WEBP.` },
            { status: 400 }
          );
        }

        // Validation: max 20MB per file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        if (buffer.length > 20 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, error: `File "${file.name}" exceeds 20MB limit.` },
            { status: 400 }
          );
        }

        const safeBaseName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const safeName = `${Date.now()}_${i}_${safeBaseName}`;
        const filePath = path.join(uploadsDir, safeName);
        fs.writeFileSync(filePath, buffer);

        const url = `/assets/uploads/${safeName}`;

        preparedMedia.push({
          name: file.name,
          url,
          size: buffer.length,
          mimeType: mime,
          folder: folder as any,
          altText: altText || file.name,
        });
      }

      const createdList = addMultipleMedia(preparedMedia);

      return NextResponse.json({
        success: true,
        count: createdList.length,
        data: createdList.length === 1 ? createdList[0] : createdList,
        files: createdList,
      }, { status: 201 });
    } else {
      // JSON payload (e.g. external URL or existing asset registered)
      const body = await request.json();
      if (Array.isArray(body)) {
        const created = addMultipleMedia(body);
        return NextResponse.json({ success: true, data: created }, { status: 201 });
      } else {
        const newMedia = addMedia(body);
        return NextResponse.json({ success: true, data: newMedia }, { status: 201 });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    const success = deleteMedia(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
