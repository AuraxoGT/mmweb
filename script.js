// --- Form Submission ---
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const currentStatus = statusDisplay.textContent.includes("Uždarytos") ? "offline" : "online";
    if (currentStatus === "offline") {
        responseMessage.innerText = "❌ Anketos šiuo metu uždarytos. Bandykite vėliau.";
        responseMessage.style.color = "red";
        return;
    }

    const username = document.getElementById("username").value.trim(); // Use 'username' as the user ID

    // 🛑 Check if user is blacklisted (by username)
    if (blacklist.includes(username)) { // Check if 'username' is in the blacklist
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
