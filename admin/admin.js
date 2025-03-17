document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ Admin panel loaded!");

    const CONFIG = {
        SUPABASE: {
            URL: "https://smodsdsnswwtnbnmzhse.supabase.co/rest/v1/IC",
            API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtb2RzZHNuc3d3dG5ibm16aHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MjUyOTAsImV4cCI6MjA1NzIwMTI5MH0.zMdjymIaGU66_y6X-fS8nKnrWgJjXgw7NgXPBIzVCiI" // Replace with your actual API key
        }
    };

    // Get elements
    const fetchDataButton = document.getElementById("fetchSupabaseData");
    const dataContainer = document.getElementById("data-container");

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

            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            dataContainer.innerHTML = "<h3>📜 Supabase Data:</h3>";

            data.forEach(item => {
                dataContainer.innerHTML += `<p>${JSON.stringify(item)}</p>`;
            });

        } catch (error) {
            console.error("Error fetching Supabase data:", error);
            dataContainer.innerHTML = "<p style='color:red;'>⚠️ Error fetching data!</p>";
        }
    });
});
