const express = require("express");
const cors = require("cors");

const { getPosts, agregarPost, updatePost, deletePost } = require("./consultas");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/posts", async (req, res) => {
    try {
        const posts = await getPosts();
        res.json(posts);
    } catch (error) {
        console.error("Error al obtener posts:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener posts" });
    }
});

app.post("/posts", async (req, res) => {
    try {
        const { titulo, img, descripcion } = req.body;
        if (!titulo || !img || !descripcion) {
            return res.status(400).json({ error: "Faltan campos requeridos: titulo, img, descripcion" });
        }
        const nuevoPost = await agregarPost({ titulo, img, descripcion, likes: 0 });
        res.status(201).json(nuevoPost);
    } catch (error) {
        console.error("Error al agregar post:", error);
        res.status(500).json({ error: "Error interno del servidor al agregar post" });
    }
});

app.put("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, img, descripcion, likes } = req.body;
        if (!titulo || !img || !descripcion || likes === undefined) {
            return res.status(400).json({ error: "Faltan campos requeridos: titulo, img, descripcion, likes" });
        }
        const updatedPost = await updatePost(id, { titulo, img, descripcion, likes });
        res.json(updatedPost);
    } catch (error) {
        if (error.message === 'Post no encontrado') {
            return res.status(404).json({ error: "Post no encontrado" });
        }
        console.error("Error al actualizar post:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar post" });
    }
});

app.delete("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await deletePost(id);
        res.json({ message: "Post eliminado exitosamente", post: deletedPost });
    } catch (error) {
        if (error.message === 'Post no encontrado') {
            return res.status(404).json({ error: "Post no encontrado" });
        }
        console.error("Error al eliminar post:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar post" });
    }
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});