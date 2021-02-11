const Thank = require('../models/Thank')
const Good = require('../models/Good')
const Welldoer = require('../models/Welldoer')
const errorHandler = require('../utils/errorHandler')

module.exports.getActual = async function(req, res) {
    const query = {
        user: req.user.id,
        createdOn: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
        }
    }
    try {
        let thank = await Thank.findOne(query);
        if (!thank) {
            let goods = await Good.find({
                user: req.user.id,
                $expr: {$gt: [ {$toLong: "$createdOn"} , {$subtract: [Date.now(), {$multiply: ["$lifetimeDays" , 86400000]} ]} ]}
            }).populate({path: 'welldoer', model: Welldoer})
            let thankList = goods.map(function(good) {
                return {
                    welldoer_id: good.welldoer._id, 
                    welldoer_name: good.welldoer.name, 
                    welldoer_img: good.welldoer.imageSrc, 
                    good_id: good._id, 
                    good_description: good.description, 
                    thanked: 0};
              });
            thank = await new Thank({
                user: req.user.id,
                list: thankList
            }).save()
        }
        //console.log(thank);
        res.status(200).json(thank)
    } 
    catch (e) {
        errorHandler(res, e)
    }
}


module.exports.update = async function(req, res) {
    try {
      let thank;
        if (req.body.good_id) {
          thank = await Thank.findOneAndUpdate(
            {_id: req.params.id, "list.good_id": req.body.good_id},
            {$set: {"list.$.thanked": 1}},
            {new: true}
          )
        }
        else {
          thank = await Thank.findOneAndUpdate(
            {_id: req.params.id, "list.welldoer_id": req.body.welldoer_id},
            {$set: {"list.$.thanked": 1}},
            {new: true}
          )
        }
        res.status(200).json(thank)
    } catch (e) {
        errorHandler(res, e)
    }
    
}

// (get) localhost:5000/api/thank/history?offset=2&limit=5
module.exports.getAll = async function(req, res) {
    const query = {
      user: req.user.id
    }
  
    if (req.query.start) {
      query.createdOn = {
        $gte: new Date(req.query.start)
      }
    }
  
    if (req.query.end) {
      if (!query.createdOn) {
        query.createdOn = {}
      }
      query.createdOn['$lte'] = new Date(new Date(req.query.end).getTime() + 86400000)
    }
  
    if (req.query.order) {
      query.order = +req.query.order
    }
  
    try {
      const thanks = await Thank
        .find(query)
        .sort({date: -1})
        .skip(+req.query.offset)
        .limit(+req.query.limit)
  
      res.status(200).json(thanks)
  
    } catch (e) {
      errorHandler(res, e)
    }
}
  