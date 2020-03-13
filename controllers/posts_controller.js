const Post = require('../models/post');
const Comment = require('../models/comment');
module.exports.create = async function(req,res){

  try{
    await Post.create({
      content: req.body.content,
      user: req.user._id
  });
// xhr req
   if(req.xhr){
     return res.status(200).json({
       data:{
         post: post
       },
       message:"Post Created "
     })
   }

  req.flash('success','Post published!');
  return res.redirect('back');
  }catch(err){
    req.flash('error',err);
    return;
  }
  
}
// deleting a post by authenticated user
module.exports.destroy =  async  function(req,res){

  try{
    let post = await Post.findById(req.params.id)
    // .id means converting object id into string
    if(post.user == req.user.id){
      post.remove();
  // deleting comments of the particular post 
      await Comment.deleteMany({post : req.params.id})

      if(req.xhr){
        return res.status(200).json({
          data:{
            post_id:req.params.id
          },
          message:"Post deleted Successfully "
        })
      }

      req.flash('success','Post and associated comments deleted');
        return res.redirect('back');   
   }else{
    req.flash('error','You cannot delete this post');
    return res.redirect('back');        
   }

  }catch(err){
    req.flash('error',err);
    return res.redirect('back');    
  }

}