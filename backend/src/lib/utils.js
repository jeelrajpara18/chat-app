import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevent XSS attacks
        sameSite: process.env.NODE_ENV === "development" ? "None" : "Lax", // Cross-site cookies in prod
        secure: process.env.NODE_ENV === "development", // HTTPS-only in prod
    });

    return token;
};