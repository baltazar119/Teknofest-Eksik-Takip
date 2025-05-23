import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const kayitlar = await prisma.gonullu.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(kayitlar);
  } catch (error) {
    return NextResponse.json({ error: "Veriler alınamadı." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const tarih = formData.get("tarih") as string;
    const saatBasla = formData.get("saatBasla") as string;
    const saatBitis = formData.get("saatBitis") as string;
    const alan = formData.get("alan") as string;
    const catering = formData.get("catering") === "true";
    const file = formData.get("dosya") as File | null;

    if (!tarih || !saatBasla || !saatBitis || !alan) {
      return NextResponse.json({ error: "Eksik alanlar var." }, { status: 400 });
    }

    let filePath = "";

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = Date.now() + "-" + file.name.replace(/\s+/g, "_");
      filePath = `/uploads/${fileName}`;
      const fullPath = path.join(process.cwd(), "public", "uploads", fileName);
      await writeFile(fullPath, buffer);
    }

    const kayit = await prisma.gonullu.create({
      data: {
        tarih: new Date(tarih),
        saatBasla,
        saatBitis,
        alan,
        catering,
        dosyaYolu: filePath,
      },
    });

    return NextResponse.json({ success: true, kayit });
  } catch (error) {
    return NextResponse.json({ error: "Kayıt yapılamadı." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID eksik" }, { status: 400 });
    }

    await prisma.gonullu.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID eksik" }, { status: 400 });
    }

    const body = await req.json();

    await prisma.gonullu.update({
      where: { id: parseInt(id) },
      data: {
        tarih: new Date(body.tarih),
        saatBasla: body.saatBasla,
        saatBitis: body.saatBitis,
        alan: body.alan,
        catering: body.catering,
        dosyaYolu: body.dosyaYolu,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
