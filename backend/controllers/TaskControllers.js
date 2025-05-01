import Task from "../models/TaskModel.js";
import Employee from "../models/EmployeeModel.js";
import mongoose from "mongoose";

const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find()
            .populate('employee', 'name')
            .lean();

        tasks.forEach(task => {
            delete task.id;
        });

        return res.status(200).json({ tasks });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const addTasks = async (req, res, next) => {
    const { taskName, taskDescription, deadline, status, id } = req.body;

    if (!taskName || !taskDescription || !deadline || !status || !id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const validateStatus = ["Pending", "In Progress", "Completed"];
    if (!validateStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status. Allowed values: Pending, In Progress, Completed" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const employee = await Employee.findById(id).session(session);
        if (!employee) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Employee not found" });
        }

        const task = new Task({
            employee: employee._id,
            taskName,
            taskDescription,
            deadline,
            status,
        });

        await task.save({ session });

        await session.commitTransaction();
        session.endSession();

        const populatedTask = await Task.findById(task._id).populate('employee', 'name');

        return res.status(201).json({ task: populatedTask });
    } catch (err) {
        console.error(err);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const getById = async (req, res) => {
    const tid = req.params.id;

    try {
        const task = await Task.findById(tid);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Safely handle the case where 'employee' is null or invalid
        if (task.employee && mongoose.Types.ObjectId.isValid(task.employee)) {
            await task.populate('employee', 'name');
        } else {
            task.employee = { name: "Employee not found" };
        }

        return res.status(200).json({ task });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const updateTask = async (req, res, next) => {
    const { taskName, taskDescription, deadline, status } = req.body;
    const { id } = req.params;

    const validateStatus = ["Pending", "In Progress", "Completed"];
    if (status && !validateStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status. Allowed values: Pending, In Progress, Completed" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const task = await Task.findById(id).session(session);
        if (!task) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Task not found" });
        }

        if (taskName) task.taskName = taskName;
        if (taskDescription) task.taskDescription = taskDescription;
        if (deadline) task.deadline = deadline;
        if (status) task.status = status;

        await task.save({ session });

        await session.commitTransaction();
        session.endSession();

        const populatedTask = await Task.findById(task._id).populate('employee', 'name');

        return res.status(200).json({ task: populatedTask });
    } catch (err) {
        console.error(err);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const deleteTask = async (req, res, next) => {
    const { id } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const task = await Task.findById(id).session(session);
        if (!task) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Task not found" });
        }

        await Task.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error(err);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export {
    getAllTasks,
    addTasks,
    getById,
    updateTask,
    deleteTask
};