document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM fully loaded!");

    // Get elements
    const form = document.getElementById("applicationForm");
    const responseMessage = document.createElement("p");
    form.appendChild(responseMessage);

    const statusButton = document.getElementById("statusButton");
    const statusDisplay = document.getElementById("statusDisplay");

    // JSONBin.io API URL
    const JSONBIN_URL = "https://api.jsonbin.io/v3/b/67c851f6e41b4d34e4a1358b"; 
    const API_KEY = "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi."; 

    // Global variable for storing blacklist
    let blacklist = [];

    // --- Fetch Status and Blacklist from JSONBin ---
    async function fetchStatus() {
        try {
            const response = await fetch(JSONBIN_URL, {
                headers: { "X-Master-Key": "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi." }
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

        // Debugging: Log the username to check if it's correct
        console.log("Username to check:", username);

        // 🛑 Check if user is blacklisted (by username)
        if (blacklist.some(entry => entry.toString().includes(usernameInput))) { // Check if 'username' is in the blacklist
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

    // Add event listener to toggle button
    statusButton.addEventListener("click", toggleStatus);

    // --- Set Status on Page Load ---
    fetchStatus();
});
