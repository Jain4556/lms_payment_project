import mongoose from "mongoose";

const courseProgessSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: [true, "course reference is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user reference is required"]
    },
    amount: {
        type: Number,
        required: [true, "Purchase amount is required"],
        min: [0, "amount should not be negative"]
    },

    currency: {
        type: String,
        required: [true, "Currency is required"],
        uppercase: true,
        default: "USD"
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "completed", "failed", "refunded"],
            message: "Please select a valid status",
        },
        default: "pending",
    },

    paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
    },

    paymentId: {
        type: String,
        required: [true, "Payment ID is required"],
    },
    refundId: {
        type: String,
    },
    refundAmount: {
        type: Number,
        min: [0, "Refund amount must be  non-negative"],
    },
    refundAmount: {
        type: String,
    },
    metadata: {
        type: Map,
        of: String,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});


courseProgessSchema.index({ user: 1, course: 1 })
courseProgessSchema.index({ status: 1 })
courseProgessSchema.index({ createdAt: -1 })

coursePurchaseSchema.virtual('isRefundable').get(function () {
    if (this.status !== 'completed') {
        return false
    }
    const thirtyDayAgo = new (Date.now() - 30 * 24 * 60 * 60 * 1000)
    return this.createdAt > thirtyDayAgo
})


// methods to process refund
coursePurchaseSchema.methods.processRefund = async function (reason, amount) {
    this.status = "refunded",
        this.reason = reason
    this.amount = amount || this.amount
    return this.save();
}

export const coursePurchase = mongoose.model('CoursePurchase', courseProgessSchema)