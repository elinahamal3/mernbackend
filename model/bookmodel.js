const mongoose = require("mongoose");
const schema = mongoose.Schema

const bookschema = new schema({
    bookName: {
        type: String,
        unique : true,
        required: true
    },
    bookPrice: {
        type: Number
    },
    isbnNumber: {
        type: Number
    },
    authorName: {
        type: String
    },
    publishedAt:{
        type: String
    },
     publication:{
        type: String
    },
    imageUrl :{
        type: String

    }
})
const book = mongoose.model('Book',bookschema)
module.exports = book;