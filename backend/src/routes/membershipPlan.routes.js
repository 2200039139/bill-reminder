import {Router} from 'express';
import { createMembershipPlan, deleteMembershipPlan, getAllMembershipPlans, updateIsActiveMembershipPlan, updateMembershipPlan } from '../controllers/membershipPlan.controller.js';
import {validatePermissionForAcess, verifyJWT} from '../middlewares/auth.middleware.js';
import { Roles } from '../utils/constants.js';


const router = Router();

router.route("/")
      .post(verifyJWT , validatePermissionForAcess([Roles.OWNER]), createMembershipPlan )

router.route("/:id")
      .put(verifyJWT , validatePermissionForAcess([Roles.OWNER]), updateMembershipPlan)
      .patch(verifyJWT , validatePermissionForAcess([Roles.OWNER]), updateIsActiveMembershipPlan)
      .delete(verifyJWT , validatePermissionForAcess([Roles.OWNER]), deleteMembershipPlan)
      .get(getAllMembershipPlans);

export default router;