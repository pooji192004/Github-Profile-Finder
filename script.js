// Search on Enter key press
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchUser();
});

async function searchUser() {
    const username = document.getElementById('searchInput').value.trim();

    // Clear previous results
    hideAll();

    if (!username) return;

    try {
        // Fetch user profile
        const userRes = await fetch(`https://api.github.com/users/${username}`);

        if (!userRes.ok) {
            showError('User not found! Please check the username.');
            return;
        }

        const user = await userRes.json();

        // Fetch repositories
        const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`);
        const repos = await repoRes.json();

        displayProfile(user, repos);

    } catch (error) {
        showError('Something went wrong. Please try again.');
    }
}

function displayProfile(user, repos) {
    // Profile info
    document.getElementById('avatar').src = user.avatar_url;
    document.getElementById('name').textContent = user.name || user.login;
    document.getElementById('login').textContent = user.login;
    document.getElementById('bio').textContent = user.bio || 'No bio available';
    document.getElementById('profileLink').href = user.html_url;

    // Stats
    document.getElementById('followers').textContent = user.followers;
    document.getElementById('following').textContent = user.following;
    document.getElementById('repos').textContent = user.public_repos;

    // Extra info
    const location = document.getElementById('location');
    const company = document.getElementById('company');
    const blog = document.getElementById('blog');
    const joined = document.getElementById('joined');

    location.innerHTML = user.location ? `<i class="fas fa-map-marker-alt"></i> ${user.location}` : '';
    company.innerHTML = user.company ? `<i class="fas fa-building"></i> ${user.company}` : '';
    blog.innerHTML = user.blog ? `<i class="fas fa-link"></i> <a href="${user.blog}" target="_blank">${user.blog}</a>` : '';

    const date = new Date(user.created_at);
    joined.innerHTML = `<i class="fas fa-calendar-alt"></i> Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

    // Repositories
    const reposList = document.getElementById('reposList');
    reposList.innerHTML = '';

    if (repos.length === 0) {
        reposList.innerHTML = '<p style="color:#8b949e">No public repositories found.</p>';
    } else {
        repos.forEach(repo => {
            reposList.innerHTML += `
                <div class="repo-card">
                    <a href="${repo.html_url}" target="_blank">
                        <i class="fas fa-book"></i> ${repo.name}
                    </a>
                    <p>${repo.description || 'No description'}</p>
                    <div class="repo-meta">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        ${repo.language ? `<span><i class="fas fa-circle" style="color:#58a6ff;font-size:0.6rem"></i> ${repo.language}</span>` : ''}
                    </div>
                </div>
            `;
        });
    }

    document.getElementById('profileCard').classList.add('show');
}

function showError(msg) {
    document.getElementById('errorMsg').textContent = msg;
    document.getElementById('error').classList.add('show');
}

function hideAll() {
    document.getElementById('error').classList.remove('show');
    document.getElementById('profileCard').classList.remove('show');
}