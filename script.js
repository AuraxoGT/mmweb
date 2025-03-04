document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    const form = document.getElementById("applicationForm");
    const responseMessage = document.getElementById("responseMessage");

    if (!form) {
        console.error("Form not found!");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Stops normal form submission

        const username = document.getElementById("username").value.trim();
        const age = document.getElementById("age").value.trim();
        const reason = document.getElementById("whyJoin").value.trim(); // FIXED

        console.log("Submitted Data:", { username, age, reason });

        // Webhook URL - replace with your actual Discord webhook
        const webhookURL = "https://canary.discord.com/api/webhooks/1346529699081490472/k-O-v4wKDiUjsj1w-Achvrej1Kr-W-rXqZVibcftwWFn5sMZyhIMSb9E4r975HbQI3tF";

        // Construct the embed object
        const payload = {
            embeds: [
                {
                    title: "📢 New Application Received!",
                    color: 0x3498db, // Blue color
                    fields: [
                        { name: "👤 Username", value: username, inline: true },
                        { name: "🎂 Age", value: age, inline: true },
                        { name: "📝 Reason", value: reason, inline: false }
                    ],
                    footer: {
                        text: "Application Bot",
                        icon_url: "https://cdn-icons-png.flaticon.com/512/295/295128.png"
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
                responseMessage.innerText = `✅ Application sent successfully, ${username}!`;
                responseMessage.style.color = "green";
                form.reset();
            } else {
                throw new Error("Failed to send application.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            responseMessage.innerText = "❌ Failed to send application. Please try again.";
            responseMessage.style.color = "red";
        });
    });
});
