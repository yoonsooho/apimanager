"use client";
import { getTokenInfo } from "@/lib/getClientAccessTokenUserInfo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [saveEmail, setSaveEmail] = useState(false);
    const [token, setToken] = useState({
        email: "",
        exp: 0,
        iat: 0,
        userId: 0,
    });
    const router = useRouter();

    useEffect(() => {
        // 저장된 이메일이 있다면 불러오기
        const savedEmail = localStorage.getItem("savedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setSaveEmail(true);
        }
        setToken(getTokenInfo(document?.cookie));
    }, []);

    if (token?.userId)
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div className="text-xl font-semibold mb-2 text-gray-700">{token.email}</div>
                    <div className="text-sm text-gray-500 mb-4">님 환영합니다</div>
                    <form method="POST" action="/api/auth/logout" className="w-full">
                        <button className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            로그아웃
                        </button>
                    </form>
                </div>
            </div>
        );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (saveEmail) {
            localStorage.setItem("savedEmail", email);
        } else {
            localStorage.removeItem("savedEmail");
        }
        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const result = await res.json();
            return toast.error(result?.message);
        }

        const result = await res.json();
        router.push("/");
        toast.success(result?.message);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    이메일
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                        </svg>
                    </div>
                    <input
                        id="email"
                        type="text"
                        placeholder="이메일을 입력하세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    비밀번호
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="saveEmail"
                        checked={saveEmail}
                        onChange={(e) => setSaveEmail(e.target.checked)}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="saveEmail" className="ml-2 text-sm text-gray-600 cursor-pointer">
                        아이디 저장하기
                    </label>
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                로그인
            </button>
        </form>
    );
}
