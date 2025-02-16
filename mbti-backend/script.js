// Simulate a database using local storage
let users = JSON.parse(localStorage.getItem("users")) || [];

// Ensure user is logged in before accessing the dashboard
document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3001/get-users") // Fetch user data
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) return;

            let totalUsers = data.length;
            let labelCounts = {
                "Innovators 🚀": 0,
                "Knowledge Hunters 📚": 0,
                "Competitive Coders 🏆": 0,
                "Social Coders 🤝": 0
            };

            // Count occurrences of each label
            data.forEach(user => {
                let userLabel = user.label.trim();
                if (userLabel.includes("Innovators")) labelCounts["Innovators 🚀"]++;
                if (userLabel.includes("Knowledge Hunters")) labelCounts["Knowledge Hunters 📚"]++;
                if (userLabel.includes("Competitive Coders")) labelCounts["Competitive Coders 🏆"]++;
                if (userLabel.includes("Social Coders")) labelCounts["Social Coders 🤝"]++;
            });

            // Populate table
            const statsTableBody = document.querySelector("#statsTable tbody");
            statsTableBody.innerHTML = ""; // Clear existing data

            Object.keys(labelCounts).forEach(label => {
                let count = labelCounts[label];
                let percentage = totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(2) + "%" : "0%";

                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${label}</td>
                    <td>${count}</td>
                    <td>${percentage}</td>
                `;
                statsTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading statistics:", error));
});


// 🚀 **Function to handle T-shirt color selection & Mission Assignment**
function submitTshirt() {
    const colorSelect = document.getElementById('colorSelect');
    const otherColorInput = document.getElementById('otherColor');
    let selectedColor;

    if (colorSelect.value === 'other') {
        selectedColor = otherColorInput.value.trim();
        if (!selectedColor) {
            alert('Please specify your T-shirt color');
            return;
        }
    } else if (!colorSelect.value) {
        alert('Please select a T-shirt color');
        return;
    } else {
        selectedColor = colorSelect.value;
    }

    // Retrieve current user's label from localStorage
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || !currentUser.label) {
        alert("Error: Your label is missing. Redirecting to questionnaire.");
        window.location.href = "questionnaire.html";
        return;
    }

    let userLabel = currentUser.label;

    // ✅ Set the user label in the task popup
    document.getElementById('userLabel').textContent = userLabel;
    document.getElementById('matchingLabel').textContent = userLabel;
    
    // ✅ Set the selected T-shirt color
    document.getElementById('targetColor').textContent = selectedColor;
    document.getElementById('targetColorRepeat').textContent = selectedColor;

    // ✅ Show the task popup
    document.getElementById('tshirtPopup').style.display = 'none';
    document.getElementById('taskPopup').style.display = 'block';
}





// 🚀 **Ensure the Label is Stored on Registration**
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.username === username && user.password === password);

    if (user) {
        if (!user.label || user.label.trim() === "") {
            alert("You need to complete the questionnaire first.");
            window.location.href = "questionnaire.html"; 
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid username or password.");
    }
});





// Logout function
document.getElementById("logoutButton")?.addEventListener("click", function () {
    localStorage.removeItem("currentUser"); // Remove user session
    window.location.href = "index.html"; // Redirect to login page
});

// Registration Form - Ensure user is stored properly before redirection
document.getElementById("registerForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter a valid username and password.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(user => user.username === username)) {
        alert("Username already exists.");
        return;
    }

    // 🛠 FIX: New users will be assigned a label after the questionnaire
    const newUser = { username, password, mbti: "", label: "" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // Redirect user to questionnaire to determine their label
    setTimeout(() => {
        window.location.href = "questionnaire.html";
    }, 1000);
});

document.getElementById("quizForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    let scores = {
        "Innovators 🚀": 0,
        "Knowledge Hunters 📚": 0,
        "Competitive Coders 🏆": 0,
        "Social Coders 🤝": 0
    };

    document.querySelectorAll('input[type="radio"]:checked').forEach(option => {
        const answer = option.parentElement.innerText.trim();
        if (answer.includes("Innovators")) scores["Innovators 🚀"]++;
        if (answer.includes("Knowledge Hunters")) scores["Knowledge Hunters 📚"]++;
        if (answer.includes("Competitive Coders")) scores["Competitive Coders 🏆"]++;
        if (answer.includes("Social Coders")) scores["Social Coders 🤝"]++;
    });

    let highestLabel = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (!currentUser) {
        alert("Error: No logged-in user found.");
        return;
    }

    // ✅ Store the assigned label correctly
    currentUser.label = highestLabel;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // ✅ Ensure the label is also stored in the users list
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map(user => user.username === currentUser.username ? currentUser : user);
    localStorage.setItem("users", JSON.stringify(users));

    // ✅ Notify and redirect user to dashboard
    alert("Your tech label is: " + highestLabel);
    window.location.href = "dashboard.html";
});


// MBTI Questionnaire - Fixed CSV Update Issue
document.getElementById("mbtiForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const answers = Array.from(document.querySelectorAll('input[type="radio"]:checked')).map(input => input.value);

    if (answers.length < 5) {
        alert("Please answer all questions.");
        return;
    }

    const mbti = calculateMBTI(answers);
    const label = calculateLabel(answers);

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    currentUser.mbti = mbti;
    currentUser.label = label;

    // ✅ Update the user list correctly
    users = users.map(user => user.username === currentUser.username ? currentUser : user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    console.log("Updated user stored in localStorage:", currentUser);

    // Send user data to backend to update CSV
    fetch("http://localhost:3001/update-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser),
    })
    .then(response => response.text())
    .then(data => {
        console.log("CSV Update Response:", data);
        // ✅ Ensure update before redirection
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    })
    .catch(error => console.error("Error updating CSV:", error));
});

// Calculate MBTI (dummy logic)
function calculateMBTI(answers) {
    return answers.join("");
}

// Calculate Label (Leader, Follower, Entrepreneur)
function calculateLabel(answers) {
    const leaderCount = answers.filter(answer => answer === "L").length;
    const followerCount = answers.filter(answer => answer === "F").length;

    return leaderCount > followerCount ? "Leader" :
           followerCount > leaderCount ? "Follower" :
           "Entrepreneur";
}

// Handle tab switching
//document.getElementById("eventsTab")?.addEventListener("click", function () {
  //  document.getElementById("eventsPanel").style.display = "block";
    //document.getElementById("addFriendPanel").style.display = "none";
//});

document.getElementById("addFriendTab")?.addEventListener("click", function () {
    document.getElementById("eventsPanel").style.display = "none";
    document.getElementById("addFriendPanel").style.display = "block";
    populateFriends();
});


document.getElementById("withdrawButton")?.addEventListener("click", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        alert("No user found.");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to withdraw? This action cannot be undone.");
    if (!confirmDelete) return;

    // Remove user from local storage
    localStorage.removeItem("currentUser");

    // Remove user from the local list
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter(user => user.username !== currentUser.username);
    localStorage.setItem("users", JSON.stringify(users));

    // Send request to backend to remove user from CSV
    fetch("http://localhost:3001/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username })
    })
    .then(response => response.text())
    .then(data => {
        console.log("Withdraw Response:", data);
        alert("Your account has been successfully deleted.");
        window.location.href = "index.html"; // Redirect to login page
    })
    .catch(error => console.error("Error withdrawing user:", error));
});


// Function to display friends with the same label
function populateFriends() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const filteredUsers = users.filter(user =>
        user.label.toLowerCase() === currentUser.label.toLowerCase() &&
        user.username !== currentUser.username
    );

    const friendList = document.getElementById("friendList");
    friendList.innerHTML = ""; // Clear previous results

    if (filteredUsers.length === 0) {
        friendList.innerHTML = "<li>No matching friends found</li>";
    } else {
        filteredUsers.forEach(user => {
            let listItem = document.createElement("li");
            listItem.textContent = `${user.username} (${user.mbti}) - ${user.label}`;
            friendList.appendChild(listItem);
        });
    }
}

// Display events in Eventbrite format
function displayEvents() {
    const eventContainer = document.getElementById("eventsList");
    eventContainer.innerHTML = ""; // Clear previous events

    const events = [
        {
            name: "Mindfulness for Mental Wellbeing",
            date: "Fri, 28 Feb, 19:00",
            location: "Brahm Mindfulness Centre @ Newton",
            price: "Free",
            image: "https://source.unsplash.com/400x200/?meditation,mentalhealth"
        },
        {
            name: "World Ageing Festival 2025",
            date: "Wed, 9 Apr, 09:00",
            location: "Marina Bay Sands Singapore",
            price: "Free",
            image: "https://source.unsplash.com/400x200/?elderly,healthcare"
        }
    ];

    events.forEach(event => {
        let eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.name}">
            <div class="event-info">
                <h3>${event.name}</h3>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Price:</strong> ${event.price}</p>
            </div>
        `;
        eventContainer.appendChild(eventCard);
    });
}

// Load events when page loads
window.onload = function () {
    displayEvents();
};