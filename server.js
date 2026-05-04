const express = require("express");
const cors = require("cors");

const { getPosts, agregarPost } = require("./consultas");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/posts", async (req, res) => {
    const posts = await getPosts();
    res.json(posts);
});

app.post("/posts", async (req, res) => {
    const nuevoPost = await agregarPost(req.body);
    res.json(nuevoPost);
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});