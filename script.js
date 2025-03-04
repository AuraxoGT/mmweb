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

        const usernameInput = document.getElementById("username");
        const ageInput = document.getElementById("age");
        const reasonInput = document.getElementById("reason");

        if (!usernameInput || !ageInput || !reasonInput) {
            console.error("One or more input fields not found!");
            return;
        }

        const username = usernameInput.value;
        const age = ageInput.value;
        const reason = reasonInput.value;

        console.log("Submitted Data:", { username, age, reason });

        // Webhook URL - replace with your actual Discord webhook
        const webhookURL = "https://canary.discord.com/api/webhooks/1346529699081490472/k-O-v4wKDiUjsj1w-Achvrej1Kr-W-rXqZVibcftwWFn5sMZyhIMSb9E4r975HbQI3tF";

        const payload = {
            content: 📢 **New Application Received!**\n👤 **Username:** ${username}\n🎂 **Age:** ${age}\n📝 **Reason:** ${reason}
        };

        fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                responseMessage.innerText = ✅ Application sent successfully, ${username}!;
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
