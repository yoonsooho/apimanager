"use client";
import { theadData } from "@/data";
import { getTokenInfo } from "@/lib/getClientAccessTokenUserInfo";
import { rowElementType } from "@/type/rowElementType";
import { useEffect, useState } from "react";
import TableElement from "../TableElement/TableElement";
import { JsonValue } from "@prisma/client/runtime/library";

type props = {
    data: rowElementType[];
};

const Table = ({ data }: props) => {
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
        const userInfo = getTokenInfo(document.cookie);
        setToken(userInfo);
        console.log(userInfo);
        setTableData([...data]);
    }, []);
    return (
        <>
            <table>
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
                                updated_at,
                                userId,
                                id,
                            }) => {
                                return (
                                    <tr key={`tbody ${id}`}>
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
                                            updated_at={updated_at}
                                            userId={userId}
                                            id={id}
                                        />
                                    </tr>
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
                                status: "",
                                method: "",
                                endPoint: "",
                                queryString: "",
                                request: {},
                                response: {},
                                memo: "",
                                updated_at: new Date(),
                                created_at: new Date(),
                                userId: token.userId,
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
