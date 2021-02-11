const Good = require('../models/Good')
const Thank = require('../models/Thank')
const Welldoer = require('../models/Welldoer')
const errorHandler = require('../utils/errorHandler')

module.exports.getByWelldoerId = async function(req, res) {
    try {
        const goods = await Good.find({
            welldoer: req.params.welldoerId,
            user: req.user.id
        })
        res.status(200).json(goods)
    } 
    catch (e) {
        errorHandler(res, e)
    }
    
}
module.exports.create = async function(req, res) {
    try {
        const good = await new Good({
            description: req.body.description,
            lifetimeDays: req.body.lifetimeDays,
            welldoer: req.body.welldoer,
            user: req.user.id
        }).save()
        
        //add created good to today task
        const query = {
            user: req.user.id,
            createdOn: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
            }
        }
        try {
            let thank = await Thank.findOne(query);
            if (thank) {
                let welldoer = await Welldoer.findOne({_id: good.welldoer._id});
                thank.list.push({
                    welldoer_id: good.welldoer._id, 
                    welldoer_name: welldoer.name, 
                    welldoer_img: welldoer.imageSrc, 
                    good_id: good._id, 
                    good_description: good.description, 
                    thanked: 0
                });
                thank.save();
            }
        } 
        catch (e) {
            errorHandler(res, e)
        }        

        res.status(201).json(good)
    } 
    catch (e) {
        errorHandler(res, e)
    }
}
module.exports.remove = async function(req, res) {
    try {
        await Good.deleteOne({_id: req.params.id})
        //delete removed good from today task
        const query = {
            user: req.user.id,
            createdOn: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
            }
        }
        try {
            await Thank.updateOne(query, {$pull: {list: {good_id: req.params.id}}}, function(err, data) {
                if(err) {
                    return res.status(500).json({message: 'Not deleted'});
                }
            });
        }        
        catch (e) {
            errorHandler(res, e)
        }
        res.status(200).json({
            message: 'Good deleted'
        })
    } 
    catch (e) {
        errorHandler(res, e)
    }
}
module.exports.update = async function(req, res) {
    try {
        const good = await Good.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        );
        //update good in today task
        const query = {
            user: req.user.id,
            createdOn: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
            },
            "list.good_id": req.body._id
        }
        try {
            await Thank.updateOne(query, 
                {
                    $set: {"list.$.good_description": req.body.description}
                },
                function(err, data) {
                    if(err) {
                        return res.status(500).json({message: 'Not updated'});
                    }
                }
            );
        } 
        catch (e) {
            errorHandler(res, e)
        }        
        
        res.status(200).json(good)
    } catch (e) {
        errorHandler(res, e)
    }
    
}