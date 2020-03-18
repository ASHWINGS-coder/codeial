const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(req,res){
    try{
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes')
        }

        // check if a like already exisits  
        let exisitingLike = await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user: req.user._id
        });

        // if a like alredy exists then delete it
        if(exisitingLike){
            likeable.likes.pull(exisitingLike._id)
            likeable.save();

            exisitingLike.remove();
            deleted = true;

        }else{
            // else make a new like 
            let newLike = await Like.create({
                user:req.user._id,
                likeable: req.query.id,
                onModel : req.query.type
            })

            likeable.likes.push(newlike._id);
            likeable.save();
        }

        return res.json(200,{
            message :"Request successful",
            data:{
                deleted:deleted 
            }
        })



    }catch(err){
        console.log("Error ",err);
        return res.json(500,{
            message:"Internal Server Error"
        });
    }
}