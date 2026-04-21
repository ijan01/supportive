import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getEmployerByUserId, updateEmployerLogo } from "@/lib/employers";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employer = await getEmployerByUserId(Number(session.user.id));
  if (!employer) {
    return NextResponse.json({ error: "Create your profile first" }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Use PNG, JPEG, WebP, or SVG." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Maximum 2MB." }, { status: 400 });
  }

  // Try Supabase Storage first, fall back to data URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let publicUrl: string;

  if (supabaseUrl && supabaseKey) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const ext = file.name.split(".").pop() || "png";
    const path = `${employer.id}/${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from("employer-logos")
      .upload(path, buffer, { contentType: file.type, upsert: true });

    if (error) {
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("employer-logos").getPublicUrl(path);
    publicUrl = urlData.publicUrl;
  } else {
    // Fallback: store as base64 data URL (works without Supabase Storage)
    const buffer = Buffer.from(await file.arrayBuffer());
    publicUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  await updateEmployerLogo(Number(session.user.id), publicUrl);

  return NextResponse.json({ ok: true, url: publicUrl });
}
