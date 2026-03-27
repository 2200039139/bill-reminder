export const Roles = {
    ADMIN : "admin",
    OWNER : "owner",
    MANAGER : "manager",
    EMPLOYEE : "employee",
    USER : "user"
}

export const PaymenStatus = {
    FAILED : "failed",
    SUCCESS : "success",
    PENDING : "pending"
}

export const RolePermissions = {
    "admin" : [Roles.ADMIN , Roles.OWNER],
    "owner" : [Roles.MANAGER, Roles.EMPLOYEE, Roles.USER],
    "manager" : [Roles.EMPLOYEE, Roles.USER],
    "employee" : [Roles.USER]
}

export const CookieOptions = {
    httpOnly : true,
    secure: true,
} 

export const AvailableRoles = Object.values(Roles);

export const AvailablePaymenStatus = Object.values(PaymenStatus);