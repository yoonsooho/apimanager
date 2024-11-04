import { getTokenInfo } from "@/lib/getClientAccessTokenUserInfo";
import { cookies } from "next/headers";
import Link from "next/link";

const Login = async () => {
    const cookie = cookies();
    const token = await getTokenInfo(cookie.toString());
    if (token?.userId)
        return (
            <form method="POST" action="/api/auth/logout">
                <div>{token.email} 님 반갑습니다.</div>
                <button>로그아웃</button>
            </form>
        );
    return (
        <div>
            <form method="POST" action="/api/auth/login">
                <input name="email" type="text" placeholder="이메일" />
                <input name="password" type="password" placeholder="비번" />
                <button type="submit">로그인</button>
            </form>
            <Link href={"/signUp"}>회원가입</Link>
        </div>
    );
};
export default Login;
