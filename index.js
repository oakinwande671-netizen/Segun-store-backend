require('dotenv').config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "segun-store.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

require('./server/db/config')
    .then((con) => {
        console.log('database connected')
        app.listen(3000, () => console.log("app is running at port 3000"))
    })
    .catch(console.error)

const products = require("./server/routes/products");
const users = require("./server/routes/user");
app.use("/api/v1/products", products);
app.use("/api/v1/users", users);
