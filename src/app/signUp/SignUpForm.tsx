"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [username, setUsername] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== passwordCheck) {
            return toast.error("비밀번호가 일치하지 않습니다.");
        }
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify({ email, password, username }),
        });
        if (!res.ok) {
            const result = await res.json();
            return toast.error(result?.message);
        }
        const result = await res.json();
        router.push("/login");
        toast.success(result?.message);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input
                    type="username"
                    placeholder="이름"
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="이메일"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="비밀번호"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
                회원가입
            </button>
        </form>
    );
}
