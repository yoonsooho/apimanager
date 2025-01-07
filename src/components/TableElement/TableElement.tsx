"use client";
import { rowElementType } from "@/type/rowElementType";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef } from "react";
import { toast } from "react-toastify";

type TableElementProps = Omit<rowElementType, "createdAt" | "userId"> & {
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
    updatedAt,
    id,
    changeRowFn,
    changeAllRowFn,
    delteAllRowFn,
}: TableElementProps) => {
    const searchParams = useSearchParams();

    // 각 textarea에 대한 ref
    const endPointRef = useRef<HTMLTextAreaElement | null>(null);
    const queryStringRef = useRef<HTMLTextAreaElement | null>(null);
    const requestRef = useRef<HTMLTextAreaElement | null>(null);
    const responseRef = useRef<HTMLTextAreaElement | null>(null);
    const memoRef = useRef<HTMLTextAreaElement | null>(null);

    // 텍스트 영역 높이 자동 조정
    const adjustHeight = (textarea: HTMLTextAreaElement) => {
        if (textarea) {
            textarea.style.height = "auto"; // 높이를 초기화
            textarea.style.height = `${textarea.scrollHeight}px`; // 내용에 맞는 높이로 설정
        }
    };

    const onChangeFn = (key: string, e: ChangeEvent<HTMLTextAreaElement>) => {
        changeRowFn(id, key, e.target.value);
        adjustHeight(e.target); // e.target을 HTMLTextAreaElement로 타입 지정
    };

    // 컴포넌트 초기 렌더링 후 각 텍스트 영역의 높이를 자동으로 설정
    useEffect(() => {
        if (endPointRef.current) adjustHeight(endPointRef.current);
        if (queryStringRef.current) adjustHeight(queryStringRef.current);
        if (requestRef.current) adjustHeight(requestRef.current);
        if (responseRef.current) adjustHeight(responseRef.current);
        if (memoRef.current) adjustHeight(memoRef.current);
    }, [endPoint, queryString, request, response, memo]);

    return (
        <tr>
            <td className="border border-gray-400 p-2">
                <select
                    value={status}
                    onChange={(e) => changeRowFn(id, "status", e.target.value)}
                    className="w-full h-full"
                >
                    <option value="시작전">시작전</option>
                    <option value="중단됨">중단됨</option>
                    <option value="진행중">진행중</option>
                    <option value="수정완료">수정완료</option>
                    <option value="최종완료">최종완료</option>
                </select>
            </td>
            <td className="border border-gray-400 p-2">
                <select
                    value={method}
                    onChange={(e) => changeRowFn(id, "method", e.target.value)}
                    className="w-full h-full"
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </td>
            <td className="border border-gray-400 p-2 h-full">
                <textarea
                    ref={endPointRef}
                    value={endPoint}
                    className="w-full h-full resize-none overflow-hidden p-2"
                    onChange={(e) => onChangeFn("endPoint", e)}
                />
            </td>
            <td className="border border-gray-400 p-2">
                <textarea
                    ref={queryStringRef}
                    value={queryString}
                    className="w-full h-full resize-none overflow-hidden p-2"
                    onChange={(e) => onChangeFn("queryString", e)}
                />
            </td>
            <td className="border border-gray-400 p-2">
                <textarea
                    ref={requestRef}
                    value={request}
                    className="w-full h-full resize-none overflow-hidden p-2"
                    onChange={(e) => onChangeFn("request", e)}
                />
                <button
                    className="w-full mt-2 p-2 bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => {
                        // navigator.clipboard.writeText(JSON.stringify(request));
                        // toast.success("JSON으로 복사 되었습니다.");
                    }}
                >
                    toJSON COPY
                </button>
            </td>
            <td className="border border-gray-400 p-2">
                <textarea
                    ref={responseRef}
                    value={response}
                    className="w-full h-full resize-none overflow-hidden p-2"
                    onChange={(e) => onChangeFn("response", e)}
                />
                <button
                    className="w-full mt-2 p-2 bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => {
                        // navigator.clipboard.writeText(JSON.stringify(response));
                        // toast.success("JSON으로 복사 되었습니다.");
                    }}
                >
                    toJSON COPY
                </button>
            </td>
            <td className="border border-gray-400 p-2">
                <textarea
                    ref={memoRef}
                    value={memo}
                    className="w-full h-full resize-none overflow-hidden p-2"
                    onChange={(e) => onChangeFn("memo", e)}
                />
            </td>
            <td className="border border-gray-400 p-2">{dayjs(updatedAt).format("YYYY-MM-DD / HH:mm")}</td>
            <td className="border border-gray-400 p-2">
                <button
                    onClick={async () => {
                        console.log(endPoint.trim());
                        const result = await fetch(`/api/row/${id === 0 ? "add" : "change"}`, {
                            method: id === 0 ? "POST" : "PUT",
                            body: JSON.stringify({
                                status,
                                method,
                                endPoint: endPoint.trim(),
                                queryString: queryString.trim(),
                                request: request.trim(),
                                response: response.trim(),
                                memo: memo.trim(),
                                updatedAt,
                                id,
                                projectId: Number(searchParams.get("project")),
                            }),
                        });
                        if (!result.ok) {
                            toast.error("오류가 발생했습니다. 다시 시도해 주세요.");
                        }
                        const data = await result.json();
                        data.data.updatedAt = new Date(data.data.updatedAt);
                        changeAllRowFn(id, data.data);
                        toast.success(id === 0 ? "추가가 완료 되었습니다." : "수정이 완료 되었습니다.");
                    }}
                >
                    {id === 0 ? "추가하기" : "수정하기"}
                </button>
            </td>
            <td className="border border-gray-400 p-2">
                <button
                    onClick={async () => {
                        const result = await fetch(`/api/row/delete`, {
                            method: "DELETE",
                            body: JSON.stringify({ id: id }),
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
        </tr>
    );
};

export default TableElement;
