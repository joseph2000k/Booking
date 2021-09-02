const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {
        type: String
    },
    Location: {
        type: String
    },
    admins: [{
        adminName: {
            type: 
        }
    }]
})

module.exports = Room = mongoose.model("room", RoomSchema);