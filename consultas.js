const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "a123123",
    database: "likeme",
    port: 5432
});

const getPosts = async () => {
    try {
        const result = await pool.query("SELECT * FROM posts");
        return result.rows;
    } catch (error) {
        throw new Error(`Error al obtener posts: ${error.message}`);
    }
};

const agregarPost = async ({ titulo, img, descripcion, likes }) => {
    try {
        const query = `
            INSERT INTO posts
            VALUES (DEFAULT, $1, $2, $3, $4)
            RETURNING *
        `;

        const values = [titulo, img, descripcion, likes];

        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error) {
        throw new Error(`Error al agregar post: ${error.message}`);
    }
};

const updatePost = async (id, { titulo, img, descripcion, likes }) => {
    try {
        const query = `
            UPDATE posts
            SET titulo = $1, img = $2, descripcion = $3, likes = $4
            WHERE id = $5
            RETURNING *
        `;
        const values = [titulo, img, descripcion, likes, id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Post no encontrado');
        }
        return result.rows[0];
    } catch (error) {
        if (error.message === 'Post no encontrado') {
            throw error;
        }
        throw new Error(`Error al actualizar post: ${error.message}`);
    }
};

const deletePost = async (id) => {
    try {
        const query = `DELETE FROM posts WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error('Post no encontrado');
        }
        return result.rows[0];
    } catch (error) {
        if (error.message === 'Post no encontrado') {
            throw error;
        }
        throw new Error(`Error al eliminar post: ${error.message}`);
    }
};

module.exports = {
    getPosts,
    agregarPost,
    updatePost,
    deletePost
};