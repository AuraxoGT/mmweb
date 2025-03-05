document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM fully loaded!");

    // JSONBin.io API URL
    const JSONBIN_URL = "YOUR_JSONBIN_URL_HERE";  // Replace with your actual JSONBin link
    const API_KEY = "YOUR_JSONBIN_API_KEY_HERE";  // Replace with your JSONBin API key

    const applicationsList = document.getElementById("applicationsList"); // Make sure this ID exists in HTML

    if (!applicationsList) {
        console.error("❌ Element #applicationsList not found in the HTML!");
        return; // Stop execution if the element is missing
    }

    // --- Fetch and Display Applications ---
    async function fetchApplications() {
        try {
            const response = await fetch(JSONBIN_URL, {
                headers: { "X-Master-Key": API_KEY }
            });
            const data = await response.json();

            console.log("✅ Fetched Applications:", data);

            if (!data.record || !Array.isArray(data.record.applications)) {
                console.error("❌ No applications found in response!");
                applicationsList.innerHTML = "<p>⚠️ No applications available.</p>";
                return;
            }

            applicationsList.innerHTML = data.record.applications.map(app => `
                <div class="application">
                    <p><strong>👤 User:</strong> ${app.username}</p>
                    <p><strong>📢 Status:</strong> ${app.status}</p>
                    <button onclick="acceptApplication('${app.username}')">✅ Accept</button>
                    <button onclick="denyApplication('${app.username}')">❌ Deny</button>
                </div>
                <hr>
            `).join("");
        } catch (error) {
            console.error("❌ Error fetching applications:", error);
            applicationsList.innerHTML = "<p>⚠️ Failed to load applications.</p>";
        }
    }

    // --- Accept or Deny Applications ---
    async function updateApplicationStatus(username, newStatus) {
        try {
            const response = await fetch(JSONBIN_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY,
                },
                body: JSON.stringify({ status: newStatus, username: username })
            });

            if (!response.ok) throw new Error("Failed to update application status");

            alert(`✅ User ${username} has been marked as ${newStatus}!`);
            fetchApplications(); // Refresh the list
        } catch (error) {
            console.error("❌ Error updating application status:", error);
        }
    }

    // Accept function
    window.acceptApplication = function(username) {
        updateApplicationStatus(username, "accepted");
    };

    // Deny function
    window.denyApplication = function(username) {
        updateApplicationStatus(username, "denied");
    };

    // --- Load applications on page load ---
    fetchApplications();
});
