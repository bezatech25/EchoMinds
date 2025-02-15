// Simulate a database using local storage
let users = JSON.parse(localStorage.getItem("users")) || [];

// Ensure user is logged in before accessing the dashboard
document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser && window.location.pathname !== "/index.html") {
        window.location.href = "index.html"; // Redirect to login if no user
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

    if (users.find(user => user.username === username)) {
        alert("Username already exists.");
        return;
    }

    const newUser = { username, password, mbti: "", label: "" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser)); // Store session

    console.log("New user stored in localStorage:", newUser);

    // ✅ Ensure `currentUser` is available before redirection
    setTimeout(() => {
        window.location.href = "questionnaire.html";
    }, 1000);
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
document.getElementById("eventsTab")?.addEventListener("click", function () {
    document.getElementById("eventsPanel").style.display = "block";
    document.getElementById("addFriendPanel").style.display = "none";
});

document.getElementById("addFriendTab")?.addEventListener("click", function () {
    document.getElementById("eventsPanel").style.display = "none";
    document.getElementById("addFriendPanel").style.display = "block";
    populateFriends();
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
