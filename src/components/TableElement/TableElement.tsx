"use client";
import { rowElementType } from "@/type/rowElementType";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Listbox, Transition, ListboxOptions, ListboxButton, ListboxOption } from "@headlessui/react";
import { Fragment } from "react";

type TableElementProps = Omit<rowElementType, "createdAt" | "userId"> & {
    changeRowFn: (id: number, key: string, value: string) => void;
    changeAllRowFn: (id: number, data: rowElementType) => void;
    delteAllRowFn: (id: number) => void;
};

const statusOptions = [
    { value: "시작전", label: "시작전" },
    { value: "중단됨", label: "중단됨" },
    { value: "진행중", label: "진행중" },
    { value: "수정완료", label: "수정완료" },
    { value: "최종완료", label: "최종완료" },
];

const methodOptions = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "PATCH", label: "PATCH" },
    { value: "DELETE", label: "DELETE" },
];

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

    // 텍스트 영역 높이 자동 조정 함수 수정
    const adjustHeight = (textarea: HTMLTextAreaElement) => {
        if (textarea) {
            textarea.style.height = "38px"; // 고정된 기본 높이
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = Math.max(38, scrollHeight) + "px";
        }
    };

    const copyJson = (json: string) => {
        navigator.clipboard.writeText(json);
        toast.success("JSON 복사가 완료 되었습니다.");
    };

    const formatJson = (value: string) => {
        try {
            // 1. 먼저 일반적인 JSON 파싱 시도
            const parsed = JSON.parse(value);
            return JSON.stringify(parsed, null, 2);
        } catch {
            try {
                // 2. 키값에 따옴표가 없는 경우를 처리
                const correctedJson = value
                    .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // 키에 따옴표 추가
                    .replace(/:\s*([^",\s{}]+)/g, ':"$1"'); // 값에 따옴표 추가
                const parsed = JSON.parse(correctedJson);
                return JSON.stringify(parsed, null, 2);
            } catch {
                // 3. 모든 파싱 시도 실패시 원래 값 반환
                return value;
            }
        }
    };

    const onChangeFn = (key: string, e: ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value;
        // request와 response 필드의 경우 JSON 포매팅 시도
        if (key === "request" || key === "response") {
            try {
                // 마지막 문자가 닫는 중괄호일 경우에만 포매팅 시도
                if (value.trim().endsWith("}")) {
                    const parsed = JSON.parse(value);
                    value = JSON.stringify(parsed, null, 2);
                }
            } catch {
                // 파싱 실패시 원래 값 사용
            }
        }
        changeRowFn(id, key, value);
        adjustHeight(e.target);
    };

    // 컴포넌트 초기 렌더링 후 각 텍스트 영역의 높이를 자동으로 설정
    useEffect(() => {
        if (endPointRef.current) adjustHeight(endPointRef.current);
        if (queryStringRef.current) adjustHeight(queryStringRef.current);
        if (requestRef.current) adjustHeight(requestRef.current);
        if (responseRef.current) adjustHeight(responseRef.current);
        if (memoRef.current) adjustHeight(memoRef.current);
    }, [endPoint, queryString, request, response, memo]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "시작전":
                return "bg-gray-100 text-gray-700";
            case "중단됨":
                return "bg-red-100 text-red-700";
            case "진행중":
                return "bg-yellow-100 text-yellow-700";
            case "수정완료":
                return "bg-blue-100 text-blue-700";
            case "최종완료":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getMethodColor = (method: string) => {
        switch (method) {
            case "GET":
                return "bg-green-100 text-green-700";
            case "POST":
                return "bg-blue-100 text-blue-700";
            case "PUT":
                return "bg-yellow-100 text-yellow-700";
            case "PATCH":
                return "bg-orange-100 text-orange-700";
            case "DELETE":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-3 py-2 align-middle min-w-[100px] relative">
                <Listbox value={status} onChange={(value) => changeRowFn(id, "status", value)}>
                    <div className="relative">
                        <ListboxButton
                            className={`relative w-full cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-left ${getStatusColor(
                                status
                            )}`}
                        >
                            <span className="block truncate">{status}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </span>
                        </ListboxButton>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            enter="transition ease-in duration-100"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                        >
                            <ListboxOptions className="fixed left-auto top-auto z-[9999] mt-1 w-48 max-h-60 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border">
                                {statusOptions.map((option) => (
                                    <ListboxOption
                                        key={option.value}
                                        value={option.value}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                                                active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected ? "font-medium" : "font-normal"
                                                    }`}
                                                >
                                                    {option.label}
                                                </span>
                                                {selected && (
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </Listbox>
            </td>
            <td className="px-3 py-2 align-middle min-w-[90px] relative">
                <Listbox value={method} onChange={(value) => changeRowFn(id, "method", value)}>
                    <div className="relative">
                        <ListboxButton
                            className={`relative w-full cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-left ${getMethodColor(
                                method
                            )}`}
                        >
                            <span className="block truncate">{method}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </span>
                        </ListboxButton>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <ListboxOptions className="fixed left-auto top-auto z-[9999] mt-1 w-48 max-h-60 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {methodOptions.map((option) => (
                                    <ListboxOption
                                        key={option.value}
                                        value={option.value}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                                                active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected ? "font-medium" : "font-normal"
                                                    }`}
                                                >
                                                    {option.label}
                                                </span>
                                                {selected && (
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </Listbox>
            </td>
            <td className="px-3 py-2 align-middle min-w-[200px]">
                <textarea
                    ref={endPointRef}
                    value={endPoint}
                    className="w-full px-2 py-1 resize-none rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    onChange={(e) => onChangeFn("endPoint", e)}
                    rows={1}
                />
            </td>
            <td className="px-3 py-2 align-middle min-w-[150px]">
                <textarea
                    ref={queryStringRef}
                    value={queryString}
                    className="w-full px-2 py-1 resize-none rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    onChange={(e) => onChangeFn("queryString", e)}
                    rows={1}
                />
            </td>
            <td className="px-3 py-2 align-middle min-w-[200px]">
                <div className="space-y-1">
                    <textarea
                        ref={requestRef}
                        value={request}
                        className="w-full px-2 py-1 resize-none rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono text-sm"
                        onChange={(e) => onChangeFn("request", e)}
                        rows={1}
                        placeholder='{ "key": "value"}'
                    />
                    <div className="flex gap-1">
                        <button
                            onClick={() => copyJson(request)}
                            className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                        >
                            JSON 복사
                        </button>
                        <button
                            onClick={() => changeRowFn(id, "request", formatJson(request))}
                            className="flex-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                        >
                            JSON 포맷
                        </button>
                    </div>
                </div>
            </td>
            <td className="px-3 py-2 align-middle min-w-[200px]">
                <div className="space-y-1">
                    <textarea
                        ref={responseRef}
                        value={response}
                        className="w-full px-2 py-1 resize-none rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono text-sm"
                        onChange={(e) => onChangeFn("response", e)}
                        rows={1}
                    />
                    <button
                        onClick={() => copyJson(response)}
                        className="w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    >
                        JSON 복사
                    </button>
                </div>
            </td>
            <td className="px-3 py-2 align-middle min-w-[150px]">
                <textarea
                    ref={memoRef}
                    value={memo}
                    className="w-full px-2 py-1 resize-none rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    onChange={(e) => onChangeFn("memo", e)}
                    rows={1}
                />
            </td>
            <td className="px-3 py-2 align-middle whitespace-nowrap text-sm text-gray-500 min-w-[140px]">
                {dayjs(updatedAt).format("YYYY-MM-DD / HH:mm")}
            </td>
            <td className="px-3 py-2 align-middle whitespace-nowrap min-w-[80px]">
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
                    className="w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                >
                    {id === 0 ? "추가" : "수정"}
                </button>
            </td>
            <td className="px-3 py-2 align-middle whitespace-nowrap min-w-[80px]">
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
                    className="w-full px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                >
                    삭제
                </button>
            </td>
        </tr>
    );
};

export default TableElement;
