const mongoose = require("mongoose");
const task = require("./task")

const Schema = mongoose.Schema;

let projectSchema = new Schema(
{
    title: {type: String, required: true, min: 2, max: 50},
    members: {type: [Schema.Types.ObjectId], ref: "User"},
    tasks: {type: [Schema.Types.ObjectId], ref: "Task"},
    description: {type: String},
    createdDate: {type: Date, default: Date.now},
    active: {type: Boolean, default: true}
});

projectSchema.pre('findOneAndUpdate', function() {
    const update = this.getUpdate();
    if (update.__v != null) {
      delete update.__v;
    }
    const keys = ['$set', '$setOnInsert'];
    for (const key of keys) {
      if (update[key] != null && update[key].__v != null) {
        delete update[key].__v;
        if (Object.keys(update[key]).length === 0) {
          delete update[key];
        }
      }
    }
    update.$inc = update.$inc || {};
    update.$inc.__v = 1;
  });

module.exports = mongoose.model("project", projectSchema);