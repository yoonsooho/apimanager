import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const emailEntry = formData.get("email");
        const passwordEntry = formData.get("password");

        // 값이 'string'인 경우만 처리하기 위해 타입 체크
        const email = typeof emailEntry === "string" ? emailEntry : undefined;
        const password = typeof passwordEntry === "string" ? passwordEntry : undefined;

        const prisma = new PrismaClient();

        if (email && password) {
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                    password: password,
                },
            });
            if (!process.env.JWT_SECRET_KEY) return NextResponse.json({ message: "에러가 발생했습니다" });
            // JWT 토큰 생성 (예시)
            const refreshToken = jwt.sign({ userId: user?.id, email: user?.email }, process.env.JWT_SECRET_KEY, {
                expiresIn: "15h",
            });
            const accessToken = jwt.sign({ userId: user?.id, email: user?.email }, process.env.JWT_SECRET_KEY, {
                expiresIn: "15h",
            });
            // 리다이렉트와 함께 쿠키 설정
            const response = NextResponse.redirect(new URL("/", req.url));

            // 쿠키 설정 (예시: 토큰 저장)
            response.cookies.set("refreshToken", "Bearer " + refreshToken, {
                httpOnly: true,
                secure: true, // https를 사용하는 경우에만 전송
                maxAge: 60 * 60 * 15, // 15시간 동안 유효 추후 수정 필요
                path: "/", // 쿠키가 유효한 경로
            });
            response.cookies.set("accessToken", "Bearer " + accessToken, {
                httpOnly: false,
                secure: true, // https를 사용하는 경우에만 전송
                maxAge: 60 * 60 * 15, // 15시간 동안 유효 추후 수정 필요
                path: "/", // 쿠키가 유효한 경로
            });
            return response;
        } else {
            return NextResponse.json({ message: "잘못된 입력입니다." });
        }

        // const loginPw: string = data.userPw;
        // const userInfo: UserType = await User.findOne({ userId: data.userId }).exec();

        // if (userInfo == null) {
        //     return Response.json({ message: "계정이 존재하지 않습니다", result: "" });
        // }

        // const isMatched: boolean = await bcrypt.compare(loginPw, userInfo.userPw);

        // return Response.json({
        //     message: isMatched ? "OK" : "아이디 혹은 비밀번호를 확인해주세요.",
        // });
    } catch (error) {
        if (error) {
            return NextResponse.error();
        }
    }
}
