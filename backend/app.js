// chargement des modules
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

// Pour sécuriser les headers
const helmet = require("helmet");

// Pour limiter les demandes
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
	windowMs: 3 * 60 * 1000,
	max: 3,
});
// chemin des fichiers pour les images
const path = require("path");

// Pour masquer les informations de la BDD
require("dotenv").config();

// Database
const db = require("./config/database");

const app = express();

// déclaration des routes
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

// Test DB
// async function test() {
// 	try {
// 		await db.authenticate();
// 		console.log("Connection has been established successfully.");
// 		await db.sync({ force: true });
// 	} catch (error) {
// 		console.error("Unable to connect to the database:", error);
// 	}
// }
// ***************Cross Origin Resource Sharing*******************//
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// Body Parser Middleware
app.use(express.json());

// Sécurisation des données entre les sites
app.use(helmet());

// app.get("/", (req, res) => res.send("INDEX"));

// Emplacement statique des images
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/posts", postsRoutes);
app.use("/api/auth", usersRoutes);

// test();

module.exports = app;
