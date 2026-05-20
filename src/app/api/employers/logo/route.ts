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

  const buffer = Buffer.from(await file.arrayBuffer());
  let publicUrl: string;

  const s3Bucket = process.env.S3_BUCKET_NAME;
  const awsRegion = process.env.AWS_REGION;

  if (s3Bucket && awsRegion) {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const s3 = new S3Client({ region: awsRegion });

    const ext = file.name.split(".").pop() || "png";
    const key = `employer-logos/${employer.id}/${Date.now()}.${ext}`;

    await s3.send(new PutObjectCommand({
      Bucket: s3Bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    publicUrl = `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com/${key}`;
  } else {
    publicUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  await updateEmployerLogo(Number(session.user.id), publicUrl);

  return NextResponse.json({ ok: true, url: publicUrl });
}
