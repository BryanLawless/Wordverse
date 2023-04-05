require("dotenv").config();

const http = require("http");
const cors = require("cors");
const express = require("express");
const router = require("./router");
const pkg = require("../package.json");
const Words = require("./modules/words");
const config = require("./config/config");
const httpStatus = require("http-status");
const socketServer = require("./gateway/main");
const cookieParser = require("cookie-parser");
const database = require("./database/database");

/* Create new express app */
const app = express();

/* Create a new HTTP server */
const server = http.createServer(app);

/* Disable x-powered-by header for security reasons */
app.disable("x-powered-by");

/* Enable CORS for API requests */
app.use(
	cors({
		credentials: true,
		origin: config.CLIENT_URL,
		methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"]
	})
);

/* Enable JSON and cookie usage with express */
app.use(express.json());
app.use(cookieParser());

/* Connect to the database */
database.Connect();

/* Register the main API router */
app.use("/api", router);

/* Register the socket server */
socketServer.registerSocketServer(server);

/* Register the root version endpoint. TODO: Replace with health check */
app.use("", (req, res) => {
	res.status(httpStatus.OK).send(`Wordverse v(${pkg.version}) API active.`);
});

/* Preload the Word Generator */
Words.loadWords().then(() => {
	console.log("📜 - Word list has been loaded.");
});

/* Start server on default port or 127.0.0.1:5000 */
server.listen(process.env.PORT || 5000, "0.0.0.0", () => {
	console.log("💾 - Words Hurt server started.");
});
