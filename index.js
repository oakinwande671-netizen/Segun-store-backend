require('dotenv').config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const port= process.env.PORT || 3000

const app = express();

app.use(cors({
    origin: "https://segun-store.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());


const products = require("./server/routes/products");
const users = require("./server/routes/user");
app.use("/api/v1/products", products);
app.use("/api/v1/users", users);

require('./server/db/config')
.then((con) => {
    console.log('database connected')
    app.listen(port, () => console.log("app is running at port 3000"))
    })
    .catch(console.error)