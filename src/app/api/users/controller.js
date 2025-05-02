const user = require("./model");
const {hashData} = require("./../utils/hashed")
const createUser = async (data) => {
    try {
        const hashedPin = await hashData(data.pin);
        const newData = { ...data, pin: hashedPin };
        const newUser = new user(newData);
        console.log(newUser)
        newUser.save();
        return { success: true, user: newUser };
    } catch (error) {
        return { success: false, error: error.message };
    }
}



module.exports = { createUser };
