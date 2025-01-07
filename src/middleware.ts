import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isReqAuthenticated } from "./lib/jwtTokenControl";

export async function middleware(req: NextRequest) {
    // 로그인 및 Next.js 내부 요청은 미들웨어를 통과시킴
    if (
        req.nextUrl.pathname === "/login" ||
        req.nextUrl.pathname === "/signUp" ||
        req.nextUrl.pathname === "/api/auth/login" ||
        req.nextUrl.pathname.startsWith("/_next")
    ) {
        return NextResponse.next();
    }

    if (req.nextUrl.pathname.startsWith("/api/")) {
        // const refreshToken = req.cookies.get("refreshToken");
        // if (req.headers.get("Authorization")) {
        // } else {
        //     return NextResponse.json({ error: "unAuth" }, { status: 401 });
        // }

        return NextResponse.next(); // API 요청은 인증 체크를 건너뜁니다.
    }
    // 인증 확인
    const result = await isReqAuthenticated(req);

    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!result) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 인증된 경우 요청 통과
    return NextResponse.next();
}
