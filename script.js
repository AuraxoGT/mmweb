document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    const form = document.getElementById("applicationForm");
    const responseMessage = document.getElementById("responseMessage");
    const statusButton = document.getElementById("statusButton");
    const statusDisplay = document.getElementById("statusDisplay");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const age = document.getElementById("age").value.trim();
        const reason = document.getElementById("whyJoin").value.trim();
        const kl = document.getElementById("kl").value.trim();
        const pl = document.getElementById("pl").value.trim();
        const pc = document.getElementById("pc").value.trim();
        const isp = document.getElementById("isp").value.trim();

        console.log("✅ Submitted Data:", { username, age, reason });

        // Webhook URL - replace with your actual Discord webhook
        const webhookURL = "https://canary.discord.com/api/webhooks/1346529699081490472/k-O-v4wKDiUjsj1w-Achvrej1Kr-W-rXqZVibcftwWFn5sMZyhIMSb9E4r975HbQI3tF";

        const payload = {
            embeds: [
                {
                    title: "📢 Nauja Aplikacija!",
                    color: 000000, 
                    fields: [
                        { name: "👤 Asmuo", value: `<@${username}>`, inline: true },
                        { name: "🎂 Metai", value: `**${age}**`, inline: true },
                        { name: "📝 Dėl ko nori i gang?", value: `**${reason}**`, inline: true },
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

        fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                responseMessage.innerText = `✅ Aplikacija pateikta su jumis bus susisiekta discorde, ${username}!`;
                responseMessage.style.color = "green";
                form.reset();
            } else {
                throw new Error("Failed to send application.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            responseMessage.innerText = "❌ Nepavyko išsiūsti aplikacijos bandykite dar karta.";
            responseMessage.style.color = "red";
        });
    });

    // --- Admin Password Toggle ---
    const ADMIN_PASSWORD = "AuraxoGT123CivilisLTU";
    let status = false;

    function requestPassword() {
        const password = prompt("Enter admin password:");
        if (password === ADMIN_PASSWORD) {
            toggleStatus();
            localStorage.setItem("adminAuth", Date.now());
        } else {
            alert("Invalid password!");
        }
    }

    function toggleStatus() {
        status = !status;
        
        if (status) {
            statusDisplay.textContent = "Status: Online";
            statusDisplay.classList.add("status-online");
            statusDisplay.classList.remove("status-offline");
            statusButton.textContent = "🟢 Active Control";
        } else {
            statusDisplay.textContent = "Status: Offline";
            statusDisplay.classList.add("status-offline");
            statusDisplay.classList.remove("status-online");
            statusButton.textContent = "🔴 Status Control";
        }
    }

    statusButton.addEventListener("click", requestPassword);

    window.onload = function () {
        const authTime = localStorage.getItem("adminAuth");
        if (authTime && (Date.now() - authTime < 3600000)) { 
            toggleStatus();
        }
    };
});
