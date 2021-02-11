const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GoodSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    lifetimeDays: {
        type: Number,
        default: 0
    },
    welldoer: {
        ref: 'welldoers',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Goods', GoodSchema)