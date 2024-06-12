export const authorizationJwt = (...roles) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ status: 'error', error: 'No esta autorizado' });
        const userRole = req.user.role.toUpperCase();
        const authorizedRoles = roles.map(role => role.toUpperCase());
        
        if (authorizedRoles.includes('PUBLIC')) return next();
        if (!authorizedRoles.includes(userRole)) {
            return res.status(401).send({ status: 'error', error: 'No tiene permisos' });
        }
        
        next();
    };
};