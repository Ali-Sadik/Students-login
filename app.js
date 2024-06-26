const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory

// Load users from file
let users = loadUsers();

// Serve login page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// Handle login form submission
app.post("/login", (req, res) => {
  const { roll, password } = req.body;
  const user = users.find((user) => user.roll === roll);
  if (!user) {
    return res.redirect("/login?error=user-not-found");
  }
  bcrypt.compare(password, user.passwordHash, (err, result) => {
    if (result) {
      // Get the characters in the 3rd and 4th indices (group)
      const group = roll.slice(2, 4);
      switch (group) {
        case "09":
          return res.redirect("https://ece-home.vercel.app");
        case "05":
          return res.redirect("http://192.168.0.102:3013");
        // Add more cases for additional groups
        case "23":
          return res.redirect("http://192.168.0.102:3018");
        default:
          return res.redirect("http://192.168.0.102:3008");
      }
    } else {
      return res.redirect("/login?error=invalid-password");
    }
  });
});

// Load users from file
function loadUsers() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "users.json"));
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading users:", err);
    return [];
  }
}

// Start the server
const PORT = process.env.PORT || 2999;
app.listen(PORT, () => {
  console.log(
    "Server==\x1b[0m\x1b[32msuccess\x1b[0m\x1b[37m__________\x1b[0m\x1b[33mapp.js\x1b[0m\x1b[37m running \x1b[0m\x1b[37mStudents-login\x1b[0m\x1b[37m__________\x1b[0mon \x1b[31mport \x1b[0m\x1b[31m2999\x1b[0m"
  );
});
