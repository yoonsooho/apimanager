import Table from "@/components/Table/Table";
import { getTokenInfo } from "@/lib/getClientAccessTokenUserInfo";
import { cookies } from "next/headers";

const getRowData = async (userId: string) => {};

export default async function Home() {
    const cookieStore = cookies();

    const token = await getTokenInfo(cookieStore.toString());

    // const rowData = await getRowData(token.userId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/row/list?userId=${token.userId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        console.error(`Error fetching data: ${res.status} - ${res.statusText}`);
        if (res.status === 401) {
            return <div>인증이 필요합니다. 다시 로그인해 주세요.</div>;
        }
        return <div>데이터를 가져오는 중 오류가 발생했습니다.</div>;
    }
    const rowData = await res.json();

    return <div>{rowData?.data ? <Table data={rowData?.data} /> : <p>데이터가 없습니다.</p>}</div>;
}
