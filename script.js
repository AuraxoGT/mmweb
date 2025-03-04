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

        const username = usernameInput.value.trim();
        const age = ageInput.value.trim();
        const reason = reasonInput.value.trim();

        // Validate the inputs to ensure they're not empty
        if (!username || !age || !reason) {
            responseMessage.innerText = "❌ All fields are required!";
            responseMessage.style.color = "red";
            return;
        }

        console.log("Submitted Data:", { username, age, reason });

        // Show loading message
        responseMessage.innerText = "⏳ Sending your application...";
        responseMessage.style.color = "orange";

        // Webhook URL - replace with your actual Discord webhook
        const webhookURL = "https://canary.discord.com/api/webhooks/1346529699081490472/k-O-v4wKDiUjsj1w-Achvrej1Kr-W-rXqZVibcftwWFn5sMZyhIMSb9E4r975HbQI3tF";

        const embed = {
            title: "New Application Received!",
            description: `A new application has been submitted.`,
            color: 5814783, // You can choose any color for the embed (Hexadecimal color code)
            fields: [
                {
                    name: "Username",
                    value: username,
                    inline: true
                },
                {
                    name: "Age",
                    value: age,
                    inline: true
                },
                {
                    name: "Reason",
                    value: reason,
                    inline: false
                }
            ],
            footer: {
                text: "Submitted via Website",
                icon_url: "https://example.com/icon.png" // You can put your own footer icon URL if desired
            }
        };

        const payload = {
            embeds: [embed] // Sending the embed as the payload
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
