import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.idToken) {
      return NextResponse.json({ message: "Не авторизовано" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${process.env.INTERNAL_API_URL}/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.idToken}`,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    let data;
    try {
      data = text ? JSON.parse(text) : { message: "Успішно" };
    } catch (e) {
      data = { message: text || "Невідома помилка від сервера" };
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Помилка проксі-запиту до бекенду:", error);
    return NextResponse.json(
      { message: "Внутрішня помилка сервера" },
      { status: 500 },
    );
  }
}
