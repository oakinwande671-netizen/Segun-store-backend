const express = require('express');
const router = express.Router();

const Product = require('../models/productSchema');

// fetch all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);  
    } catch (error) {
        res.status(500).json({ message: "Internal server error"})
    }
})

// fetch a specific product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: "Internal server error"})
    }
})

// insert a product
router.post('/', async (req, res) => {
    const { username, ...data } = req.body;
    
    if (!username || !data) return res.status(400).json({ error: 'bad request' })
    
    try {
        // save
        const newProduct = new Product(data);
        newProduct.addedBy = username;
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// batup upload
router.post('/bulk', async (req, res) => {
    const { username, ...reqBody } = req.body;

    const products = reqBody.parsedProducts;

    products.forEach(product => product.addedBy = username);
    
    if (!reqBody) return res.status(400).json({ error: "bad request" });
    
    try {
        // create
        const productsInsert = await Product.create(products);
        res.status(201).json(productsInsert);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// update a product
router.put('/', async (req, res) => {
    const update = req.body;
    if (!update) return res.status(400).json({ error: "bad request. no data supplied" });

    const product = await Product.findById(update._id);
    if (!product) return res.status(400).json({ error: "bad request. no data supplied" });
    
    
    const keysForUpdate = Object.keys(update);

    const updateObj = {};

    for( key of keysForUpdate) {
        updateObj[key] = update[key];
    }

    try {
        const doc = await Product.findOneAndUpdate({
            _id: product._id,
        }, updateObj,
        { new: true });

        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// additions
// get uploads by a particular user
router.get("/:username/products", async (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).send("bad request");
  }

  try {
    const productsByUser = await Product.find({ addedBy: username });
    res.status(200).json(productsByUser);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Product.findOneAndDelete({ _id: req.params.id });
        res.status(200).json(deleted);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;