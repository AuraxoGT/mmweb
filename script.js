document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    const form = document.getElementById("applicationForm");
    const responseMessage = document.getElementById("responseMessage");

    console.log("Checking input fields...");
    console.log("Username:", document.getElementById("username"));
    console.log("Age:", document.getElementById("age"));
    console.log("Why Join:", document.getElementById("whyJoin"));

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const usernameInput = document.getElementById("username");
        const ageInput = document.getElementById("age");
        const reasonInput = document.getElementById("whyJoin");
        const plInput = document.getElementById("pl");
const klInput = document.getElementById("kl");
const pcInput = document.getElementById("pc");
const ispInput = document.getElementById("isp");
        const username = usernameInput.value.trim();
        const age = ageInput.value.trim();
        const reason = reasonInput.value.trim();
        const kl = klInput.value.trim();
const pl = plInput.value.trim();
const pc = pcInput.value.trim();
const isp = ispInput.value.trim();
        console.log("✅ Submitted Data:", { username, age, reason });

        // Webhook URL - replace with your actual Discord webhook
        const webhookURL = "https://canary.discord.com/api/webhooks/1346529699081490472/k-O-v4wKDiUjsj1w-Achvrej1Kr-W-rXqZVibcftwWFn5sMZyhIMSb9E4r975HbQI3tF";

        // Construct the embed object
        const payload = {
            embeds: [
                {
                    title: "📢 Nauja Aplikacija!",
                    color: 000000, // Blue color
                    
                    
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
                    "name" : "Miela Malonu",
                    "icon_url" : "https://cdn.discordapp.com/attachments/1340789491564281917/1340794719076356116/1739740774386.gif?ex=67c81723&is=67c6c5a3&hm=6e04afca43899cf0a05c048386972c8f3f6ccc2ae53f40fc9ecfb37886149356&"
},
                    footer: {
                        text: "Anketos | Miela Malonu",
                        icon_url: "https://cdn.discordapp.com/attachments/1340789491564281917/1340794719076356116/1739740774386.gif?ex=67c81723&is=67c6c5a3&hm=6e04afca43899cf0a05c048386972c8f3f6ccc2ae53f40fc9ecfb37886149356&"
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

// Set your secret password here (change 'YOUR_PASSWORD' to your actual password)
const ADMIN_PASSWORD = 'YOUR_PASSWORD';
let status = false;

function requestPassword() {
    const password = prompt('Enter admin password:');
    if(password === ADMIN_PASSWORD) {
        toggleStatus();
        // Store authentication for 1 hour (optional)
        localStorage.setItem('adminAuth', Date.now());
    } else {
        alert('Invalid password!');
    }
}

function toggleStatus() {
    status = !status;
    const statusDisplay = document.getElementById('statusDisplay');
    const statusButton = document.getElementById('statusButton');
    
    if(status) {
        statusDisplay.textContent = 'Status: Online';
        statusDisplay.classList.add('status-online');
        statusDisplay.classList.remove('status-offline');
        statusButton.textContent = '🟢 Active Control';
    } else {
        statusDisplay.textContent = 'Status: Offline';
        statusDisplay.classList.add('status-offline');
        statusDisplay.classList.remove('status-online');
        statusButton.textContent = '🔴 Status Control';
    }
}

// Check existing authentication on page load
window.onload = function() {
    const authTime = localStorage.getItem('adminAuth');
    if(authTime && (Date.now() - authTime < 3600000)) { // 1 hour validity
        toggleStatus();
    }
}
        });
    });
});
