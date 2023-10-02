const resSend = (res, error, data, message) => {
    res.send({error, data, message})
}

const userDb = require("../schemas/userSchema")
const jwt = require("jsonwebtoken")
const game = require("../modules/GameMethods")

const bcrypt = require("bcrypt")

module.exports = {
    register: async (req, res) => {
        const {username, password} = req.body

        const userExists = await userDb.findOne({username})
        if (userExists) return resSend(res, true, null, "User with this name exists")

        const hash = await bcrypt.hash(password, 10)
        const newUser = new userDb({
            username,
            password: hash
        })

        await newUser.save()
        resSend(res, false, null, null)
    },
    login: async (req, res) => {
        const {username, password} = req.body
        const userExists = await userDb.findOne({username})

        if (userExists) {
            const passwordCompare = await bcrypt.compare(password, userExists.password)
            if (passwordCompare) {
                const user = {
                    id: userExists._id,
                    username: userExists.username,
                }
                const userData = {
                    money: userExists.money,
                    spins: userExists.spins,
                    lostAmount: userExists.lostAmount
                }
                const token = jwt.sign(user, process.env.JWT_SECRET)
                // USER LOGS IN
                return resSend(res, false, {...user, ...userData, token}, null)
            } else {
                return resSend(res, true, null, "bad credentials")
            }
        } else {
            return resSend(res, true, null, "user does not exist")
        }

    },
    autologin: async (req, res) => {
        const user = await userDb.findOne({_id: req.user.id})
        return resSend(res, false, {...user}, null)
    },
    spin: async (req, res) => {
        const {bid} = req.params
        const user = req.user
        console.log(bid, user)

        const userInDb = await userDb.findOne({_id: user.id})

        if(userInDb.money >= Number(bid)) {

            const result = game.spin(Number(bid))
            console.log(result)

            const usr = await userDb.findOneAndUpdate(
                {_id: user.id},
                {$inc: {money: -bid + (result.moneyWon), spins: 1, lostAmount: bid}},
                {new: true}
            )
            /// GENERATE SYMBOLS
            /// SUBTRACT MONEY, ADD SPIN, ADD LOST AMOUNT IF LOST
            return resSend(res, false, {result, money: usr.money, spins: usr.spins}, null)
        }

        return resSend(res, true, null, "Not enough money honey")
    },
    stats: async (req, res) => {
        const users = await userDb.find({}, {password: 0})
        return resSend(res, false, users, null)
    }
}