import * as jose from "jose";
import { NextRequest } from "next/server";
import { jwtConfig } from "./tokenScrest";

export const isReqAuthenticated = async (req: NextRequest) => {
    let token =
        req.headers.get("authorization") || req.headers.get("Authorization") || req.cookies.get("accessToken")?.value;

    if (token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.replace("Bearer ", "");
            }

            const decoded = await jose.jwtVerify(token, jwtConfig.secret);

            if (decoded.payload?.userId) {
                return { userId: decoded.payload?.userId };
            } else {
                return false;
            }
        } catch (err) {
            console.error("isAuthenticated error: ", err);

            return false;
        }
    } else {
        return false;
    }
};

export const isAuthenticated = async (value: string) => {
    let token = value;

    if (token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.replace("Bearer ", "");
            }

            const decoded = await jose.jwtVerify(token, jwtConfig.secret);

            if (decoded.payload?.userId) {
                return { userId: decoded.payload?.userId };
            } else {
                return false;
            }
        } catch (err) {
            console.error("isAuthenticated error: ", err);

            return false;
        }
    } else {
        return false;
    }
};
