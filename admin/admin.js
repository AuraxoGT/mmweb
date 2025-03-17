document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Admin panel loaded!");

    const CONFIG = {
        SUPABASE: {
            URL: "https://smodsdsnswwtnbnmzhse.supabase.co/rest/v1/IC",
            API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtb2RzZHNuc3d3dG5ibm16aHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MjUyOTAsImV4cCI6MjA1NzIwMTI5MH0.zMdjymIaGU66_y6X-fS8nKnrWgJjXgw7NgXPBIzVCiI" // Replace with your actual Supabase API key
        }
    };

    // Get elements
    const fetchDataButton = document.getElementById("fetchSupabaseData");
    const dataTableBody = document.querySelector("#data-table tbody");

    // Fetch Supabase Data
    fetchDataButton.addEventListener("click", async function () {
        try {
            const response = await fetch(CONFIG.SUPABASE.URL, {
                method: "GET",
                headers: {
                    "apikey": CONFIG.SUPABASE.API_KEY,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("⚠️ Nepavyko gauti duomenų!");

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
            console.error("❌ Klaida gaunant duomenis:", error);
            alert("⚠️ Nepavyko gauti Supabase duomenų!");
        }
    });
});
