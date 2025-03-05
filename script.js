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

    // Global variable for storing blacklist and status
    let blacklist = [];
    let lastStatus = null;  // Store last known status

    // --- Fetch Status and Blacklist from JSONBin ---
    async function fetchStatus() {
        try {
            const response = await fetch(JSONBIN_URL, {
                headers: { "X-Master-Key": API_KEY }
            });
            const data = await response.json();

            console.log("✅ Fetched Data from JSONBin:", data);

            // If status changed, trigger page reload
            if (lastStatus !== data.record.status) {
                lastStatus = data.record.status;
                location.reload(); // Reload the page when the status changes
            }

            updateStatusUI(data.record.status);
            blacklist = data.record.blacklist || [];

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

    // --- Periodic Status Check ---
    setInterval(fetchStatus, 5000); // Check every 5 seconds

    // --- Admin Authentication ---
    const ADMIN_PASSWORD = "987412365";

    // Function to authenticate admin
    function authenticateAdmin() {
        return sessionStorage.getItem("adminAuth") === "true";  // Check session storage for admin status
    }

    // Function to request password (for new sessions or when unauthenticated)
    function requestPassword() {
        const password = prompt("🔑 Enter admin password:");
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem("adminAuth", "true");  // Store admin auth in session
            alert("✅ Authentication successful! You can now toggle status and manage blacklist.");
        } else {
            alert("❌ Invalid password!");
        }
    }

    // --- Add to Blacklist ---
    async function addToBlacklist() {
        if (!authenticateAdmin()) {
            requestPassword(); // Prompt for password if not authenticated
            return;
        }

        const newId = prompt("🚫 Enter User ID to blacklist:");
        if (!newId) {
            alert("⚠️ Please enter a valid User ID.");
            return;
        }

        if (blacklist.includes(newId)) {
            alert(`⚠️ User ID "${newId}" is already in the blacklist.`);
            return;
        }

        blacklist.push(newId);

        try {
            await fetch(JSONBIN_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY,
                },
                body: JSON.stringify({ status: "online", blacklist: blacklist })
            });

            alert(`✅ User ID "${newId}" has been added to the blacklist.`);
        } catch (error) {
            console.error("❌ Error updating blacklist:", error);
            alert("❌ Failed to update blacklist.");
        }
    }

    // --- Remove from Blacklist ---
    async function removeFromBlacklist() {
        if (!authenticateAdmin()) {
            requestPassword(); // Prompt for password if not authenticated
            return;
        }

        const idToRemove = prompt("❌ Enter User ID to remove from blacklist:");
        if (!idToRemove) {
            alert("⚠️ Please enter a valid User ID.");
            return;
        }

        if (!blacklist.includes(idToRemove)) {
            alert(`⚠️ User ID "${idToRemove}" is not in the blacklist.`);
            return;
        }

        blacklist = blacklist.filter(id => id !== idToRemove);

        try {
            await fetch(JSONBIN_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY,
                },
                body: JSON.stringify({ status: "online", blacklist: blacklist })
            });

            alert(`✅ User ID "${idToRemove}" has been removed from the blacklist.`);
        } catch (error) {
            console.error("❌ Error updating blacklist:", error);
            alert("❌ Failed to update blacklist.");
        }
    }

    // --- Toggle Status ---
    async function toggleStatus() {
        if (!authenticateAdmin()) {
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
                body: JSON.stringify({ status: newStatus, blacklist: blacklist })
            });

            updateStatusUI(newStatus);
        } catch (error) {
            console.error("❌ Error updating status:", error);
        }
    }

    // --- Form Submission ---
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const currentStatus = statusDisplay.textContent.includes("Uždarytos") ? "offline" : "online";
        if (currentStatus === "offline") {
            responseMessage.innerText = "❌ Anketos šiuo metu uždarytos. Bandykite vėliau.";
            responseMessage.style.color = "red";
            return;
        }

        const username = document.getElementById("username").value.trim(); // User ID (username)
        const usernameNumber = username
        // Debugging: Log the username to check if it's correct
        console.log("Username to check:", username);

        // 🛑 Check if user is blacklisted (by username)
        if (Array.isArray(blacklist) && blacklist.includes(usernameNumber)) { // Check if 'username' is in the blacklist
            responseMessage.innerText = "🚫 Jūs esate užblokuotas ir negalite pateikti anketos!";
            responseMessage.style.color = "red";
            return;
        }

        const age = document.getElementById("age").value.trim();
        const reason = document.getElementById("whyJoin").value.trim();
        const pl = document.getElementById("pl").value.trim();
        const kl = document.getElementById("kl").value.trim();
        const pc = document.getElementById("pc").value.trim();
        const isp = document.getElementById("isp").value.trim();

        console.log("✅ Form submitted with data:", { username, age, reason, pl, kl, pc, isp });

        const payload = {
            embeds: [
                {
                    title: "📢 Nauja Aplikacija!",
                    color: 16711680,
                    fields: [
                        { name: "👤 Asmuo", value: `<@${username}>`, inline: true }, // Use username in the embed
                        { name: "🎂 Metai", value: `**${age}**`, inline: true },
                        { name: "📝 Kodėl nori prisijungti?", value: `**${reason}**`, inline: true },
                        { name: "🔫 Pašaudymo lygis", value: `**${pl} / 10**`, inline: true },
                        { name: "📞 Komunikacijos lygis", value: `**${kl} / 10**`, inline: true },
                        { name: "🖥️ PC Check", value: `**${pc}**`, inline: true },
                        { name: "🚫 Ispėjimo išpirkimas", value: `**${isp}**`, inline: true },
                    ],
                    author: {
                        name: "Miela Malonu",
                        icon_url: "https://cdn.discordapp.com/attachments/1340789491564281917/1340794719076356116/1739740774386.gif"
                    },
                    footer: {
                        text: "Anketos | Miela Malonu",
                        icon_url: "https://cdn.discordapp.com/attachments/1340789491564281917/1340794719076356116/1739740774386.gif"
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        fetch("https://canary.discord.com/api/webhooks/1346529699081490472/k-O-v4wKDiUjsj1w-Achvrej1Kr-W-rXqZVibcftwWFn5sMZyhIMSb9E4r975HbQI3tF", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                responseMessage.innerText = `✅ Aplikacija pateikta! Su jumis bus susisiekta per Discord, ${username}.`;
                responseMessage.style.color = "green";
                form.reset();
            } else {
                throw new Error("❌ Failed to send application.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            responseMessage.innerText = "❌ Nepavyko išsiųsti aplikacijos. Bandykite dar kartą.";
            responseMessage.style.color = "red";
        });
    });

    // Add event listeners
    statusButton.addEventListener("click", toggleStatus);
    blacklistButton.addEventListener("click", addToBlacklist);
    removeButton.addEventListener("click", removeFromBlacklist);

    // --- Set Status on Page Load ---
    fetchStatus();
});
