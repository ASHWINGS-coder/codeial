const Post = require('../models/post');
const Comment = require('../models/comment');
module.exports.create = function(req,res){
  Post.create({
      content: req.body.content,
      user: req.user._id
  },function(err,post){
            if(err){
                console.log('error in creating a post');
                return ;
            }
            return res.redirect('back');
  })
}
// deleting a post by authenticated user
module.exports.destroy = function(req,res){
  Post.findById(req.params.id,function(err,post){
    // .id means converting object id into string
       if(post.user == req.user.id){
          post.remove();
// deleting comments of the particular post 
          Comment.deleteMany({post : req.params.id},function(err){
            return res.redirect('back');
          })
       }else{
        return res.redirect('back');        
       }
  });
}