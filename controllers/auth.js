const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({email: req.body.email})
    if (candidate) {
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, candidate.password)
        if (isPasswordCorrect) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 3600})
            res.status(200).json({
                token: `Bearer ${token}`
            })
        }
        else {
            res.status(401).json({
                message: 'Incorrect password'
            })
        }
    }
    else {
        res.status(404).json({
            message: 'User not found'
        })
    }
}

module.exports.register = async function(req, res) {
    //email password
    const candidate = await User.findOne({email: req.body.email})
    
    if (candidate) {
        res.status(409).json({
            message: 'User with such email exists'
        })
    }
    else {
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()
            res.status(201).json(user)
        }
        catch(e) {
            errorHandler(res, e)
        }
    }
}