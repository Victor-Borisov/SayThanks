const mongoose = require('mongoose')
const Schema = mongoose.Schema

const thankSchema = new Schema({
    createdOn: {
        type: Date,
        default: Date.now
    },
    list: [
        {
            welldoer_id: {
                ref: 'welldoers',
                type: Schema.Types.ObjectId
            },
            welldoer_name: {
                type: String
            },
            welldoer_img: {
                type: String,
                default: ''
            },
            good_id: {
                ref: 'goods',
                type: Schema.Types.ObjectId
            },
            good_description: {
                type: String
            },
            thanked: {
                type: Number,
                default: 0
            }
        }
    ],
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('thanks', thankSchema)