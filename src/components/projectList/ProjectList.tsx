"use client";

import { getTokenInfo } from "@/lib/getClientAccessTokenUserInfo";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectList() {
    const [projectName, setProJectName] = useState("");
    const [projectList, setProjectList] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const userInfo = getTokenInfo(document.cookie);
                const res = await fetch(`/api/project?userId=${userInfo.userId}`);

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await res.json();
                setProjectList(data.data); // 데이터를 로그에 출력
                // setProjectList(data); // 데이터를 프로젝트 리스트에 설정할 수 있음
            } catch (error) {
                console.error("Fetch error:", error); // 에러 핸들링
            }
        };

        fetchProjects();
    }, []);
    return (
        <div>
            {/* <RowList /> */}
            {projectList?.map((el) => {
                return (
                    <Link
                        href={{
                            pathname: "",
                            query: { project: el.id },
                        }}
                        key={el.id}
                    >
                        {el?.name}
                    </Link>
                );
            })}
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const userInfo = getTokenInfo(document.cookie);
                    let result = await fetch("/api/project", {
                        method: "POST",
                        body: JSON.stringify({ name: projectName, userId: userInfo.userId }),
                    });
                }}
            >
                <input
                    type="text"
                    onChange={(e) => {
                        setProJectName(e.target.value);
                    }}
                />
                <button>프로젝트 추가하기</button>
            </form>
        </div>
    );
}
