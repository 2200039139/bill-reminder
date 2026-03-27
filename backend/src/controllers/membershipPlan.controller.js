
import {asyncHandeler} from '../utils/async-handler.js';
import { ApiResponse } from '../utils/api-response.js';
import { MembershipPlan } from '../models/membershipPlan.model.js';


export const createMembershipPlan = asyncHandeler(async (req, res)=>{

    const {name , duration , price , features  } = req.body;

    const membershipPlan = await MembershipPlan.create({
        name, duration , price , features , tenantId : user.tenantId
    });

    return res.status(200).json(
    new ApiResponse(
        200 ,
        {membershipPlan} ,
        "tenant created"
    ));
});

export const updateMembershipPlan = asyncHandeler(async (req, res)={});

export const deleteMembershipPlan = asyncHandeler(async (req, res)={});

export const updateIsActiveMembershipPlan = asyncHandeler(async (req, res)={});

export const getAllMembershipPlans = asyncHandeler(async (req, res)={});
