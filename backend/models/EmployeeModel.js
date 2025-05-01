import mongoose from "mongoose";
const { Schema } = mongoose;

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Male",
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    nicNo: {
        type: String,
        required: true,
    },
    date_joined: {
        type: Date,
        required: true,
    }
});

export default mongoose.model("EmployeeModel", employeeSchema);