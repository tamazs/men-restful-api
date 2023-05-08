const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let taskSchema = new Schema(
{
    title: {type: String, required: true, min: 2, max: 50},
    assignedTo: {type: Schema.Types.ObjectId, ref: "User"},
    createdDate: {type: Date, default: Date.now},
    state: {type: String, default: "ToDo"}
});

module.exports = mongoose.model("task", taskSchema);