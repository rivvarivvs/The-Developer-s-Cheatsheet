exports.isCsrf = (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.crsfToken = req.crsfToken()
    next()
}