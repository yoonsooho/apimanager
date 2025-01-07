import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const { projectId, id } = await req.json();

        const prisma = new PrismaClient();
        const deleteRowData = await prisma.rowData.delete({
            where: {
                projectId: projectId,
                id: id,
            },
        });
        return NextResponse.json({
            message: "성공",
            data: deleteRowData,
        });
    } catch (error) {
        if (error) {
            return NextResponse.error();
        }
    }
}
