import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // 리다이렉트와 함께 쿠키 설정
        const response = NextResponse.redirect(new URL("/login", req.url));

        // 쿠키 설정 (예시: 토큰 저장)
        response.cookies.set("refreshToken", "", {
            httpOnly: true,
            secure: true, // https를 사용하는 경우에만 전송
            maxAge: 0, // 15시간 동안 유효 추후 수정 필요
            path: "/", // 쿠키가 유효한 경로
        });
        response.cookies.set("accessToken", "", {
            httpOnly: false,
            secure: true, // https를 사용하는 경우에만 전송
            maxAge: 0, // 15시간 동안 유효 추후 수정 필요
            path: "/", // 쿠키가 유효한 경로
        });
        return response;
    } catch (error) {
        if (error) {
            return NextResponse.error();
        }
    }
}
