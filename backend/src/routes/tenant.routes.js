import {Router} from 'express'
import {createTenant , deleteTenant , getAllTenants , getDetails , updateIsActiveTenant, updateTenant} from '../controllers/tenanat.controller.js';
import { validatePermissionForAcess, verifyJWT } from '../middlewares/auth.middleware.js';
import { Roles } from '../utils/constants.js';

const router = Router();

router.route("/")
       .post(verifyJWT, validatePermissionForAcess([Roles.ADMIN]), createTenant)
       .get(getAllTenants);
       
router.route("/:id")
       .delete(verifyJWT, validatePermissionForAcess([Roles.OWNER]), deleteTenant)
       .put(verifyJWT, validatePermissionForAcess([Roles.OWNER]), updateTenant)
       .patch(verifyJWT, validatePermissionForAcess([Roles.OWNER, Roles.MANAGER]), updateIsActiveTenant)
       .get(getDetails);


export default router;