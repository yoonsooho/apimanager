import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        if (req.body === null) return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
        const data = await req.json();

        if (typeof data?.name === "string") {
            const result = await prisma.project.create({
                data: {
                    name: data.name,
                    userProjects: {
                        create: {
                            userId: data.userId, // 사용자 ID
                            role: "VIEWER", // 권한 설정
                        },
                    },
                },
            });
            return NextResponse.json({ message: "성공했습니다.", data: result }, { status: 200 });
        } else {
            return NextResponse.json({ message: "잘못된 입력입니다." }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const userId = searchParams.get("userId");

        if (userId) {
            const result = await prisma.project.findMany({
                where: {
                    userProjects: {
                        some: {
                            // 'some'을 사용하여 userId가 일치하는 경우를 찾습니다.
                            userId: Number(userId),
                        },
                    },
                },
                select: {
                    id: true, // 프로젝트 ID
                    name: true, // 프로젝트 이름
                },
            });
            return NextResponse.json({ data: result }, { status: 200 });
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
