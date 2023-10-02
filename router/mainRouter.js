const express = require("express")
const router = express.Router()

const {
    login,
    register,
    autologin,
    spin,
    stats
} = require("../controllers/mainController")

const {authorize} = require("../middleware/validators")


router.post("/register", register)
router.post("/login", login)
router.get("/autologin", authorize, autologin)

router.get("/spin/:bid", authorize, spin)
router.get("/stats", stats)

module.exports = router