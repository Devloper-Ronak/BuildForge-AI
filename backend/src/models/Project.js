import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    favoriteAt: {
        type: Date,
        default: null,
    },
    lastViewedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

// ✅ IMPORTANT: default export (THIS FIXES YOUR ERROR)
const Project = mongoose.model("Project", projectSchema);

export default Project;