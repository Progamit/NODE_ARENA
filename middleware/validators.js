const jwt = require("jsonwebtoken")

module.exports = {
    validateUser: (req, res, next) => {
        const {
            username,
            pass1,
            pass2
        } = req.body

        if(username.length === 0) return res.send({error: true, data: null, message: "Bad username"})
        if(pass1.length === 0) return res.send({error: true, data: null, message: "Bad password lenght"})
        if(pass1 !== pass2) return res.send({error: true, data: null, message: "passwords should match"})

        next()
    },
    authorize: (req, res, next) => {
        const token = req.headers.authorization



        jwt.verify(token, process.env.JWT_SECRET, async (err, item) => {
            if(err) {
                return res.send({error: true, message: "bad auth"})
            }
            req.user = item
            return next()
        })
    }
}