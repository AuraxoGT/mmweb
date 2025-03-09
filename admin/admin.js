// admin.js - Admin Panel with JSONBin API

const JSONBIN_API_KEY = "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi.";
const JSONBIN_BLACKLIST_ID = "67c851f6e41b4d34e4a1358b";

// Function to fetch data from JSONBin
async function fetchFromJsonBin(binId) {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: {
            "X-Master-Key": JSONBIN_API_KEY
        }
    });
    const data = await response.json();
    return data.record;
}

// Function to update JSONBin
async function updateJsonBin(binId, newData) {
    await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": JSONBIN_API_KEY
        },
        body: JSON.stringify(newData)
    });
}

// Close Applications Button
document.getElementById("closeApplications").addEventListener("click", async function() {
    await updateJsonBin(JSONBIN_BLACKIST_ID, { applicationsClosed: true });
    alert("Anketos uždarytos!");
});

// Add to Blacklist Button
document.getElementById("addBlacklist").addEventListener("click", async function() {
    let user = prompt("Įveskite vartotojo vardą, kurį norite pridėti į Blacklist:");
    if (user) {
        let blacklist = await fetchFromJsonBin(JSONBIN_BLACKLIST_ID);
        if (!blacklist.includes(user)) {
            blacklist.push(user);
            await updateJsonBin(JSONBIN_BLACKLIST_ID, blacklist);
            alert(`${user} pridėtas į Blacklist.`);
        } else {
            alert("Šis vartotojas jau yra Blacklist'e!");
        }
    }
});

// Remove from Blacklist Button
document.getElementById("removeBlacklist").addEventListener("click", async function() {
    let user = prompt("Įveskite vartotojo vardą, kurį norite pašalinti iš Blacklist:");
    if (user) {
        let blacklist = await fetchFromJsonBin(JSONBIN_BLACKLIST_ID);
        let index = blacklist.indexOf(user);
        if (index !== -1) {
            blacklist.splice(index, 1);
            await updateJsonBin(JSONBIN_BLACKLIST_ID, blacklist);
            alert(`${user} pašalintas iš Blacklist.`);
        } else {
            alert("Šio vartotojo nėra Blacklist'e!");
        }
    }
});
