import { asyncHandler } from "../../src/utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import  {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req , res) =>{
    const {fullname, email, username, password} = req.body    
    console.log("email", email);
    
    if([fullname, email, username, password].some((field) => field?.trim() === "")){
        throw new ApiError(
            400,
            "all fields are required"
        )
    }
    // sends true if any one field is empty 


    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })
    
    if(existedUser){
        throw new ApiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(404, "avatar is required")
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(404, "avatar is required")
    }

    const user = User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email, 
        password,
        username : username.toLowerCase()
    })


    const createdUser = await User.findById(user._id).select(
        // ye likho jo jo nahi chahiye
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )


} )

export {registerUser}