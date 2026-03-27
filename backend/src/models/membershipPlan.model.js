import mongoose , {Schema} from "mongoose";

const membershipPlanSchema = new Schema(
    {
        tenantId :{
            type :  Schema.Types.ObjectId,
            required : true,
            ref : 'tenant'
        },
        name : {
            type : String,
            trim : true,
            required : true,
        },
        duration :{
            type : Number ,
            required : true,
        },
        description : {
            type : String,
        },
        price :{
            type : Number,
            required : true,
        },
        features :{
            type : String,
            required : true,
            trim : true
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

export const MembershipPlan = mongoose.model("membershippalns", membershipPlanSchema)