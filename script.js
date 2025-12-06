// DOM Elements
const userInput = document.getElementById("userID");
const searchBtn = document.getElementById("btn");
const userProfile = document.getElementById("userProfile");
const exampleUsers = document.querySelectorAll(".example-user");

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

// Add event listeners to example users
exampleUsers.forEach(user => {
    user.addEventListener("click", () => {
        const username = user.getAttribute("data-user");
        userInput.value = username;
        handleSearch();
    });
});

// Handle search function
async function handleSearch() {
    const username = userInput.value.trim();
    
    if (!username) {
        showError("Please enter a GitHub username");
        return;
    }
    
    // Show loading state
    userProfile.innerHTML = `
        <div class="loading-state">
            <span class="loader"></span>
            <p>Searching for ${username}...</p>
        </div>
    `;
    
    try {
        const userData = await fetchUser(username);
        displayUser(userData);
    } catch (error) {
        console.error("Error fetching user:", error);
        showError("User not found or API limit exceeded. Please try again.");
    }
}

// Fetch user data from GitHub API
async function fetchUser(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("User not found");
        } else if (response.status === 403) {
            throw new Error("API rate limit exceeded");
        } else {
            throw new Error("Failed to fetch user data");
        }
    }
    
    const data = await response.json();
    return data;
}

// Display user data
function displayUser({
    avatar_url,
    name,
    bio,
    followers,
    following,
    public_repos,
    html_url,
    login
}) {
    const displayName = name || login;
    const displayBio = bio || `GitHub user ${login}`;
    
    userProfile.innerHTML = `
        <div class="userInfo">
            <img src="${avatar_url}" class="userImg" alt="${displayName}'s profile picture">
            <div class="userDetail">
                <p class="userName">${displayName}</p>
                <p class="userBio">${displayBio}</p>
            </div>
        </div>
        <div class="userFollow">
            <div class="Follower">
                <div class="repo">
                    <p>Followers</p>
                    <p>${followers.toLocaleString()}</p>
                </div>
                <div class="repo">
                    <p>Following</p>
                    <p>${following.toLocaleString()}</p>
                </div>
                <div class="repo">
                    <p>Repositories</p>
                    <p>${public_repos.toLocaleString()}</p>
                </div>
            </div>
            <a href="${html_url}" target="_blank" rel="noopener noreferrer" class="VisitProile">
                <i class="fab fa-github"></i>
                Visit GitHub Profile
            </a>
        </div>
    `;
    
    // Add animation
    userProfile.style.opacity = "0";
    userProfile.style.transform = "translateY(20px)";
    
    setTimeout(() => {
        userProfile.style.transition = "all 0.5s ease";
        userProfile.style.opacity = "1";
        userProfile.style.transform = "translateY(0)";
    }, 10);
}

// Show error state
function showError(message) {
    userProfile.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>Oops!</h2>
            <p>${message}</p>
            <button onclick="resetSearch()" style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
                Try Again
            </button>
        </div>
    `;
}

// Reset search function (accessible globally)
window.resetSearch = function() {
    userInput.value = "";
    userProfile.innerHTML = `
        <div class="initial-state">
            <i class="fas fa-search fa-4x"></i>
            <h2>Search for a GitHub user</h2>
            <p>Enter a username above to view their profile information</p>
        </div>
    `;
    userInput.focus();
};

// Initialize with a default user
window.addEventListener("DOMContentLoaded", () => {
    // Auto-focus on input
    userInput.focus();
    
    // Load a default user on initial load (optional)
    // userInput.value = "octocat";
    // handleSearch();
});