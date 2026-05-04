const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "a123123",
    database: "likeme",
    port: 5432
});

const getPosts = async () => {
    const result = await pool.query("SELECT * FROM posts");
    return result.rows;
};

const agregarPost = async ({ titulo, img, descripcion, likes }) => {
    const query = `
        INSERT INTO posts
        VALUES (DEFAULT, $1, $2, $3, $4)
        RETURNING *
    `;

    const values = [titulo, img, descripcion, likes];

    const result = await pool.query(query, values);

    return result.rows[0];
};

module.exports = {
    getPosts,
    agregarPost
};