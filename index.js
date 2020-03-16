const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const port = 8000 ;
const db = require('./config/mongoose');

// used for session cookie

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/paspport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
// requiring sass
const sassMiddleware = require('node-sass-middleware');
// importing flash
const flash = require('connect-flash');
// using the Middleware
const customMware = require('./config/middleware')
// using sass
app.use(sassMiddleware({
    src:'./assets/scss',
    dest: './assets/css',
    debug: true ,
    outputStyle : 'extended',
    prefix :  '/css'
}))
app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'))
// make the uploads path available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));

const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');
// mongo store is used to store the session cookie  in the data base
app.use(session({
    name:'codeial',
    // to do change the secret before deploymnt in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave:false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection : db,
        autoRemove : 'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok ');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
// flash to be set up after session as it requires session cookies 
app.use(flash());
// using the Middleware
app.use(customMware.setFlash);

// use express router
app.use('/',require('./routes/index'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running server : ${err}`)
    }
    console.log(`Server is running in : ${port}`);
})