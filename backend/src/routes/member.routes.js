import {Router} from 'express';
import {validatePermissionForAcess, verifyJWT} from '../middlewares/auth.middleware.js';
import { Roles } from '../utils/constants.js';
import { createMemberPlan, deleteMembership, getAllMembers } from '../controllers/member.controller.js';

const router = Router();

router.route("/")
     .get(getAllMembers)
     .post(verifyJWT , createMemberPlan);

router.route("/:id")
    .delete(verifyJWT , validatePermissionForAcess([Roles.OWNER]), deleteMembership)
    .get(verifyJWT , validatePermissionForAcess([Roles.OWNER, Roles.MANAGER, Roles.EMPLOYEE]), searchMembers);

export default router;