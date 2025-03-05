document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM fully loaded!");

    const form = document.getElementById("applicationForm");
    const responseMessage = document.createElement("p");
    form.appendChild(responseMessage);

    const statusButton = document.getElementById("statusButton");
    const statusDisplay = document.getElementById("statusDisplay");
    const blacklistButton = document.getElementById("blacklistButton");
    const removeButton = document.getElementById("removeButton");

    const JSONBIN_URL = "https://api.jsonbin.io/v3/b/67c851f6e41b4d34e4a1358b";
    const API_KEY = "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi.";

    let blacklist = [];
    let lastStatus = null;
    let lastBlacklist = "";

    // --- Fetch Status and Blacklist ---
    async function fetchStatus() {
        try {
            const response = await fetch(JSONBIN_URL, {
                headers: { "X-Master-Key": API_KEY }
            });
            const data = await response.json();

            console.log("✅ Fetched Data from JSONBin:", data);

            // Update UI only if changes detected
            if (lastStatus !== data.record.status || JSON.stringify(blacklist) !== JSON.stringify(data.record.blacklist)) {
                lastStatus = data.record.status;
                blacklist = data.record.blacklist || [];
                updateStatusUI(lastStatus);
                console.log("🔄 UI updated due to status/blacklist change");
            }
        } catch (error) {
            console.error("❌ Error fetching status:", error);
        }
    }

    function updateStatusUI(status) {
        if (status === "online") {
            statusDisplay.textContent = "✅ Anketos: Atidarytos";
            statusDisplay.classList.add("status-online");
            statusDisplay.classList.remove("status-offline");
        } else {
            statusDisplay.textContent = "❌ Anketos: Uždarytos";
            statusDisplay.classList.add("status-offline");
            statusDisplay.classList.remove("status-online");
        }
    }

    setInterval(fetchStatus, 5000);

    // --- Secure Admin Authentication ---
    const ADMIN_PASSWORD = "987412365";

    function authenticateAdmin() {
        return sessionStorage.getItem("adminAuth") === "true";
    }

    function requestPassword() {
        const password = prompt("🔑 Enter admin password:");
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem("adminAuth", "true");
            alert("✅ Authentication successful!");
        } else {
            alert("❌ Invalid password!");
        }
    }

    async function updateData(newStatus, newBlacklist) {
        try {
            await fetch(JSONBIN_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY,
                },
                body: JSON.stringify({ status: newStatus, blacklist: newBlacklist })
            });
            lastStatus = newStatus;
            lastBlacklist = JSON.stringify(newBlacklist);
            updateStatusUI(newStatus);
        } catch (error) {
            console.error("❌ Error updating data:", error);
            alert("❌ Failed to update status or blacklist.");
        }
    }

    async function toggleStatus() {
        if (!authenticateAdmin()) {
            requestPassword();
            return;
        }
        const newStatus = lastStatus === "offline" ? "online" : "offline";
        await updateData(newStatus, blacklist);
    }

    async function addToBlacklist() {
        if (!authenticateAdmin()) {
            requestPassword();
            return;
        }
        const newId = prompt("🚫 Enter User ID to blacklist:");
        if (!newId || blacklist.includes(newId)) {
            alert("⚠️ Invalid or duplicate User ID.");
            return;
        }
        blacklist.push(newId);
        await updateData(lastStatus, blacklist);
    }

    async function removeFromBlacklist() {
        if (!authenticateAdmin()) {
            requestPassword();
            return;
        }
        const idToRemove = prompt("❌ Enter User ID to remove:");
        if (!idToRemove || !blacklist.includes(idToRemove)) {
            alert("⚠️ User ID not found in blacklist.");
            return;
        }
        blacklist = blacklist.filter(id => id !== idToRemove);
        await updateData(lastStatus, blacklist);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (lastStatus === "offline") {
            responseMessage.innerText = "❌ Anketos šiuo metu uždarytos.";
            responseMessage.style.color = "red";
            return;
        }

        const username = document.getElementById("username").value.trim();
        if (blacklist.includes(username)) {
            responseMessage.innerText = "🚫 Jūs esate užblokuotas.";
            responseMessage.style.color = "red";
            return;
        }

        console.log("✅ Form submitted with username:", username);

        responseMessage.innerText = `✅ Aplikacija pateikta!`;
        responseMessage.style.color = "green";
        form.reset();
    });

    statusButton.addEventListener("click", toggleStatus);
    blacklistButton.addEventListener("click", addToBlacklist);
    removeButton.addEventListener("click", removeFromBlacklist);

    fetchStatus();
});
