import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.modal.js"
import {uploadOncloudinary} from "../utils/Cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser = asyncHandler( async(req,res)=>{
    // steps to register the user:
    // get the users details also check for the validation that it is not empty or invalid
    // check if the user already exist via username, email
    // check for avatar and coverimage 
    // upload it on cloudinary and check on the cloudinary for the successful upload of it
    // create user object - create entry in DB
    // check for the response and remove password and refreshToken from the response

    const {fullname, email, username, password} = req.body
    console.log("email", email)
    if(
        [fullname, username, email, password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLacalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required")
    }
    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLacalPath)
    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        password,
    })

    const createdUser = await User.findById(user._id).select("-password -refershToken")
    if(!createdUser){
        throw new ApiError(500, "Sometihng went wrong while registering the user")
    }
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})
export {registerUser}