import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    try {
        // Validate userId
        if (!userId || typeof userId !== 'string') {
            throw new Error('Invalid userId');
        }

        // Generate token
        const token = jwt.sign(
            { userId }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            secure: process.env.NODE_ENV === 'production',
            ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN })
        });

        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error; // Or handle it differently
    }
}