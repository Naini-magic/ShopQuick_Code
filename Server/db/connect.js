const mongoose = require("mongoose");


const DB = process.env.DATABASE ;


mongoose.connect(DB).then((conn) => {
    // console.log(conn);
    console.log("mongodb connected successfully !!!!");
}).catch((error) =>{
    console.log("error" + error.message)
});

