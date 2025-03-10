document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ System Initialized");

    // Supabase Client
    const supabase = createSupabaseClient();
    let currentUser = null;

    // DOM Elements
    const elements = {
        form: document.getElementById("applicationForm"),
        statusDisplay: document.getElementById("statusDisplay"),
        discordButton: document.getElementById("discord-login"),
        profileContainer: document.getElementById("profile-container"),
        adminSection: document.getElementById("admin-section")
    };

    // Initialize
    checkAuthState();
    setupEventListeners();

    // ======================
    // SUPABASE CLIENT SETUP
    // ======================
    function createSupabaseClient() {
        return createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY
        );
    }

    // ======================
    // AUTHENTICATION SYSTEM
    // ======================
    async function checkAuthState() {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (user) {
            currentUser = {
                id: user.id,
                username: user.user_metadata.full_name,
                avatar: user.user_metadata.avatar_url
            };
            updateUI();
            checkAdminStatus();
        }
    }

    async function handleDiscordLogin() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: window.location.origin
            }
        });
    }

    async function logout() {
        await supabase.auth.signOut();
        currentUser = null;
        updateUI();
    }

    // ======================
    // FORM HANDLING SYSTEM
    // ======================
    async function handleFormSubmit(e) {
        e.preventDefault();
        showLoadingState(true);

        const formData = {
            age: parseInt(elements.form.querySelector("#age").value),
            reason: elements.form.querySelector("#whyJoin").value.trim(),
            pl: parseInt(elements.form.querySelector("#pl").value),
            kl: parseInt(elements.form.querySelector("#kl").value),
            pc: elements.form.querySelector("#pc").value.trim(),
            isp: elements.form.querySelector("#isp").value.trim()
        };

        try {
            // Check application status
            const { data: status } = await supabase
                .from('config')
                .select('value')
                .eq('key', 'applications_open')
                .single();

            if (!status?.value) throw new Error("Applications are currently closed");

            // Submit to database
            const { error } = await supabase
                .from('applications')
                .insert([{ ...formData, user_id: currentUser.id }]);

            if (error) throw error;

            showSuccessMessage("✅ Application submitted successfully!");
            elements.form.reset();
        } catch (error) {
            showErrorMessage(`❌ Error: ${error.message}`);
        } finally {
            showLoadingState(false);
        }
    }

    // ======================
    // ADMIN FUNCTIONALITY
    // ======================
    async function checkAdminStatus() {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data, error } = await supabase.rpc('is_admin', {
            user_id: user.id
        });

        if (data) {
            elements.adminSection.style.display = 'block';
            loadApplications();
        }
    }

    async function loadApplications() {
        const { data, error } = await supabase
            .from('applications')
            .select(`
                id,
                created_at,
                age,
                reason,
                pl,
                kl,
                pc,
                isp,
                profiles:user_id (username, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (!error) renderApplicationsTable(data);
    }

    // ======================
    // UI MANAGEMENT
    // ======================
    function updateUI() {
        if (currentUser) {
            elements.profileContainer.innerHTML = `
                <div class="user-info">
                    <img src="${currentUser.avatar}" alt="Avatar" class="avatar">
                    <span>${currentUser.username}</span>
                </div>
                <button class="logout-btn">Logout</button>
            `;
            elements.profileContainer.querySelector('.logout-btn').addEventListener('click', logout);
            elements.discordButton.style.display = 'none';
        } else {
            elements.profileContainer.innerHTML = '';
            elements.discordButton.style.display = 'block';
        }
    }

    function renderApplicationsTable(applications) {
        const tbody = elements.adminSection.querySelector('tbody');
        tbody.innerHTML = applications.map(app => `
            <tr>
                <td>${new Date(app.created_at).toLocaleDateString()}</td>
                <td>
                    <img src="${app.profiles.avatar_url}" 
                         alt="${app.profiles.username}" 
                         class="user-avatar">
                    ${app.profiles.username}
                </td>
                <td>${app.age}</td>
                <td>${app.reason}</td>
                <td>${app.pl}/10</td>
                <td>${app.kl}/10</td>
                <td>${app.pc}</td>
                <td>${app.isp}</td>
            </tr>
        `).join('');
    }

    // ======================
    // UTILITIES
    // ======================
    function setupEventListeners() {
        elements.form.addEventListener('submit', handleFormSubmit);
        elements.discordButton.addEventListener('click', handleDiscordLogin);
    }

    function showLoadingState(show) {
        elements.form.querySelector('button[type="submit"]').disabled = show;
    }

    function showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert success';
        alert.textContent = message;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }

    function showErrorMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert error';
        alert.textContent = message;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }
});
