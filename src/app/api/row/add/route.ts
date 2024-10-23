import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId, status, method, endPoint, queryString, request, response, memo } = await req.json();
        // jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        //     if (err) return res.sendStatus(403);
        //     res.json({ message: "Protected data", user });
        // });
        const prisma = new PrismaClient();
        const addRowData = await prisma.rowData.create({
            data: {
                status,
                method,
                endPoint,
                queryString,
                request,
                response,
                memo,
                updated_at: new Date(),
                userId: userId,
            },
        });

        return NextResponse.json({
            message: "성공",
            data: addRowData,
        });
    } catch (error) {
        if (error) {
            return NextResponse.error();
        }
    }
}
