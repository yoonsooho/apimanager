import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const { id, status, method, endPoint, queryString, request, response, memo, projectId } = await req.json();

        const prisma = new PrismaClient();
        const changeRowData = await prisma.rowData.update({
            where: {
                projectId: projectId,
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
                updatedAt: new Date(),
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
                updatedAt: new Date(),
                id,
                projectId,
            },
        });
    } catch (error) {
        if (error) {
            return NextResponse.error();
        }
    }
}
