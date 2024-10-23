import { jwtConfig } from "./tokenScrest";
import * as jose from "jose";

export const getTokenInUserId = async (accessToken: string) => {
    const token = accessToken.replace("Bearer ", "");
    const decoded = await jose.jwtVerify(token, jwtConfig.secret);

    return decoded.payload.userId as number;
};
