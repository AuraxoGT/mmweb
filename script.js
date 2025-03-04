document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    console.log("Checking input fields...");
    console.log("Username:", document.getElementById("username"));
    console.log("Age:", document.getElementById("age"));
    console.log("Why Join:", document.getElementById("whyJoin"));

    const form = document.getElementById("applicationForm");
    if (!form) {
        console.error("❌ Form not found!");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const usernameInput = document.getElementById("username");
        const ageInput = document.getElementById("age");
        const reasonInput = document.getElementById("whyJoin");

        if (!usernameInput || !ageInput || !reasonInput) {
            console.error("❌ One or more input fields not found!");
            return;
        }

        const username = usernameInput.value.trim();
        const age = ageInput.value.trim();
        const reason = reasonInput.value.trim();

        console.log("✅ Submitted Data:", { username, age, reason });
    });
});
