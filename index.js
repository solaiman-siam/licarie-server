const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Licarie server is running");
});

app.listen(app, () => {
  console.log(`Licerie server is running port ${port}`);
});
