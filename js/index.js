document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = searchInput.value;
        searchUsers(username);
    });

    function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayUsers(data.items);
            reposList.innerHTML = ''; // Clear repo list when new search is made
        })
        .catch(error => console.error('Error searching users:', error));
    }

    function displayUsers(users) {
        userList.innerHTML = ''; // Clear previous results
        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}'s avatar" style="height: 50px; width: 50px;">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
                <button onclick="fetchRepos('${user.login}')">Show Repos</button>
            `;
            userList.appendChild(li);
        });
    }

    window.fetchRepos = function(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(repos => displayRepos(repos))
        .catch(error => console.error('Error fetching repos:', error));
    };

    function displayRepos(repos) {
        reposList.innerHTML = ''; // Clear previous repo results
        repos.forEach(repo => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            reposList.appendChild(li);
        });
    }
});