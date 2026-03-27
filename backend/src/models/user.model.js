import mongoose , {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import { AvailableRoles, Roles } from "../utils/constants.js";

const UserSchema = new Schema(
    {
        profilepic : {
            type : String ,
            default : 'https://placehold.co/2Ø0x200'
        },
        tenantId :{
            type :  Schema.Types.ObjectId,
            ref : 'tenant'
        },
        username :{
            type : String ,
            required : true,
            unique:true,
            lowercase :true,
            trim : true,
            index : true
        },
        email :{
            type : String,
            unique : true,
            trim : true
        },
        fullName : {
            type : String,
            trim : true
        },
        password :{
            type : String,
            require : [true , "password is required"] //with custom error 
        },
        role :{
            type : String,
            enum : AvailableRoles,
            default : Roles.USER
        },
        isEmailVerified :{
            type : Boolean,
            default : false
        },
        refreshToken : {
            type : String,
        },
        forgotPasswordToken : {
            type :String
        },
        forgotPasswordExpiry : {
            type : Date
        },
        emailVerificationToken : {
            type : String
        },
        emailVerificationExpiry : {
            type : Date
        },
        createdBy : {
            type : Schema.Types.ObjectId,
            ref : 'user',
        },
        isActive :{
            type : Boolean,
            default : true
        }
    },
    {
        timestamps : true,
    }
)

UserSchema.pre('save', async function(next){
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password);
}

UserSchema.methods.generateAcessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email : this.email,
            username: this.username
        },
        process.env.ACESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACESS_TOKEN_EXPRIY
        }
    )
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email : this.email,
            username: this.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPRIY
        }
    )
}

UserSchema.methods.generateTemporaryToken = function(){
    const unhashedtoken = crypto.randomBytes(20).toString('hex');
    const hashedtoken = crypto.createHash('sha256')
                            .update(unhashedtoken)
                            .digest('hex')
    const tokenExpriy = Date.now() + (20*60*1000) //20min

    return {unhashedtoken , hashedtoken , tokenExpriy};
}

export const User = mongoose.model("user", UserSchema);