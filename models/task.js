const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const states = ["ToDo", "Doing", "Done"];

let taskSchema = new Schema(
{
    title: {type: String, required: true, min: 4, max: 50},
    detail: {type: String, required: true, min: 4, max: 200},
    assignedTo: {type: Schema.Types.ObjectId, ref: "user"},
    projectID: {type: Schema.Types.ObjectId, ref: "project", required: true},
    createdDate: {type: Date, default: Date.now},
    state: {type: String, default: "ToDo"}
});

module.exports = mongoose.model("task", taskSchema);