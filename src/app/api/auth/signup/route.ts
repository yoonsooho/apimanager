import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        // const formData = await req.formData();
        // const email = formData.get("email");
        // const password = formData.get("password");
        // const username = formData.get("username");
        const body = await req.json();
        const email = body?.email;
        const password = body?.password;
        const username = body?.username;

        if (typeof email === "string" && typeof password === "string" && typeof username === "string") {
            const hashedPassword = await bcrypt.hash(password, 12);

            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    username,
                },
            });
            return NextResponse.json({ message: "회원가입이 완료되었습니다." }, { status: 201 });
        } else {
            return NextResponse.json({ message: "잘못된 입력입니다." }, { status: 400 });
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const targetFields = error.meta?.target as string[];

            if (error.code === "P2002" && targetFields?.includes("email")) {
                return NextResponse.json({ message: "이미 가입된 이메일입니다." }, { status: 409 });
            } else if (error.code === "P2002" && targetFields?.includes("username")) {
                return NextResponse.json({ message: "이미 사용 중인 이름입니다." }, { status: 409 });
            }
        }

        console.error("회원가입 에러:", error);
        return NextResponse.json({ message: "회원가입 중 오류가 발생했습니다." }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
