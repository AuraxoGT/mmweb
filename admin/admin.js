// auth.js - Admin Authentication
window.onload = function() {
    const storedPass = localStorage.getItem("adminPass");
    const correctPass = "admin123"; // Change this to your secure password
    
    if (!storedPass || storedPass !== correctPass) {
        let pass = prompt("Įveskite administratoriaus slaptažodį:");
        if (pass === correctPass) {
            localStorage.setItem("adminPass", pass);
            document.getElementById("adminPanel").style.display = "block";
        } else {
            alert("Neteisingas slaptažodis!");
            window.location.href = "/"; // Redirect if incorrect
        }
    } else {
        document.getElementById("adminPanel").style.display = "block";
    }
};

// script.js - Admin Panel Functions
document.getElementById("closeApplications").addEventListener("click", function() {
    localStorage.setItem("applicationsClosed", "true");
    alert("Anketos uždarytos!");
});

document.getElementById("addBlacklist").addEventListener("click", function() {
    let user = prompt("Įveskite vartotojo vardą, kurį norite pridėti į Blacklist:");
    if (user) {
        let blacklist = JSON.parse(localStorage.getItem("blacklist")) || [];
        if (!blacklist.includes(user)) {
            blacklist.push(user);
            localStorage.setItem("blacklist", JSON.stringify(blacklist));
            alert(`${user} pridėtas į Blacklist.`);
        } else {
            alert("Šis vartotojas jau yra Blacklist'e!");
        }
    }
});

document.getElementById("removeBlacklist").addEventListener("click", function() {
    let user = prompt("Įveskite vartotojo vardą, kurį norite pašalinti iš Blacklist:");
    if (user) {
        let blacklist = JSON.parse(localStorage.getItem("blacklist")) || [];
        let index = blacklist.indexOf(user);
        if (index !== -1) {
            blacklist.splice(index, 1);
            localStorage.setItem("blacklist", JSON.stringify(blacklist));
            alert(`${user} pašalintas iš Blacklist.`);
        } else {
            alert("Šio vartotojo nėra Blacklist'e!");
        }
    }
});
