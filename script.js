document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM fully loaded!");

    // Get elements
    const form = document.getElementById("applicationForm");
    const responseMessage = document.createElement("p");
    form.appendChild(responseMessage);

    const statusButton = document.getElementById("statusButton");
    const statusDisplay = document.getElementById("statusDisplay");

    // Create Blacklist Button and Input
    const blacklistContainer = document.createElement("div");
    blacklistContainer.style.marginTop = "10px";
    
    const blacklistButton = document.createElement("button");
    blacklistButton.textContent = "🚫 Add to Blacklist";
    blacklistButton.style.display = "block";
    blacklistButton.style.marginTop = "10px";
    blacklistButton.style.padding = "5px";
    
    const blacklistInput = document.createElement("input");
    blacklistInput.type = "text";
    blacklistInput.placeholder = "Enter User ID";
    blacklistInput.style.display = "block";
    blacklistInput.style.marginTop = "5px";
    blacklistInput.style.padding = "5px";

    blacklistContainer.appendChild(blacklistInput);
    blacklistContainer.appendChild(blacklistButton);
    form.appendChild(blacklistContainer);

    // JSONBin.io API URL
    const JSONBIN_URL = "https://api.jsonbin.io/v3/b/67c851f6e41b4d34e4a1358b"; 
    const API_KEY = "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi."; 

    // Global variable for storing blacklist
    let blacklist = [];

    // --- Fetch Status and Blacklist from JSONBin ---
    async function fetchStatus() {
        try {
            const response = await fetch(JSONBIN_URL, {
                headers: { "X-Master-Key": API_KEY }
            });
            const data = await response.json();

            // Log the fetched blacklist and status
            console.log("✅ Fetched Data from JSONBin:", data);
            updateStatusUI(data.record.status);
            blacklist = data.record.blacklist || []; // Store blacklist globally

            // Debugging: Log the blacklist
            console.log("Blacklist fetched:", blacklist);
        } catch (error) {
            console.error("❌ Error fetching status:", error);
        }
    }

    // --- Update Status UI ---
    function updateStatusUI(status) {
        if (status === "online") {
            statusDisplay.textContent = "✅ Anketos: Atidarytos";
            statusDisplay.classList.add("status-online");
            statusDisplay.classList.remove("status-offline");
            statusButton.textContent = "🟢 Active Control";
        } else {
            statusDisplay.textContent = "❌ Anketos: Uždarytos";
            statusDisplay.classList.add("status-offline");
            statusDisplay.classList.remove("status-online");
            statusButton.textContent = "🔴 Status Control";
        }
    }

    // --- Admin Authentication ---
    const ADMIN_PASSWORD = "987412365"; 

    function requestPassword() {
        const password = prompt("🔑 Enter admin password:");
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem("adminAuth", "true"); 
            alert("✅ Authentication successful! You can now manage settings.");
        } else {
            alert("❌ Invalid password!");
        }
    }

    // --- Add to Blacklist Function ---
    async function addToBlacklist() {
        const isAuthenticated = sessionStorage.getItem("adminAuth") === "true";

        if (!isAuthenticated) {
            requestPassword();
            return;
        }

        const newId = blacklistInput.value.trim();
        if (!newId) {
            alert("⚠️ Please enter a valid User ID.");
            return;
        }

        if (blacklist.includes(newId)) {
            alert(`⚠️ User ID "${newId}" is already in the blacklist.`);
            return;
        }

        blacklist.push(newId); // Add new ID to the array

        try {
            await fetch(JSONBIN_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY,
                },
                body: JSON.stringify({ status: "online", blacklist: blacklist }) // Update JSONBin
            });

            alert(`✅ User ID "${newId}" has been added to the blacklist.`);
            blacklistInput.value = ""; // Clear input field
        } catch (error) {
            console.error("❌ Error updating blacklist:", error);
            alert("❌ Failed to update blacklist.");
        }
    }

    // --- Toggle Status and Save to JSONBin ---
    async function toggleStatus() {
        const isAuthenticated = sessionStorage.getItem("adminAuth") === "true";

        if (!isAuthenticated) {
            requestPassword();
            return;
        }

        const newStatus = statusDisplay.textContent.includes("Uždarytos") ? "online" : "offline";

        try {
            await fetch(JSONBIN_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY,
                },
                body: JSON.stringify({ status: newStatus, blacklist: blacklist })
            });

            updateStatusUI(newStatus);
        } catch (error) {
            console.error("❌ Error updating status:", error);
        }
    }

    // Add event listeners
    statusButton.addEventListener("click", toggleStatus);
    blacklistButton.addEventListener("click", addToBlacklist);

    // --- Set Status on Page Load ---
    fetchStatus();
});
