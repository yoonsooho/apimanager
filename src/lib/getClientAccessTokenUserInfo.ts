export const getTokenInfo = (cookie: string) => {
    const accessToken = cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

    if (accessToken) {
        const base64Url = accessToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        const payload = JSON.parse(jsonPayload);
        // console.log(payload.userId); // accessToken에 포함된 userId를 확인
        return payload;
    }
};
