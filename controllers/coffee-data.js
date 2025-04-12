const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { CoffeeShops } = require('../models/coffee-data');

const verifyToken = require('../middleware/verify-token')

router.get("/", async (req, res) => {
    try {
        const coffeeShops = await CoffeeShops.find();

        if (!coffeeShops || coffeeShops.length === 0) {
            return res.status(404).json({ message: "No coffee shops found" });
        }
        res.status(200).json(coffeeShops);
    } catch (error) {

        res.status(500).json({ error: error.message });
    }
});

router.post("/add", verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id
        const { shop, coffeeData } = req.body; 
       
        const newShop = new CoffeeShops(
            req.body,
        );
        console.log(newShop)
        await newShop.save();

      
        res.status(201).json(
            newShop,
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:coffeeShopId", async (req, res) => {
    try {
        const { coffeeShopId } = req.params;
        const coffeeShop = await CoffeeShops.findById(coffeeShopId);
        if (!coffeeShop) {
            return res.status(404).json({ message: "Coffee shop not found" });
        }
        res.status(200).json(coffeeShop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
);

router.put("/review/:coffeeShopId",verifyToken, async (req, res) => {
    try {
        const { coffeeShopId } = req.params;
        const coffeeShop = await CoffeeShops.findById(coffeeShopId);
       
        const updatedShop = await CoffeeShops.findByIdAndUpdate(
            coffeeShopId,
            req.body,
            { new: true }
        );
        console.log(req.body)
        if (!updatedShop) {
            return res.status(404).json({ message: "Coffee shop not found" });
        }
        res.status(200).json(updatedShop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:coffeeShopId", async (req, res) => {
    try {
        const { coffeeShopId } = req.params;
        const deletedShop = await CoffeeShops.findByIdAndDelete(coffeeShopId);
        if (!deletedShop) {
            return res.status(404).json({ message: "Coffee shop not found" });
        }
        res.status(200).json({ message: "Coffee shop deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
