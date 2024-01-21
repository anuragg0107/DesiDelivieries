const express = require('express');
const cors = require('cors');
const app = express();
const dbconfig = require('./data');
const userRoutes = require('./routes/userRoutes.js');
const foodRoutes = require('./routes/foodRoutes.js')
// const session = require('express-session');
// const passport = require('passport');
// const OAuth2Strategy = require("passport-google-oauth2").Strategy;
// const clientId = "43990325827-4v7rp5ce0kf6qq4i2h6i0b07992lehae.apps.googleusercontent.com";
// const clientSecret = "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";

// for receiing the data 
app.use(cors());
app.use(express.json());  
app.use("/api/users",userRoutes);
app.use("/api/food",foodRoutes);
// app.use(session({
//     secret :"9754388825",
//     resave : false,
//     saveUninitialized : true,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//     new OAuth2Strategy({
//         clientid : clientId,
//         clientsecret :clientSecret,
//         callbackURL: "/auth/google/callback",
//         scope : ["profile","email"]  
//     })
// );

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

  
const port =process.env.PORT  || 8080;

app.listen(port,()=>{
console.log(`server running at  ${port}`);
})

