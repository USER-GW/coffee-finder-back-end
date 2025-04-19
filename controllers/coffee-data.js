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
        const coffeeShop = await CoffeeShops.findById(coffeeShopId).populate(
            'comments.author',
        );
        if (!coffeeShop) {
            return res.status(404).json({ message: "Coffee shop not found" });
        }
        res.status(200).json(coffeeShop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
);

// router.put("/review/:coffeeShopId",verifyToken, async (req, res) => {
//     try {
//         // const { coffeeShopId } = req.params;
//         const coffeeShop = await CoffeeShops.findById(req.params.coffeeShopId);
//     // console.log(coffeeShop)
       
//         const updatedShop = await CoffeeShops.findByIdAndUpdate(
//             req.params.coffeeShopId,
//             req.body,
//             { new: true }
//         );
//         console.log(req.body)
//         if (!updatedShop) {
//             return res.status(404).json({ message: "Coffee shop not found" });
//         }
//         res.status(200).json(updatedShop);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

router.put("/review/:coffeeShopId", verifyToken, async (req, res) => {
    
    try {
        req.body.author = req.user._id
      const coffeeShop = await CoffeeShops.findById(req.params.coffeeShopId);
      if (!coffeeShop) {
        return res.status(404).json({ message: "Coffee shop not found" });
      }
  
      const incomingData = req.body.coffeeData; 
      const existingData = coffeeShop.coffeeData || {};
  
      const averagedData = {};
  
      for (const key in incomingData) {
        if (key === '_id') continue; 
        const newVal = Number(incomingData[key]);
        const oldVal = Number(existingData[key]);
      
        if (!isNaN(oldVal) && !isNaN(newVal)) {
    
          averagedData[key] = Math.round((oldVal + newVal) / 2);
        } else {
          averagedData[key] = Math.round(newVal);
        }
      }
      
      coffeeShop.coffeeData = {
        ...existingData,
        ...averagedData
      };
  
      const saved = await coffeeShop.save();
      res.status(200).json(saved);
    } catch (error) {
      console.error('Update error:', error);
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

//COMMENTS
router.post("/comment/:coffeeShopId", verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id
        const shop = await CoffeeShops.findById(req.params.coffeeShopId);
       shop.comments.push(req.body);
        await shop.save();

        const newComment = shop.comments[shop.comments.length - 1];
        newComment._doc.author = req.user;

        res.status(201).json(newComment);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH = update
router.patch("/comment/:coffeeShopId/:commentId", verifyToken, async (req, res) => {
    try {
      const { coffeeShopId, commentId } = req.params;
      const shop = await CoffeeShops.findById(coffeeShopId);
      if (!shop) return res.status(404).json({ message: "Shop not found" });
  
      const comment = shop.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
    
      if (comment.author.toString() !== req.user._id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      comment.text = req.body.text; 
      await shop.save();
  
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete("/comment/:coffeeShopId/:commentId", verifyToken, async (req, res) => {
    try {
      const { coffeeShopId, commentId } = req.params;
  
      const shop = await CoffeeShops.findById(coffeeShopId);
      if (!shop) return res.status(404).json({ message: "Shop not found" });
  
      const comment = shop.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      if (comment.author.toString() !== req.user._id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      
      shop.comments.remove({ _id: req.params.commentId });
      await shop.save();
  
      res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  




module.exports = router;
