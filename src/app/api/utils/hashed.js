const bcrypt = require("bcrypt")

const verifyHashedData= async(unHashed, hashed)=>{
    try {
        const match = await bcrypt.compare(unHashed, hashed)
        return match
    } catch (error) {
        throw error
    }
}

const hashData = async(data, saltRound = 10)=>{
    try {
        const hashedData = await bcrypt.hash(data, saltRound)
        console.log(hashedData)
        return hashedData
    } catch (error) {
        throw error
    }
}

module.exports= {hashData, verifyHashedData}