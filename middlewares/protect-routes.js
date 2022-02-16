function protectRoutes(req, res, next) {
    if (!res.locals.isAuth) {
        // Not authenticated
        return res.redirect('/401');
    }
    if (req.path.startsWith('/admin') && !res.locals.isAdmin) {
        // Not admin
        return res.redirect('/403');
    }
    next();
}

module.exports = protectRoutes;