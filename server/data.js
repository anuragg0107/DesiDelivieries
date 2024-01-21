const mongoose = require("mongoose");

var mongoURL = "mongodb+srv://anuraggupta199418:tulsi1234@cluster0.24mvzvx.mongodb.net/hotel-room"

mongoose.connect(mongoURL, {useUnifiedTopology : true , useNewUrlParser : true})

var connection = mongoose.connection;

connection.on('error',()=>{
    console.log('mongodb connection error');
})

connection.on('connected',()=>{
    console.log('mongodb connection connected');
})

module.exports = mongoose