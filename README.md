HACKONMANIA 2025


UPDATED CODE IN TENG BRANCH

# EchoMinds

**EchoMinds** is a community-driven event platform designed to connect tech enthusiasts based on their interests and engagement styles. Participants can check in at events, take personality-based quizzes, and gain insights into the tech community.

## 🚀 Tech Stack

- **Frontend:** HTML, CSS (with custom styles), JavaScript
- **Backend:** Node.js with Express.js
- **Database:** CSV file (`users.csv`) for storing user data
- **Local Storage:** Browser-based local storage for temporary user data

## 📦 Features

- User registration and login with local storage
- MBTI-style questionnaire to categorize users (Innovators 🚀, Knowledge Hunters 📚, Competitive Coders 🏆, Social Coders 🤝)
- Community insights displayed in a statistics table
- Event check-in with interactive tasks
- Friend matching based on tech interests

---

## 🛠️ Installation and Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/EchoMinds.git
cd EchoMinds
```

### 2️⃣ Install Dependencies
Ensure you have **Node.js** installed (download from [nodejs.org](https://nodejs.org/))

```sh
npm install
```

### 3️⃣ Run the Backend Server
Start the Express.js server to handle user data stored in `users.csv`.

```sh
node server.js
```
> The backend runs on `http://localhost:3001`.

### 4️⃣ Open in Browser
Open `index.html` in your browser to access the application.

---

## 🗂️ Using `users.csv` Locally

The project stores user registration and quiz results in `users.csv`.

### How to View CSV Data
You can open `users.csv` in Excel, Google Sheets, or any text editor.

### How to Reset CSV Data
If needed, you can reset the file manually:
```sh
echo "Username,Password,MBTI,Label" > users.csv
```
This will clear all stored users while keeping the headers.

---

## 🔗 API Routes
The Node.js server provides the following endpoints:

- **POST** `/update-csv` → Updates or adds a user to `users.csv`
- **POST** `/delete-user` → Removes a user from `users.csv`
- **GET** `/get-users` → Fetches all users from `users.csv`

---

## 🏗️ Forking & Contributing
Want to contribute? Follow these steps:

1. **Fork the repo** on GitHub
2. **Clone your fork** locally:
   ```sh
   git clone https://github.com/yourusername/EchoMinds.git
   ```
3. **Create a new branch** for your feature:
   ```sh
   git checkout -b feature-new-idea
   ```
4. **Commit and push** your changes:
   ```sh
   git commit -m "Added new feature"
   git push origin feature-new-idea
   ```
5. **Submit a Pull Request** 🎉

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🌟 Acknowledgments
- Special thanks to all tech enthusiasts and contributors who make EchoMinds possible!
