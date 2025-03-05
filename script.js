document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM fully loaded!");

    // Get elements
    const form = document.getElementById("applicationForm");
    const responseMessage = document.createElement("p"); // Create response message dynamically
    form.appendChild(responseMessage);

    const statusButton = document.getElementById("statusButton");
    const statusDisplay = document.getElementById("statusDisplay");
    const statusContainer = document.getElementById("statusContainer"); // New container for status

    // JSONBin.io API URL
    const JSONBIN_URL = "https://api.jsonbin.io/v3/b/67c851f6e41b4d34e4a1358b";
    const API_KEY = "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi.";

    // --- Fetch Status from JSONBin ---
    async function fetchStatus() {
        try {
            const response = await fetch(JSONBIN_URL, {
                headers: { "X-Master-Key": API_KEY }
            });
            const data = await response.json();
            updateStatusUI(data.record.status);
        } catch (error) {
            console.error("❌ Error fetching status:", error);
        }
    }

    // --- Update Status UI ---
    function updateStatusUI(status) {
        if (status === "online") {
            statusDisplay.textContent = "Anketos: Atidarytos";
            statusDisplay.classList.add("status-online");
            statusDisplay.classList.remove("status-offline");
            statusButton.textContent = "🟢 Active Control";
        } else {
            statusDisplay.textContent = "Anketos: Uždarytos";
            statusDisplay.classList.add("status-offline");
            statusDisplay.classList.remove("status-online");
            statusButton.textContent = "🔴 Status Control";
        }

        // Move status below "Reikalavimai"
        const requirementsSection = document.getElementById("requirements");
        requirementsSection.appendChild(statusContainer);
    }

    // --- Admin Authentication ---
    const ADMIN_PASSWORD = "987412365";

    function requestPassword() {
        const password = prompt("🔑 Enter admin password:");
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem("adminAuth", "true"); 
            alert("✅ Authentication successful! You can now toggle status.");
        } else {
            alert("❌ Invalid password!");
        }
    }

    // --- Toggle Status and Save to JSONBin ---
    async function toggleStatus() {
        const isAuthenticated = sessionStorage.getItem("adminAuth") === "true";

        if (!isAuthenticated) {
            requestPassword(); // Prompt for password if not authenticated
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
                body: JSON.stringify({ status: newStatus })
            });

            updateStatusUI(newStatus);
        } catch (error) {
            console.error("❌ Error updating status:", error);
        }
    }

    // Add event listener to toggle button
    statusButton.addEventListener("click", toggleStatus);

    // --- Set Status on Page Load ---
    fetchStatus();
});
