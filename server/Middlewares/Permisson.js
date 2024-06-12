const User = require("../models/Userschema")

const uploadProductPermission = async(userId) => {
    const user = await User.findById(userId)
    if (user?.Role === 'Admin') {

        return true
    }

    return false
}


module.exports = uploadProductPermission