const Welldoer = require('../models/Welldoer')
const Good = require('../models/Good')
const Thank = require('../models/Thank')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function(req, res) {
    try {
        const welldoers = await Welldoer.find({user: req.user.id})
        res.status(200).json(welldoers)
    }
    catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function(req, res) {
    try {
        const welldoer = await Welldoer.findById(req.params.id)
        res.status(200).json(welldoer)
    }
    catch (e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function(req, res) {
    try {
        await Welldoer.deleteOne({_id: req.params.id});
        await Good.deleteMany({welldoer: req.params.id});
        //delete removed welldoer from today task
        const query = {
            user: req.user.id,
            createdOn: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
            }
        }
        try {
            await Thank.updateMany(query, {$pull: {list: {welldoer_id: req.params.id}}}, function(err, data) {
                if(err) {
                    return res.status(500).json({message: 'Not deleted'});
                }
            });
        }        
        catch (e) {
            errorHandler(res, e)
        }
        
        res.status(200).json({
            message: 'Welldoer deleted'
        })
    }
    catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function(req, res) {
    const welldoer = new Welldoer({
        name: req.body.name,
        user: req.user.id,
        imageSrc: req.file ? req.file.path : ''
    })

    try {
        await welldoer.save()
        res.status(201).json(welldoer)
    }
    catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function(req, res) {
    const updated = {
        name: req.body.name
    }
    
    if (req.file) {
        updated.imageSrc = req.file.path
    }

    try {
        const welldoer = await Welldoer.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        //update all thanks with changed welldoer in today task
        const query = {
            user: req.user.id,
            createdOn: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
            },
            "list.welldoer_id": req.params.id
        }
        try {
            await Thank.updateMany(query, 
                {
                    $set: {"list.$.welldoer_name": req.body.name}
                },
                function(err, data) {
                    if(err) {
                        return res.status(500).json({message: 'Not updated'});
                    }
                }
            );
            if (req.file) {
                await Thank.updateMany(query, 
                    {
                        $set: {"list.$.welldoer_img": req.file.path}
                    },
                    function(err, data) {
                        if(err) {
                            return res.status(500).json({message: 'Not updated'});
                        }
                    }
                );
            }
        } 
        catch (e) {
            errorHandler(res, e)
        }        


        res.status(200).json(welldoer)
    } 
    catch (e) {
        errorHandler(res, e)
    }
}