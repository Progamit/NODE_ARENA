const rnd = (num) => Math.round(Math.random() * num)


module.exports = {

    spin: (bidAmount) => {
        const possibleNums = [20, 50, 100, 200, 500, 1000]
        const result = [
            rnd(5),
            rnd(5),
            rnd(5)
        ]
        let moneyWon = 0

        possibleNums.map((x, i) => {
            if (result[0] === i && result[0] === result[1] && result[0] === result[2]) moneyWon = bidAmount * x
        })

        return {
            moneyWon,
            result
        }
    }

}