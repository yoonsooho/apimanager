export const jwtConfig = {
    secret: new TextEncoder().encode(process.env.JWT_SECRET_KEY),
};
