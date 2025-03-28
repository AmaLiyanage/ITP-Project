const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "EmployeeModel", // Ensure "EmployeeModel" matches the actual model name
    },
    taskName: {
        type: String,
        required: true,
    },
    taskDescription: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    }
});

taskSchema.set('toObject', { virtuals: true });
taskSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.id; 
        return ret;
    }
});


module.exports = mongoose.model("TaskModel", taskSchema);
