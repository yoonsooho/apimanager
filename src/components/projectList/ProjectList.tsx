"use client";

import { getTokenInfo } from "@/lib/getClientAccessTokenUserInfo";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Logout from "@/components/Logout";

export default function ProjectList() {
    const [projectName, setProJectName] = useState("");
    const [projectList, setProjectList] = useState<{ id: number; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const userInfo = getTokenInfo(document.cookie);
                const res = await fetch(`/api/project?userId=${userInfo.userId}`);

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await res.json();
                setProjectList(data.data);
                if (!searchParams.get("project")) {
                    router.push(`?project=${data.data[0].id}`);
                }
                console.log("data.data", data.data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">프로젝트 목록</h2>
                        <Logout />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {projectList?.map((el) => (
                            <Link
                                href={{
                                    pathname: "",
                                    query: { project: el.id },
                                }}
                                key={el.id}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                                    ${
                                        searchParams.get("project") === el.id.toString()
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {el?.name}
                            </Link>
                        ))}
                    </div>

                    <div className="pt-4">
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!projectName.trim()) return;

                                const userInfo = getTokenInfo(document.cookie);
                                const result = await fetch("/api/project", {
                                    method: "POST",
                                    body: JSON.stringify({ name: projectName, userId: userInfo.userId }),
                                });
                                const res = await result.json();
                                const { id, name } = res.data;
                                setProjectList((pre) => [...pre, { id, name }]);
                                setProJectName(""); // 입력 필드 초기화
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProJectName(e.target.value)}
                                placeholder="새 프로젝트 이름"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                추가
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
