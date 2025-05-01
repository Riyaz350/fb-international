const user = require("./model");

const createUser = async (data) => {
    try {
        const newUser = new user(data);
        await newUser.save();
        return { success: true, user: newUser };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = { createUser };