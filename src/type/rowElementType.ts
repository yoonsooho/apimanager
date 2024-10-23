import { JsonValue } from "@prisma/client/runtime/library";

export type rowElementType = {
    status: string;
    method: string;
    endPoint: string;
    queryString: string;
    request: JsonValue;
    response: JsonValue;
    memo: string;
    updated_at: Date;
    created_at: Date;
    userId: number;
    id: number;
};
