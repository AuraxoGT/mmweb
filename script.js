document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM fully loaded!" );

    // Get elements
    const form = document.getElementById("applicationForm");
    const responseMessage = document.createElement("p");
    form.appendChild(responseMessage);

    const statusButton = document.getElementById("statusButton");
    const statusDisplay = document.getElementById("statusDisplay");

    // JSONBin.io API configuration
    const JSONBIN_URL = "https://api.jsonbin.io/v3/b/67c851f6e41b4d34e4a1358b";
    const API_KEY = "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi.";

    // Global variables
    let blacklist = [];
    let currentStatus = "offline";

    // --- Status Management ---
    async function fetchStatus() {
        try {
            const response = await fetch(JSONBIN_URL, {
                headers: { "X-Master-Key": API_KEY }
            });
            const data = await response.json();
            
            currentStatus = data.record.status || "offline";
            blacklist = data.record.blacklist || [];
            updateStatusUI();
            console.log("📛 Status fetched:", currentStatus);
        } catch (error) {
            console.error("❌ Error fetching status:", error);
        }
    }

    async function toggleStatus() {
        try {
            const newStatus = currentStatus === "online" ? "offline" : "online";
            
            await fetch(JSONBIN_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY
                },
                body: JSON.stringify({ status: newStatus })
            });

            currentStatus = newStatus;
            updateStatusUI();
            console.log("✅ Status updated to:", newStatus);
        } catch (error) {
            console.error("❌ Error updating status:", error);
        }
    }

    function updateStatusUI() {
        if (currentStatus === "online") {
            statusDisplay.textContent = "✅ Anketos: Atidarytos";
            statusDisplay.className = "status-online";
            statusButton.textContent = "🟢 Active Control";
        } else {
            statusDisplay.textContent = "❌ Anketos: Uždarytos";
            statusDisplay.className = "status-offline";
            statusButton.textContent = "🔴 Status Control";
        }
    }

    // --- Form Submission ---
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (currentStatus === "offline") {
            responseMessage.innerText = "❌ Anketos šiuo metu uždarytos. Bandykite vėliau.";
            responseMessage.style.color = "red";
            return;
        }

        const username = document.getElementById("username").value.trim();
        const usernameNumber = Number(username);

        if (blacklist.includes(usernameNumber)) {
            responseMessage.innerText = "🚫 Jūs esate užblokuotas ir negalite pateikti anketos!";
            responseMessage.style.color = "red";
            return;
        }

        // ... rest of your form submission code ...
    });

    // --- Event Listeners ---
    statusButton.addEventListener("click", function() {
        const password = prompt("Enter admin password:");
        if (password === "987412365") { // Set your password here
            toggleStatus();
        } else {
            alert("Invalid password!");
        }
    });

    // Initial setup
    fetchStatus();
});
