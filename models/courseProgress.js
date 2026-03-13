import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: [true, 'Lecture reference is required']
    },

    isCompleted: {
        type: Boolean,
        default: false
    },
    watchTime: {
        type: Number,
        default: 0
    },
    lastWatched: {
        type: Date,
        default: Date.now()
    }
})


const courseProgessSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user reference is required"]
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: [true, "course reference is required"]
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lectureProgess: [lectureProgressSchema],
    lastAccessed: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// calculate course completion
courseProgessSchema.pre('save', function (next) {
    if (this.lectureProgess.length > 0) {
        const completedLectures = this.lectureProgess.filter(lp => lp.isCompleted).length
        this.completionPercentage = Math.round((completedLectures / this.lectureProgess.length) * 100)
        this.isCompleted = this.completionPercentage === 100

    }
    next()
})


// update last accessed
courseProgessSchema.methods.updateLastAccessed = function () {
    this.lastAccessed = Date.now()
    return this.save({ ValidateBeforeSave: false })
}


export const courseProgess = mongoose.model

