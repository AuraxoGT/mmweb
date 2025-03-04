document.getElementById("applicationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get values from the form
    const username = document.getElementById("username").value;
    const age = document.getElementById("age").value;
    const whyJoin = document.getElementById("whyJoin").value;
    const multiplayer = document.querySelector('input[name="multiplayer"]:checked')?.value || "Not selected";
    const discordActive = document.querySelector('input[name="discordActive"]:checked')?.value || "Not selected";
    const favoriteGame = document.getElementById("favoriteGame").value;
    const platform = document.getElementById("platform").value;

    // Validate that required fields are filled
    if (!username || !age || !whyJoin || !favoriteGame || !platform) {
        document.getElementById("responseMessage").innerText = "❌ Please fill out all required fields.";
        return;
    }

    // Create the payload to send to the webhook
    const payload = {
        content: `📩 **New Application Received** 📩\n\n` +
                 `👤 **Username:** ${username}\n` +
                 `🎂 **Age:** ${age}\n` +
                 `📝 **Reason to Join:** ${whyJoin}\n` +
                 `🎮 **Multiplayer Games Preference:** ${multiplayer}\n` +
                 `🔧 **Discord Active:** ${discordActive}\n` +
                 `🎮 **Favorite Game:** ${favoriteGame}\n` +
                 `🖥️ **Platform:** ${platform}`
    };

    // Send the data to the Discord webhook
    fetch("https://canary.discord.com/api/webhooks/1346529699081490472/k-O-v4wKDiUjsj1w-Achvrej1Kr-W-rXqZVibcftwWFn5sMZyhIMSb9E4r975HbQI3tF", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("responseMessage").innerText = "✅ Application sent successfully!";
            document.getElementById("applicationForm").reset();
        } else {
            document.getElementById("responseMessage").innerText = "❌ Error sending application.";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("responseMessage").innerText = "❌ Error sending application.";
    });
});
