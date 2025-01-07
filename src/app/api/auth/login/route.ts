import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const emailEntry = data?.email;
        const passwordEntry = data?.password;

        // 값이 'string'인 경우만 처리하기 위해 타입 체크
        const email = typeof emailEntry === "string" ? emailEntry : undefined;
        const password = typeof passwordEntry === "string" ? passwordEntry : undefined;

        const prisma = new PrismaClient();

        if (email && password) {
            const hash = bcrypt.hashSync(password, 12);
            const match = await bcrypt.compare(password, hash);
            if (!match) return NextResponse.json({ message: "비밀번호가 틀렸습니다." });
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            // if (!user) return NextResponse.json({ status: 401, message: "아이디 혹은 비밀번호를 잘못입력하셨습니다." });
            if (!user) {
                return new Response(JSON.stringify({ message: "아이디 혹은 비밀번호를 잘못 입력하셨습니다." }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }
            if (!process.env.JWT_SECRET_KEY) {
                return new Response(JSON.stringify({ message: "아이디 혹은 비밀번호를 잘못 입력하셨습니다." }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
            // JWT 토큰 생성 (예시)
            const refreshToken = jwt.sign(
                { userId: user?.id, email: user?.email, username: user.username },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: "15h",
                }
            );
            const accessToken = jwt.sign(
                { userId: user?.id, email: user?.email, username: user.username },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: "15h",
                }
            );
            // 리다이렉트와 함께 쿠키 설정
            const response = NextResponse.json({ status: 200, message: "로그인에 성공했습니다." });

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
            return NextResponse.json({ status: 401, message: "잘못된 입력입니다." });
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
