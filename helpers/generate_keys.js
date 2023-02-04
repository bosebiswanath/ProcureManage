const crypto = require('crypto')

const key1 = crypto.randomBytes(32).toString('hex')
const key2 = crypto.randomBytes(32).toString('hex')
//console.table({ key1, key2 })

module.exports = {

	randomnumber: crypto.randomInt(100, 1000),
	orderrandomnumber: crypto.randomInt(1000, 9000)

}
