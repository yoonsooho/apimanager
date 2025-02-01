import { NextRequest, NextResponse } from "next/server";

// Edge Runtime 설정 추가
export const runtime = "edge";

export async function POST(req: NextRequest) {
    try {
        // 리다이렉트와 함께 쿠키 설정
        const response = NextResponse.redirect(new URL("/login", req.url), {
            // 301: Moved Permanently
            // 302: Found (임시 리다이렉션)
            // 303: See Other (POST 요청 후 GET으로 리다이렉트)
            status: 303,
        });

        // 쿠키 설정
        response.cookies.set("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // 프로덕션에서만 secure
            maxAge: 0,
            path: "/",
        });
        response.cookies.set("accessToken", "", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            path: "/",
        });
        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// OPTIONS 메서드 추가
export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            Allow: "POST, OPTIONS",
        },
    });
}
