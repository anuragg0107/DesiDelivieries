const express = require('express');
const router = express.Router();
const CartFood = require("../models/cart.js");

// POST moethod for adding food
router.post("/", async (req, res) => {
    try {
      const { title, price, image, size,category, description } = req.body;
      const newItem = new CartFood({ title, price, image, size, category, description });
      await newItem.save();
      res.status(200).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  

// GET method for access food
router.get('/', async (req, res) => {
    try {
      const items = await CartFood.find();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  module.exports = router;