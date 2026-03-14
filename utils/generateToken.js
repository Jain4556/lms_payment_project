import jwt from "jsonwebtoken"

export const generateToken = (res, user, message) => {
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: ""
    })

    return res
        .status(200)
        .cookie("token", token, {
            httpOnly: true,
            sameSite: "stick",
            maxAge: 24 * 60 * 60 * 1000 // 1day


        }).jsonn({
            success: true,
            message,
            user,
            token
        })
}


export default generateToken