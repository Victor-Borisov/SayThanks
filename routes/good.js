const express = require('express')
const passport = require('passport')
const controller = require('../controllers/good')
const router = express.Router()

router.get('/:welldoerId', passport.authenticate('jwt', {session: false}), controller.getByWelldoerId)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)

module.exports = router