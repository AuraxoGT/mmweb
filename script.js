document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    const form = document.getElementById("applicationForm");
    const responseMessage = document.getElementById("responseMessage");

    if (!form) {
        console.error("Form not found!");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents page refresh

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

        // Simulate sending data to a server (replace with actual API call)
        responseMessage.innerText = `Thank you, ${username}! Your application has been received.`;

        // Reset form after submission
        form.reset();
    });
});
