require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connecttodatabase = require("./database/index.js");
const fs = require("fs");
const Book = require("./model/bookmodel.js");
const { multer, storage } = require("./middleware/multerconfig.js");
const upload = multer({ storage: storage });

const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
const PORT = process.env.Port || 3000;
app.use(express.json());

// app.get("/", (req, res) => {
//     res.send('goodmorning');

// })
app.get("/", (req, res) => {
  res.status(400).json();
});
// app.post("/book", (req, res) => {
//     console.log(req.body)
// })
// create book
app.post("/book", upload.single("image"), async (req, res) => {
  let fileName;
  if (!req.file) {
    fileName =
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FStitch_%2528Lilo_%2526_Stitch%2529&psig=AOvVaw1SB-HqQDiTuB-s8NcPUSfo&ust=1753354349244000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCOjU4oro0o4DFQAAAAAdAAAAABAE";
  } else {
    fileName = "http://localhost:3000/" + req.file.filename;
  }
  const {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
  } = req.body;
  const newBook = await Book.create({
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
    imageUrl: fileName,
  });
  res.status(201).json({
    message: "Book Created Successfully",
  });
});

// all read
app.get("/book", async (req, res) => {
  const books = await Book.find(); // return array ma garxa
  res.status(200).json({
    message: "Books fetched successfully",
    data: books,
  });
});
// single read
app.get("/book/:id", async (req, res) => {
  const id = req.params.id;
  const book = await Book.findById(id); // return object garxa

  if (!book) {
    res.status(404).json({
      message: "Nothing found",
    });
  } else {
    res.status(200).json({
      message: "Single Book Fetched Successfully",
      data: book,
    });
  }
});

//delete operation
app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;
  await Book.findByIdAndDelete(id);
  res.status(200).json({
    message: "Book Deleted Successfully",
  });
});

// update operation
app.patch("/book/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id; // kun book update garney id ho yo
  const {
    bookName,
    bookPrice,
    authorName,
    publishedAt,
    publication,
    isbnNumber,
  } = req.body;
  const oldDatas = await Book.findById(id);
  let fileName;
  if (req.file) {
    // console.log(req.file);
    // console.log(oldDatas)
    const oldImagePath = oldDatas.imageUrl;
    console.log(oldImagePath);
    const localhostlength = "http://localhost:3000/".length;
    const newoldimagepath = oldImagePath.slice(localhostlength);
    console.log(newoldimagepath);

    fs.unlink(`storage/${newoldimagepath}`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("file deleted successfully");
      }
    });
    fileName = "http://localhost:3000/" + req.file.filename;
  }
  await Book.findByIdAndUpdate(id, {
    bookName: bookName,
    bookPrice: bookPrice,
    authorName: authorName,
    publication: publication,
    publishedAt: publishedAt,
    isbnNumber: isbnNumber,
  });
  res.status(201).json({
    message: "Book Updated Successfully",
  });
});

app.use(express.static("./storage/"));
app.listen(process.env.PORT, () => {
  console.log("Nodejs server is running on port 3000");
  connecttodatabase();
});
