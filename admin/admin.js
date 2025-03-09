document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ Admin panel loaded!");

    const CONFIG = {
        JSONBIN: {
            URL: "https://api.jsonbin.io/v3/b/67c851f6e41b4d34e4a1358b",
            KEY: "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi."
        }
    };

    const elements = {
        statusButton: document.getElementById("statusButton"),
        blacklistButton: document.getElementById("blacklistButton"),
        removeButton: document.getElementById("removeButton")
    };

    let state = {
        blacklist: []
    };

    initializeEventListeners();

    function initializeEventListeners() {
        elements.statusButton.addEventListener("click", toggleApplicationStatus);
        elements.blacklistButton.addEventListener("click", addToBlacklist);
        elements.removeButton.addEventListener("click", removeFromBlacklist);
    }

    async function toggleApplicationStatus() {
        if (!authenticateAdmin()) return;
        const response = await fetch(CONFIG.JSONBIN.URL, {
            headers: { "X-Master-Key": CONFIG.JSONBIN.KEY }
        });
        const data = await response.json();
        const newStatus = data.record.status === "online" ? "offline" : "online";
        await updateJSONBin(newStatus);
        alert(`✅ Anketos ${newStatus === "online" ? "atidarytos" : "uždarytos"}`);
    }

    async function addToBlacklist() {
        if (!authenticateAdmin()) return;
        const newId = prompt("Įveskite vartotojo ID:");
        if (newId) {
            const response = await fetch(CONFIG.JSONBIN.URL, {
                headers: { "X-Master-Key": CONFIG.JSONBIN.KEY }
            });
            const data = await response.json();
            state.blacklist = data.record.blacklist || [];
            if (!state.blacklist.includes(newId)) {
                state.blacklist.push(newId);
                await updateJSONBin();
                alert(`✅ Vartotojas ${newId} užblokuotas`);
            }
        }
    }

    async function removeFromBlacklist() {
        if (!authenticateAdmin()) return;
        const idToRemove = prompt("Įveskite vartotojo ID:");
        if (idToRemove) {
            const response = await fetch(CONFIG.JSONBIN.URL, {
                headers: { "X-Master-Key": CONFIG.JSONBIN.KEY }
            });
            const data = await response.json();
            state.blacklist = data.record.blacklist || [];
            if (state.blacklist.includes(idToRemove)) {
                state.blacklist = state.blacklist.filter(id => id !== idToRemove);
                await updateJSONBin();
                alert(`✅ Vartotojas ${idToRemove} atblokuotas`);
            }
        }
    }

    function authenticateAdmin() {
        const password = prompt("🔑 Admin slaptažodis:");
        if (password === "ADMIN_PASSWORD_HERE") return true;
        alert("❌ Neteisingas slaptažodis!");
        return false;
    }

    async function updateJSONBin(newStatus = null) {
        try {
            const response = await fetch(CONFIG.JSONBIN.URL, {
                headers: { "X-Master-Key": CONFIG.JSONBIN.KEY }
            });
            const data = await response.json();
            const updatedData = {
                status: newStatus !== null ? newStatus : data.record.status,
                blacklist: state.blacklist
            };
            await fetch(CONFIG.JSONBIN.URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": CONFIG.JSONBIN.KEY,
                },
                body: JSON.stringify(updatedData)
            });
        } catch (error) {
            console.error("JSONBin update error:", error);
        }
    }
});
