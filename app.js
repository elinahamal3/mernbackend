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
    origin: ["http://localhost:5173", "https://mern-stack-7pp1-pi.vercel.app"],
  })
);

const PORT = process.env.PORT || 3000;
const BASE_URL = "https://mernbackend-1-fcec.onrender.com";

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is running 🚀" });
});

// Create book
app.post("/book", upload.single("image"), async (req, res) => {
  let fileName = req.file
    ? `${BASE_URL}/${req.file.filename}`
    : "https://cdn.vectorstock.com/i/preview-1x/77/30/default-avatar-profile-icon-grey-photo-placeholder-vector-17317730.jpg";

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

  res.status(201).json({ message: "Book Created Successfully" });
});

// Get all books
app.get("/book", async (req, res) => {
  const books = await Book.find();
  res.status(200).json({ message: "Books fetched successfully", data: books });
});

// Get single book
app.get("/book/:id", async (req, res) => {
  const id = req.params.id;
  const book = await Book.findById(id);

  if (!book) {
    res.status(404).json({ message: "Nothing found" });
  } else {
    res
      .status(200)
      .json({ message: "Single Book Fetched Successfully", data: book });
  }
});

// Delete book
app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete image file if stored locally
    if (book.imageUrl && book.imageUrl.startsWith(BASE_URL)) {
      const imagePath = book.imageUrl.slice(BASE_URL.length + 1);
      fs.unlink(`storage/${imagePath}`, (err) => {
        if (err) console.error("Error deleting file:", err);
        else console.log("Image file deleted successfully");
      });
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Update book
app.patch("/book/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const {
    bookName,
    bookPrice,
    authorName,
    publishedAt,
    publication,
    isbnNumber,
  } = req.body;
  const oldDatas = await Book.findById(id);

  if (!oldDatas) {
    return res.status(404).json({ message: "Book not found" });
  }

  let fileName = oldDatas.imageUrl;

  if (req.file) {
    // Delete old file if not placeholder
    if (oldDatas.imageUrl && oldDatas.imageUrl.startsWith(BASE_URL)) {
      const oldImagePath = oldDatas.imageUrl.slice(BASE_URL.length + 1);
      fs.unlink(`storage/${oldImagePath}`, (err) => {
        if (err) console.log("Error deleting old file:", err);
        else console.log("Old file deleted successfully");
      });
    }
    fileName = `${BASE_URL}/${req.file.filename}`;
  }

  await Book.findByIdAndUpdate(id, {
    bookName,
    bookPrice,
    authorName,
    publication,
    publishedAt,
    isbnNumber,
    imageUrl: fileName,
  });

  res.status(200).json({ message: "Book Updated Successfully" });
});

// Serve static files
app.use(express.static("./storage/"));

// Start server
app.listen(PORT, () => {
  console.log(`Nodejs server is running on port ${PORT}`);
  connecttodatabase();
});
