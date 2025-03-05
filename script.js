document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM fully loaded!");

    // Get elements
    const form = document.getElementById("applicationForm");
    const responseMessage = document.createElement("p");
    form.appendChild(responseMessage);

    const statusButton = document.getElementById("statusButton");
    const statusDisplay = document.getElementById("statusDisplay");
    const blacklistButton = document.getElementById("blacklistButton");
    const removeButton = document.getElementById("removeButton");

    // JSONBin.io API URL
    const JSONBIN_URL = "https://api.jsonbin.io/v3/b/67c851f6e41b4d34e4a1358b";
    const API_KEY = "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi.";

    // Global variables
    let blacklist = [];
    let lastStatus = null;

    // --- Fetch Status and Blacklist from JSONBin ---
    async function fetchStatus() {
        try {
            const response = await fetch(JSONBIN_URL, {
                headers: { "X-Master-Key": API_KEY }
            });
            const data = await response.json();

            console.log("✅ Fetched Data from JSONBin:", data);

            // Reload only if status or blacklist has changed
            if (lastStatus !== data.record.status || JSON.stringify(blacklist) !== JSON.stringify(data.record.blacklist)) {
                lastStatus = data.record.status;
                blacklist = data.record.blacklist || [];
                updateStatusUI(lastStatus);
            }

        } catch (error) {
            console.error("❌ Error fetching status:", error);
        }
    }

    // --- Update Status UI ---
    function updateStatusUI(status) {
        if (status === "online") {
            statusDisplay.textContent = "✅ Anketos: Atidarytos";
            document.title = "Anketos Atidarytos"; // Update title
        } else {
            statusDisplay.textContent = "❌ Anketos: Uždarytos";
            document.title = "Anketos Uždarytos"; // Update title
        }
    }

    // --- Periodic Status Check ---
    setInterval(fetchStatus, 5000);

    // --- Admin Authentication ---
    function authenticateAdmin() {
        return sessionStorage.getItem("adminAuth") === "true";
    }

    function requestPassword() {
        const password = prompt("🔑 Enter admin password:");
        if (password === "987412365") {
            sessionStorage.setItem("adminAuth", "true");
            alert("✅ Authentication successful!");
        } else {
            alert("❌ Invalid password!");
        }
    }

    // --- Toggle Status ---
    async function toggleStatus() {
        if (!authenticateAdmin()) {
            requestPassword();
            return;
        }

        const newStatus = lastStatus === "offline" ? "online" : "offline";
        await updateJSONBin(newStatus);
        updateStatusUI(newStatus);
    }

    // --- Update JSONBin ---
    async function updateJSONBin(newStatus) {
        try {
            await fetch(JSONBIN_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY,
                },
                body: JSON.stringify({ status: newStatus, blacklist })
            });
        } catch (error) {
            console.error("❌ Error updating JSONBin:", error);
        }
    }

    // --- Form Submission ---
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (lastStatus === "offline") {
            responseMessage.innerText = "❌ Anketos šiuo metu uždarytos.";
            responseMessage.style.color = "red";
            return;
        }

        const username = document.getElementById("username").value.trim();
        if (blacklist.includes(username)) {
            responseMessage.innerText = "🚫 Jūs esate užblokuotas ir negalite pateikti anketos!";
            responseMessage.style.color = "red";
            return;
        }

        alert("✅ Aplikacija pateikta!");
        form.reset();
    });

    // Add event listeners
   statusButton.addEventListener("click", toggleStatus);
    blacklistButton.addEventListener("click", addToBlacklist);
    removeButton.addEventListener("click", removeFromBlacklist);

    // Load initial status
    fetchStatus();
});
