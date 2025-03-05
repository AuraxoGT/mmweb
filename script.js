document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM fully loaded!");

    // JSONBin API (Replace with your own BIN)
    const JSONBIN_URL = "https://api.jsonbin.io/v3/b/67c851f6e41b4d34e4a1358b";
    const API_KEY = "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi.";

    const applicationsList = document.getElementById("applicationsList");

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

    // --- Fetch Pending Applications ---
    async function fetchApplications() {
        try {
            const response = await fetch(JSONBIN_URL, {
                headers: { "X-Master-Key": API_KEY }
            });
            const data = await response.json();

            console.log("📥 Applications Fetched:", data);

            const applications = data.record.applications || [];

            applicationsList.innerHTML = "";
            applications.forEach((app, index) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>👤 ${app.username}</strong> (Age: ${app.age})<br>
                    ✍️ Reason: ${app.reason}<br>
                    <button onclick="acceptApplication(${index})">✅ Accept</button>
                    <button onclick="denyApplication(${index})">❌ Deny</button>
                `;
                applicationsList.appendChild(li);
            });

        } catch (error) {
            console.error("❌ Error fetching applications:", error);
        }
    }

    // --- Accept Application ---
    async function acceptApplication(index) {
        if (!authenticateAdmin()) {
            requestPassword();
            return;
        }

        const response = confirm("✅ Accept this application?");
        if (!response) return;

        const applications = await getApplications();
        const acceptedUser = applications[index];

        // Remove from pending list
        applications.splice(index, 1);
        await updateApplications(applications);

        // Notify Discord
        sendWebhook(acceptedUser.username, "🎉 Your application has been **accepted**! Welcome to the community!");

        alert(`✅ ${acceptedUser.username} accepted!`);
        fetchApplications();
    }

    // --- Deny Application ---
    async function denyApplication(index) {
        if (!authenticateAdmin()) {
            requestPassword();
            return;
        }

        const response = confirm("❌ Deny this application?");
        if (!response) return;

        const applications = await getApplications();
        const deniedUser = applications[index];

        // Remove from pending list
        applications.splice(index, 1);
        await updateApplications(applications);

        // Notify Discord
        sendWebhook(deniedUser.username, "❌ Your application has been **denied**. You may try again later.");

        alert(`❌ ${deniedUser.username} denied.`);
        fetchApplications();
    }

    // --- Get Applications from JSONBin ---
    async function getApplications() {
        const response = await fetch(JSONBIN_URL, {
            headers: { "X-Master-Key": API_KEY }
        });
        const data = await response.json();
        return data.record.applications || [];
    }

    // --- Update Applications in JSONBin ---
    async function updateApplications(applications) {
        try {
            await fetch(JSONBIN_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY,
                },
                body: JSON.stringify({ applications })
            });

            console.log("✅ Applications updated successfully.");
        } catch (error) {
            console.error("❌ Error updating applications:", error);
        }
    }

    // --- Send Webhook to Discord ---
    function sendWebhook(username, message) {
        fetch("https://canary.discord.com/api/webhooks/1346529699081490472/k-O-v4wKDiUjsj1w-Achvrej1Kr-W-rXqZVibcftwWFn5sMZyhIMSb9E4r975HbQI3tF", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                embeds: [
                    {
                        title: "🔔 Application Update",
                        color: message.includes("accepted") ? 65280 : 16711680, // Green for accept, red for deny
                        description: `👤 <@${username}>\n\n${message}`,
                        timestamp: new Date().toISOString(),
                    }
                ]
            })
        });
    }

    // Load pending applications
    fetchApplications();
});
