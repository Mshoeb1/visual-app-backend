const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const users = require("./dataSet/user");
const newData = require("./dataSet/jsonData");
const insertionData = require("./rawData/rawJson.json");
const generateToken = require("./Tokens/jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

dotenv.config();
app.use(express.json());

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_CREDENTIAL);
    console.log("server is connected");
  } catch (err) {
    console.log("Server is not connected", err.message);
  }
};

connectDb();

// Date Api

app.get("/", (request, response) => {
  let date = new Date();
  response.send(`Today's date is ${date}`);
});

// Login Api

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const user = await users.findOne({ name });
  console.log(user.password);
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  console.log(isPasswordMatched);
  if (user && isPasswordMatched) {
    const payload = {
      name: name,
    };
    jwt.sign(payload, "MY_SECRET_TOKEN");
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      jwt_token: generateToken(user._id),
    });
    console.log("login successfull");
  } else {
    res.status(401);
    res.send("Invalid Username and Password");
  }
});

// Registration API

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    res.send("All inputs fields Required");
  }

  // checking user already exist in the database
  const userExist = await users.findOne({ email });

  if (userExist) {
    res.send("user Already Exists");
  }

  // check username already exists

  const userName = await users.findOne({ name });
  if (userName) {
    res.send("Username Already Taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await users.create({
    name: `${name}`,
    email: `${email}`,
    password: `${hashedPassword}`,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      jwt_token: generateToken(user._id),
    });
  } else {
    res.status(400);
    res.send("User Registration Error");
  }
});

// Fetching all the data from the database

app.get("/data/visual", async (req, res) => {
  try {
    const data = await newData.find();
    res.json(data);
    console.log(data);
    res.send("data retreived");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 4001;
console.log(PORT);
app.listen(PORT, console.log("Server is running on 4001 port!"));
