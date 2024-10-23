"use client";
import { rowElementType } from "@/type/rowElementType";
import dayjs from "dayjs";
import { toast } from "react-toastify";

type TableElementProps = Omit<rowElementType, "created_at"> & {
    changeRowFn: (id: number, key: string, value: string) => void;
    changeAllRowFn: (id: number, data: rowElementType) => void;
    delteAllRowFn: (id: number) => void;
};

const TableElement = ({
    status,
    method,
    endPoint,
    queryString,
    request,
    response,
    memo,
    updated_at,
    userId,
    id,
    changeRowFn,
    changeAllRowFn,
    delteAllRowFn,
}: TableElementProps) => {
    return (
        <>
            <td className="border border-gray-400">
                <select
                    name=""
                    id=""
                    key={`${id} ${status}`}
                    value={status}
                    onChange={(e) => {
                        // rowValueChangeFn("status", e.target.value);
                        changeRowFn(id, "status", e.target.value);
                    }}
                >
                    <option value="시작전">시작전</option>
                    <option value="중단됨">중단됨</option>
                    <option value="진행중">진행중</option>
                    <option value="수정완료">수정완료</option>
                    <option value="최종완료">최종완료</option>
                </select>
            </td>
            <td className="border border-gray-400">
                <select
                    name=""
                    id=""
                    key={`${id} ${method}`}
                    value={method}
                    onChange={(e) => {
                        changeRowFn(id, "method", e.target.value);
                    }}
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </td>
            <td className="border border-gray-400">
                <textarea
                    name=""
                    id=""
                    value={endPoint}
                    className="min-h-full resize-none"
                    onChange={(e) => {
                        changeRowFn(id, "endPoint", e.target.value);
                    }}
                />
            </td>
            <td className="border border-gray-400">
                <textarea
                    name=""
                    id=""
                    value={queryString}
                    className="min-h-full resize-none"
                    onChange={(e) => {
                        changeRowFn(id, "queryString", e.target.value);
                    }}
                />
            </td>
            <td className="border border-gray-400">
                {/* 요청 보낼때 request(일단JSON) */}
                {/* {JSON.stringify(requestJSON)} */}
                {request &&
                    typeof request === "object" &&
                    !Array.isArray(request) &&
                    Object.entries(request).map(([key, value]) => {
                        return (
                            <div key={`request${key}`} className="whitespace-nowrap">
                                <span className="text-red-300">{key}</span> :{" "}
                                <span>{value !== null && value?.toString()}</span>
                            </div>
                        );
                    })}
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(request));
                        toast.success("json으로 복사 되었습니다.");
                        console.log(JSON.stringify(request));
                    }}
                >
                    toJSON COPY
                </button>
            </td>
            <td className="border border-gray-400">
                {response &&
                    typeof response === "object" &&
                    !Array.isArray(response) &&
                    Object.entries(response).map(([key, value]) => {
                        return (
                            <div key={`response${key}`} className="whitespace-nowrap">
                                <span className="text-red-300">{key}</span> :{" "}
                                <span>{value !== null && value?.toString()}</span>
                            </div>
                        );
                    })}
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(response));
                        toast.success("json으로 복사 되었습니다.");
                        console.log(JSON.stringify(response));
                    }}
                >
                    toJSON COPY
                </button>
            </td>
            <td className="border border-gray-400">
                <div className="flex-grow">
                    <textarea
                        value={memo}
                        className="min-h-full resize-none"
                        onChange={(e) => {
                            changeRowFn(id, "memo", e.target.value);
                        }}
                    />
                </div>
            </td>
            <td className="border border-gray-400">{dayjs(updated_at).format("YYYY-MM-DD HH:mm:ssZ[Z]")}</td>
            <td className="border border-gray-400">
                <button
                    onClick={async () => {
                        console.log(id);
                        const result = await fetch(`/api/row/${id === 0 ? "add" : "change"}`, {
                            method: id === 0 ? "POST" : "PUT",
                            body: JSON.stringify({
                                status,
                                method,
                                endPoint,
                                queryString,
                                request,
                                response,
                                memo,
                                updated_at,
                                userId,
                                id,
                            }),
                        });
                        if (!result.ok) {
                            toast.error("오류가 발생했습니다. 다시 시도해 주세요.");
                        }
                        const data = await result.json();
                        data.data.updated_at = new Date(data.data.updated_at);
                        changeAllRowFn(id, data.data);
                        toast.success(id === 0 ? "추가가 완료 되었습니다." : "수정이 완료 되었습니다.");
                    }}
                >
                    {id}
                    {id === 0 ? "추가하기" : "수정하기"}
                </button>
            </td>
            <td className="border border-gray-400">
                <button
                    onClick={async () => {
                        const result = await fetch(`/api/row/delete`, {
                            method: "DELETE",
                            body: JSON.stringify({ id: id, userId: userId }),
                        });
                        if (!result.ok) {
                            toast.error("오류가 발생했습니다. 다시 시도해 주세요.");
                        }
                        const data = await result.json();

                        delteAllRowFn(data.data.id);
                        toast.success("삭제가 완료 되었습니다.");
                    }}
                >
                    삭제하기
                </button>
            </td>
        </>
    );
};

export default TableElement;
