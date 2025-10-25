import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

mongoose.model("Quote", quoteSchema);