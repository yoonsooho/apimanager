import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const { userId, id, status, method, endPoint, queryString, request, response, memo } = await req.json();

        const prisma = new PrismaClient();
        const changeRowData = await prisma.rowData.update({
            where: {
                userId: userId,
                id: id,
            },
            data: {
                status,
                method,
                endPoint,
                queryString,
                request,
                response,
                memo,
                updated_at: new Date(),
            },
        });
        console.log("changeRowData", changeRowData);
        return NextResponse.json({
            message: "성공",
            data: {
                status,
                method,
                endPoint,
                queryString,
                request,
                response,
                memo,
                updated_at: new Date(),
                id,
                userId,
            },
        });
    } catch (error) {
        if (error) {
            return NextResponse.error();
        }
    }
}
