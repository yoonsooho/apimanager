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
        <>
            <table className="w-full">
                <thead>
                    <tr>
                        {theadData.map((el) => (
                            <th className="p-3 border border-gray-400" key={`theadData${el}`}>
                                {el}
                            </th>
                        ))}
                    </tr>
                </thead>
                {tableData && (
                    <tbody>
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
                            }) => {
                                return (
                                    <React.Fragment key={`wrraper ${id}`}>
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
                                );
                            }
                        )}
                    </tbody>
                )}
            </table>
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
                                // userId: token.userId,
                                id: 0,
                            },
                        ];
                    });
                }}
            >
                추가하기
            </button>
        </>
    );
};

export default Table;
