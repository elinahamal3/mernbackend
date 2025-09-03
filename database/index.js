const { mongoose, connect } =require('mongoose');
const connectionstring = process.env.MONGOURL

async function connecttodatabase() {
    await mongoose.connect(connectionstring)
    console.log("connected to mongoose");
    
}
module.exports = connecttodatabase;