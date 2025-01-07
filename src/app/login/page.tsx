"use client";
import { getTokenInfo } from "@/lib/getClientAccessTokenUserInfo";
// import { cookies } from "next/headers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const cookie = cookies();
    const [token, setToken] = useState({
        email: "",
        exp: 0,
        iat: 0,
        userId: 0,
    }); // 토큰 상태 추가
    const router = useRouter();
    useEffect(() => {
        setToken(getTokenInfo(document?.cookie));
    }, []);
    if (token?.userId)
        return (
            <form method="POST" action="/api/auth/logout">
                <div>{token.email} 님 반갑습니다.</div>
                <button>로그아웃</button>
            </form>
        );
    return (
        <div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch("/api/auth/login", {
                        method: "POST",
                        body: JSON.stringify({ email, password }),
                    });
                    if (!res.ok) {
                        const result = await res.json();
                        return toast.error(result?.message);
                    }

                    const result = await res.json();
                    console.log(result);
                    router.push("/");
                    toast.success(result?.message);
                    // return;
                }}
            >
                <input type="text" placeholder="이메일" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="비번" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">로그인</button>
            </form>
            <Link href={"/signUp"}>회원가입</Link>
        </div>
    );
};
export default Login;
