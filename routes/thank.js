const express = require('express')
const passport = require('passport')
const controller = require('../controllers/thank')
const router = express.Router()
//get actual made thanks. Create thank object, if there is no thank object with now date
router.get('/', passport.authenticate('jwt', {session: false}), controller.getActual)
//set thanked by goodId
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)
//get history with pagination
router.get('/history', passport.authenticate('jwt', {session: false}), controller.getAll)

module.exports = router