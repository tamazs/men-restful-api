const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema (
    {
        name: {type: String, required: true, min: 6, max:255},
        email: {type: String, required: true, min: 6, max:255},
        password: {type: String, required: true, min: 6, max:255},
        admin: {type: Boolean, default: false},
        date: {type: Date, default: Date.now}
    }
    //name
    //email
    //password
    //date when created
)

module.exports = mongoose.model("user", userSchema);