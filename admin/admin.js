document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ Admin panel loaded!");

    const CONFIG = {
        SUPABASE: {
            URL: "https://smodsdsnswwtnbnmzhse.supabase.co/rest/v1/IC",
            API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtb2RzZHNuc3d3dG5ibm16aHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MjUyOTAsImV4cCI6MjA1NzIwMTI5MH0.zMdjymIaGU66_y6X-fS8nKnrWgJjXgw7NgXPBIzVCiI" // Replace with your actual Supabase API key
        },
        ADMIN_PASSWORD: "admin123" // Change this to your desired password
    };

    const dataTableBody = document.querySelector("#data-table tbody");

    // Ask for password before loading the page
    async function authenticateUser() {
        const userPassword = prompt("🔒 Enter Admin Password:");

        if (userPassword === CONFIG.ADMIN_PASSWORD) {
            console.log("✅ Password correct, loading data...");
            await fetchSupabaseData();
        } else {
            alert("❌ Incorrect password! Reloading...");
            location.reload(); // Refresh the page if wrong password
        }
    }

    // Fetch Supabase Data
    async function fetchSupabaseData() {
        try {
            const response = await fetch(CONFIG.SUPABASE.URL, {
                method: "GET",
                headers: {
                    "apikey": CONFIG.SUPABASE.API_KEY,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("⚠️ Failed to fetch data");

            const data = await response.json();
            dataTableBody.innerHTML = ""; // Clear existing data

            // Populate table rows
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.USERIS}</td>
                    <td>${item.VARDAS}</td>
                    <td>${item.PAVARDĖ}</td>
                    <td>${item["STEAM NICKAS"]}</td>
                    <td><a href="${item["STEAM LINKAS"]}" target="_blank">🔗 Steam Profilis</a></td>
                `;
                dataTableBody.appendChild(row);
            });

        } catch (error) {
            console.error("❌ Error fetching Supabase data:", error);
            alert("⚠️ Unable to fetch data from Supabase.");
        }
    }

    // Call authentication on page load
    authenticateUser();
});
