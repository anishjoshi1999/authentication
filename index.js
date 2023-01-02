const bcrypt = require('bcrypt')
// const hashPassword = async (pw) => {
//     const salt = await bcrypt.genSalt(12)
//     const hash = await bcrypt.hash(pw, salt)
//     console.log(salt)
//     console.log(hash)
// }
const hashPassword = async (pw) => {
    const hash = await bcrypt.hash(pw, 12)
    console.log(hash)
}

const login = async (pw, hashpw) => {
    const result = await bcrypt.compare(pw, hashpw)
    if (result) {
        console.log("You logged in")
    } else {
        console.log("incorrect")
    }
}
// hashPassword('anish')
login('anish', '$2b$12$2g0d3/SvT.Nf62NIJf010.hEwaUAnFARzRB3SGgybm3IdvcEbgDie')