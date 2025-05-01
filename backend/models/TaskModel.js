import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "EmployeeModel", 
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

export default mongoose.model("TaskModel", taskSchema);
