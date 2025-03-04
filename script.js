document.getElementById("applicationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const webhookURL = "YOUR_DISCORD_WEBHOOK_URL_HERE"; // Replace with your actual Discord webhook URL

    const username = document.getElementById("username").value;
    const age = document.getElementById("age").value;
    const whyJoin = document.getElementById("whyJoin").value;

    const payload = {
        content: `📩 **New Application Received** 📩\n\n👤 **Username:** ${username}\n🎂 **Age:** ${age}\n📝 **Reason to Join:** ${whyJoin}`
    };

    fetch(webhookURL, {
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
