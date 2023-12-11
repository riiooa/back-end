const express = require("express");
const cors = require("cors");
const port = 3000;

const sequelize = require("./db.config");
sequelize.sync().then(() => console.log("ready!!"));

const userEndpoint = require("./routes/users");
const todoEndpoint = require("./routes/todo");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userEndpoint);
app.use("/todo", todoEndpoint);

app.listen(port, () => console.log(`running server on port ${port}`));
