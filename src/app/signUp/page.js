const signUp = () => {
    return (
        <form method="POST" action="/api/auth/signup">
            <input name="username" type="text" placeholder="유저이름" />
            <input name="email" type="email" placeholder="이메일" />
            <input name="password" type="password" placeholder="비번" />
            <button type="submit">회원가입</button>
        </form>
    );
};

export default signUp;
