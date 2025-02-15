const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// CSV File Path
const csvFilePath = path.join(__dirname, "users.csv");

// Ensure CSV file exists with proper headers
if (!fs.existsSync(csvFilePath)) {
    fs.writeFileSync(csvFilePath, "Username,Password,MBTI,Label\n");
}

// API to update CSV file
app.post("/update-csv", (req, res) => {
    const { username, password, mbti, label } = req.body;

    if (!username || !password || !mbti || !label) {
        return res.status(400).send("Missing user data");
    }

    let csvContent = fs.readFileSync(csvFilePath, "utf-8").split("\n");
    let userExists = false;
    
    // ✅ Check if the user already exists and update their data
    csvContent = csvContent.map(line => {
        const [existingUsername, existingPassword, existingMbti, existingLabel] = line.split(",");
        if (existingUsername === username) {
            userExists = true;
            return `${username},${password},${mbti},${label}`;
        }
        return line;
    });

    // ✅ If user doesn't exist, append a new entry
    if (!userExists) {
        csvContent.push(`${username},${password},${mbti},${label}`);
    }

    fs.writeFileSync(csvFilePath, csvContent.join("\n"));
    console.log(`User ${userExists ? "updated" : "added"}: ${username}`);
    res.send(`User ${userExists ? "updated" : "added"} successfully`);
});

// Define a route for the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});