"use client";
import { theadData } from "@/data";
import { getTokenInfo } from "@/lib/getClientAccessTokenUserInfo";
import { rowElementType } from "@/type/rowElementType";
import { JsonValue } from "@prisma/client/runtime/library";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import TableElement from "../TableElement/TableElement";

const Table = () => {
    const searchParams = useSearchParams();
    const [token, setToken] = useState({
        email: "",
        exp: 0,
        iat: 0,
        userId: 0,
    }); // 토큰 상태 추가
    const [tableData, setTableData] = useState<rowElementType[]>([]);

    const changeRowFn = (id: number, key: string, value: string | JsonValue | number) => {
        setTableData((pre) => {
            const newPre = [...pre];
            const findIdx = newPre.findIndex((el) => id === el.id);
            newPre[findIdx] = { ...newPre[findIdx], [key]: value };
            return newPre;
        });
    };
    const changeAllRowFn = (id: number, data: rowElementType) => {
        setTableData((pre) => {
            const newPre = [...pre];
            const findIdx = newPre.findIndex((el) => id === el.id);
            newPre[findIdx] = data;
            return newPre;
        });
    };
    const delteAllRowFn = (id: number) => {
        setTableData((pre) => {
            const newPre = [...pre];
            return newPre.filter((el) => el.id !== id);
        });
    };
    useEffect(() => {
        setToken(getTokenInfo(document.cookie));
    }, []);
    useEffect(() => {
        const getRowData = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/row/list?projectId=${searchParams.get("project")}&userId=${
                    token.userId
                }`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                console.error(`Error fetching data: ${res.status} - ${res.statusText}`);
                if (res.status === 401) {
                    return <div>인증이 필요합니다. 다시 로그인해 주세요.</div>;
                }
                return <div>데이터를 가져오는 중 오류가 발생했습니다.</div>;
            }
            const data = await res.json();
            console.log(data.data);
            // const newData = data.data.map((el) => {
            //     return {
            //         ...el,
            //         request: JSON.stringify(el.request, null, 2).toString(),
            //         response: JSON.stringify(el.response, null, 2).toString(),
            //     };
            // });
            setTableData(data.data);
        };
        if (searchParams.get("project") && token.userId) {
            getRowData();
        }
    }, [searchParams.get("project"), token.userId]);
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <div className="min-w-screen p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">API 목록</h2>
                    <button
                        onClick={async () => {
                            setTableData((pre) => {
                                return [
                                    ...pre,
                                    {
                                        status: "시작전",
                                        method: "GET",
                                        endPoint: "",
                                        queryString: "",
                                        request: "",
                                        response: "",
                                        memo: "",
                                        updatedAt: new Date(),
                                        createdAt: new Date(),
                                        id: 0,
                                    },
                                ];
                            });
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        새 API 추가
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {theadData.map((el) => (
                                    <th
                                        key={`theadData${el}`}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {el}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {tableData && (
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tableData.map(
                                    ({
                                        status,
                                        method,
                                        endPoint,
                                        queryString,
                                        request,
                                        response,
                                        memo,
                                        updatedAt,
                                        id,
                                    }) => (
                                        <React.Fragment key={`wrapper ${id}`}>
                                            <TableElement
                                                changeAllRowFn={changeAllRowFn}
                                                changeRowFn={changeRowFn}
                                                delteAllRowFn={delteAllRowFn}
                                                status={status}
                                                method={method}
                                                endPoint={endPoint}
                                                queryString={queryString}
                                                request={request}
                                                response={response}
                                                memo={memo}
                                                updatedAt={updatedAt}
                                                id={id}
                                            />
                                        </React.Fragment>
                                    )
                                )}
                            </tbody>
                        )}
                    </table>
                </div>

                {tableData.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400 mx-auto mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">API가 없습니다</h3>
                            <p className="text-gray-500 mb-4">새로운 API를 추가해보세요!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;
