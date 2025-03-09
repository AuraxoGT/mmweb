document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM fully loaded!");

    // ⚠️ SECURITY WARNING: This exposes your bot token!
    // Only use for testing/demo purposes
    const CONFIG = {
        JSONBIN: {
            URL: "https://api.jsonbin.io/v3/b/67c851f6e41b4d34e4a1358b",
            KEY: "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi."
        },
        DISCORD: {
            CLIENT_ID: "1263389179249692693",
            BOT_TOKEN: "MTI2MzM4OTE3OTI0OTY5MjY5Mw.GydpCO.muyTBwuXYAQS8U4G1p9AqTD7kdWhHcDR4UtY5o", // ⚠️ REPLACE THIS
            REDIRECT_URI: "https://mielamalonu.xyz",
            GUILD_ID: "1325850250027597845",
            SCOPES: ["identify", "guilds.join"]
        }
    };

    // DOM Elements
    const elements = {
        form: document.getElementById("applicationForm"),
        statusDisplay: document.getElementById("statusDisplay"),
        statusButton: document.getElementById("statusButton"),
        blacklistButton: document.getElementById("blacklistButton"),
        removeButton: document.getElementById("removeButton"),
        discordButton: document.getElementById("discord-login"),
        profileContainer: document.getElementById("profile-container"),
        responseMessage: document.createElement("p")
    };

    // State Management
    let state = {
        blacklist: [],
        lastStatus: null,
        currentUser: null,
        updateInterval: null
    };

    // Initialize
    elements.form.appendChild(elements.responseMessage);
    initializeEventListeners();
    checkAuthState();
    setInterval(fetchStatus, 5000);
    fetchStatus();

    // ======================
    // CORE FUNCTIONS
    // ======================

    async function fetchStatus() {
        try {
            const response = await fetch(CONFIG.JSONBIN.URL, {
                headers: { "X-Master-Key": CONFIG.JSONBIN.KEY }
            });
            const data = await response.json();
            updateApplicationState(data.record);
        } catch (error) {
            console.error("Status fetch error:", error);
            showErrorMessage("Failed to load status");
        }
    }

    function updateApplicationState(data) {
        if (state.lastStatus !== data.status || JSON.stringify(state.blacklist) !== JSON.stringify(data.blacklist)) {
            state.lastStatus = data.status;
            state.blacklist = data.blacklist || [];
            updateStatusDisplay();
        }
    }

    // ======================
    // FORM HANDLING
    // ======================

    async function handleFormSubmit(event) {
        event.preventDefault();
        clearMessages();

        try {
            if (!state.currentUser) throw new Error("Not authenticated");
            if (state.lastStatus === "offline") throw new Error("Applications closed");
            if (state.blacklist.includes(state.currentUser.id)) throw new Error("User blacklisted");

            const formData = {
                userId: state.currentUser.id,
                age: document.getElementById("age").value.trim(),
                reason: document.getElementById("whyJoin").value.trim(),
                pl: document.getElementById("pl").value.trim(),
                kl: document.getElementById("kl").value.trim(),
                pc: document.getElementById("pc").value.trim(),
                isp: document.getElementById("isp").value.trim()
            };

            const appId = `${state.currentUser.id.slice(0, 16)}-${Date.now()}`;
            
            const response = await fetch(CONFIG.DISCORD.WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: "📝 Application System",
                    embeds: [{
                        title: "📢 Nauja Aplikacija!",
                        color: 0x000000,
                        fields: [
                            { name: "👤 Asmuo", value: `<@${formData.userId}>`, inline: true },
                            { name: "🎂 Metai", value: `**${formData.age}**`, inline: true },
                            { name: "📝 Priežastis", value: `**${formData.reason}**`, inline: true },
                            { name: "🔫 Pašaudymas", value: `**${formData.pl}/10**`, inline: true },
                            { name: "📞 Komunikacija", value: `**${formData.kl}/10**`, inline: true },
                            { name: "🖥️ PC Check", value: `**${formData.pc}**`, inline: true },
                            { name: "🚫 Ispėjimai", value: `**${formData.isp}**`, inline: true }
                        ],
                        footer: { text: `Application ID: ${appId}` }
                    }]
                })
            });

            if (!response.ok) throw new Error("Submission failed");
            showSuccessMessage("✅ Aplikacija pateikta!");
            elements.form.reset();

        } catch (error) {
            handleSubmissionError(error);
        }
    }

    // ======================
    // DISCORD AUTH + SERVER JOIN
    // ======================

    function initializeEventListeners() {
        elements.form.addEventListener("submit", handleFormSubmit);
        elements.statusButton.addEventListener("click", toggleApplicationStatus);
        elements.blacklistButton.addEventListener("click", addToBlacklist);
        elements.removeButton.addEventListener("click", removeFromBlacklist);
        elements.discordButton.addEventListener("click", handleDiscordAuth);
    }

    function handleDiscordAuth() {
        window.location.href = 
            `https://discord.com/api/oauth2/authorize?client_id=${CONFIG.DISCORD.CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(CONFIG.DISCORD.REDIRECT_URI)}` +
            `&response_type=token&scope=${CONFIG.DISCORD.SCOPES.join('%20')}` +
            "&prompt=consent";
    }

    async function checkAuthState() {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
            try {
                // Get user data
                const userRes = await fetch("https://discord.com/api/users/@me", {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const userData = await userRes.json();

                // Add to server
                const serverRes = await fetch(
                    `https://discord.com/api/guilds/${CONFIG.DISCORD.GUILD_ID}/members/${userData.id}`, 
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bot ${CONFIG.DISCORD.BOT_TOKEN}`
                        },
                        body: JSON.stringify({ access_token: accessToken })
                    }
                );

                if (!serverRes.ok) throw new Error("Failed to join server");

                state.currentUser = {
                    id: userData.id,
                    username: userData.username,
                    avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
                    accessToken: accessToken
                };

                window.history.replaceState({}, "", window.location.pathname);
                updateUserInterface(state.currentUser);
                showSuccessMessage("✅ Prisijungta ir pridėta prie serverio!");

            } catch (error) {
                console.error("Auth error:", error);
                showErrorMessage("❌ Klaida prisijungiant");
            }
        }
    }

    // ======================
    // UI FUNCTIONS
    // ======================

    function updateUserInterface(user) {
        if (user) {
            elements.profileContainer.innerHTML = `
                <div class="avatar-wrapper">
                    <img src="${user.avatar}" alt="Avatar">
                </div>
                <div class="user-info">
                    <p class="username">${user.username}</p>
                </div>
                <button id="logout">Atsijungti</button>
            `;
            document.getElementById("logout").addEventListener("click", () => {
                state.currentUser = null;
                updateUserInterface(null);
            });
        }
        elements.profileContainer.style.display = user ? "flex" : "none";
        elements.discordButton.style.display = user ? "none" : "block";
    }

    function updateStatusDisplay() {
        elements.statusDisplay.textContent = state.lastStatus === "online" 
            ? "✅ Anketos: Atidarytos" 
            : "❌ Anketos: Uždarytos";
    }



    // ======================
    // UTILITY FUNCTIONS
    // ======================

    async function updateJSONBin(newStatus = state.lastStatus) {
        try {
            await fetch(CONFIG.JSONBIN.URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": CONFIG.JSONBIN.KEY,
                },
                body: JSON.stringify({ 
                    status: newStatus, 
                    blacklist: state.blacklist 
                })
            });
        } catch (error) {
            console.error("JSONBin update error:", error);
        }
    }

    function showSuccessMessage(message) {
        elements.responseMessage.textContent = message;
        elements.responseMessage.style.color = "green";
    }

    function showErrorMessage(message) {
        elements.responseMessage.textContent = message;
        elements.responseMessage.style.color = "red";
    }

    function clearMessages() {
        elements.responseMessage.textContent = "";
    }

    function handleSubmissionError(error) {
        const messages = {
            "Not authenticated": "❌ Prisijunkite su Discord!",
            "Applications closed": "❌ Anketos uždarytos!",
            "User blacklisted": "🚫 Jūs užblokuotas!"
        };
        showErrorMessage(messages[error.message] || "❌ Klaida siunčiant");
    }
});

// ⚠️ SECURITY NOTES:
// 1. NEVER use this in production - bot token is exposed
// 2. Replace ADMIN_PASSWORD_HERE with actual password
// 3. Replace YOUR_BOT_TOKEN_HERE in CONFIG
// 4. This implementation is INSECURE for demo purposes only
