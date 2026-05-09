import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "Файл не знайдено" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "-")}`;

    const uploadDir = path.join(process.cwd(), "public/uploads/categories");
    await mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const imagePath = `/uploads/categories/${filename}`;

    return NextResponse.json({ imagePath }, { status: 201 });
  } catch (error) {
    console.error("Помилка завантаження файлу:", error);
    return NextResponse.json(
      { error: "Помилка сервера при завантаженні" },
      { status: 500 },
    );
  }
}
