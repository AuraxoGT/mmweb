// admin.js - Admin Panel with JSONBin API

const JSONBIN_API_KEY = "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi.";
const JSONBIN_BLACKLIST_ID = "67c851f6e41b4d34e4a1358b";

// Function to fetch data from JSONBin
async function fetchFromJsonBin(binId) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
            headers: {
                "X-Master-Key": JSONBIN_API_KEY
            }
        });
        const data = await response.json();
        console.log("📥 Fetched data:", data.record);
        return data.record;
    } catch (error) {
        console.error("❌ Error fetching from JSONBin:", error);
        return { status: "offline", blacklist: [] };
    }
}

// Function to update JSONBin
 async function toggleApplicationStatus() {
        if (!authenticateAdmin()) return;
        const newStatus = state.lastStatus === "online" ? "offline" : "online";
        await updateJSONBin(newStatus);
        updateStatusDisplay();
    }

    async function addToBlacklist() {
        if (!authenticateAdmin()) return;
        const newId = prompt("Įveskite vartotojo ID:");
        if (newId && !state.blacklist.includes(newId)) {
            state.blacklist.push(newId);
            await updateJSONBin();
            alert(`✅ Vartotojas ${newId} užblokuotas`);
        }
    }

    async function removeFromBlacklist() {
        if (!authenticateAdmin()) return;
        const idToRemove = prompt("Įveskite vartotojo ID:");
        if (idToRemove && state.blacklist.includes(idToRemove)) {
            state.blacklist = state.blacklist.filter(id => id !== idToRemove);
            await updateJSONBin();
            alert(`✅ Vartotojas ${idToRemove} atblokuotas`);
        }
    }

    function authenticateAdmin() {
        const password = prompt("🔑 Admin slaptažodis:");
        if (password === "ADMIN_PASSWORD_HERE") return true;
        alert("❌ Neteisingas slaptažodis!");
        return false;
    }

});
