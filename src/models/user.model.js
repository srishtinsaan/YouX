import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true // to make it more searchable
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        // index : true ...not enable in all properties otherwise will severely damage performance
    },
    fullname : {
        type : String,
        unique : true,
        trim : true,
        index : true // to make it more searchable
    },
    avatar : {
        type : String, // cloudinary URL
        required : true,
    },
    coverImage : {
        type : String,
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String,
        required : [true, "Password is Required"]
    },
    refreshToken : {
        type : String
    }

}, {timestamps : true})

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }else{
        return next()
    }
    
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        //payload
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullname,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        //payload
        {
            _id : this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)