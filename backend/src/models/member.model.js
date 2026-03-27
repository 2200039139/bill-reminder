import mongoose , {Schema} from "mongoose";
import { AvailablePaymenStatus, PaymenStatus } from "../utils/constants.js";

const membershipSchema = new Schema(
    {
        tenantId :{
            type :  Schema.Types.ObjectId,
            required : true,
            ref : 'tenant'
        },
        memberId :{
            type :  Schema.Types.ObjectId,
            required : true,
            ref : 'organizationMember'
        },
        planId :{ 
            type :  Schema.Types.ObjectId,
            required : true,
            ref : 'membershippalns'
        },
        startDate :{
            type : Date,
            required : true,
        },
        endDate :{
            type : Date,
            required : true,
        },
        paymentStatus :{
            type : String,
            enum : AvailablePaymenStatus,
            default : PaymenStatus.PENDING,
        }
    },
    {
        timestamps : true,
    }
)

export const Membership = mongoose.model("membership", membershipSchema)