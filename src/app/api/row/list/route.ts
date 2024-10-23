import { Prisma, PrismaClient } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const prisma = new PrismaClient();
    try {
        console.log("reqreqreqreqreq", req);
        const searchParams = req.nextUrl.searchParams;
        const userId = searchParams.get("userId");

        // rowData를 조회
        const rowData = await prisma.rowData.findMany({
            where: {
                userId: Number(userId),
            },
            orderBy: {
                id: "asc", // 오름차순 정렬
            },
        });

        // 성공 시 응답
        return NextResponse.json({
            message: "성공",
            data: rowData,
        });
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma known error:", error);
            // Prisma에서 발생한 에러의 코드에 따라 추가 처리 가능
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            console.error("Prisma validation error:", error);
        } else {
            console.error("Unknown error:", error);
        }

        // 에러 응답 처리
        return NextResponse.json(
            {
                message: "오류 발생",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
//     console.log("params.id", params.userId);
//     return NextResponse.json({ msg: `${params.userId}` });
// }
