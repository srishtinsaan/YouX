import { asyncHandler } from "../utils/asyncHandler";
import {ApiError, APIError} from "../utils/ApiError"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model"

export const verifyJWT = asyncHandler(async (req, _, next) => { // res is not much used so we write _ in place of it (production grade code)
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new APIError(401, "Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw ApiError(401, "Invalid access token")
        }
    
        req.user = user
        next()
    
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid Access Token")
    }


    
})

 