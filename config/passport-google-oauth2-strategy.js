const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
// tell passport to use new strategy for Google Login
passport.use(new googleStrategy({
    clientID:"458104834324-0lqla57prdd215usejt2shpsarkjd4th.apps.googleusercontent.com",
    clientSecret:"-vkD6LmTzsj-nuMi1SRuet6v",
    callbackURL:"http://localhost:8000/users/auth/google/callback",
},

function(accessToken,refreshToken,profile,done){
    // find a user
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){console.log("Error in google strategy passport",err);return;}

        console.log(profile);

        if(user){
            // if found set this user as req.user
            return done(null,user);
        }else{
            //if not found , create the user and set is as req.user (sign in that user)
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },function(err){
                if(err){console.log("Error in creating user",err);return;}

                return done(null,user);
            })
        }
    });

}

))

module.exports = passport;
