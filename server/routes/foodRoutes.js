const express = require("express");
const router = express.Router();
const Food = require("../models/food.js");

// GET method to fetch all food items
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find({});
    res.status(200).json(foods);
  } catch (err) {
    console.error(`Error while fetching data: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST method for Adding food
router.post("/", async (req, res) => {
  try {
    const { title, image, description, price, category } = req.body;
    if (!title || !image || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newFood = new Food({
      title,
      image,
      description,
      price,
      category,
    });
    const savedFood = await newFood.save();
    res.status(200).json(savedFood);
  } catch (err) {
    console.error(`Error while adding a new food item: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
