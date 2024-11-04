import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

let prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const email = formData.get("email");
        const password = formData.get("password");
        const username = formData.get("username");

        if (typeof email === "string" && typeof password === "string" && typeof username === "string") {
            const hashedPassword = await bcrypt.hash(password, 12);

            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    username,
                },
            });
        } else {
            return NextResponse.json({ message: "잘못된 입력입니다." }, { status: 400 });
        }

        return NextResponse.redirect(new URL("/login", req.url), { status: 302 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
