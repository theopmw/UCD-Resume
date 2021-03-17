function userInformationHTML(user) {
    return `
        <h2>${user.name} 
            <span class="small-name">
                (@ <a href="${user.html_url}" target="_blank" rel="noopener">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url} target="_blank" rel="noopener">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} <br> Following: ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
}

function repoInformationHTML(repos) {
    if (repos.length === 0) {
        // Returns "No repos!" message if the user has 0 repos:
        return `<div class="clearfix repo-list">No repos!</div>` 
    }

    let listItemsHTML = repos.map(function(repo){ // The map method works like a forEach but it returns an array with the results of this function
        // The contents of the array that we want to return are: 
        // an <li> list item 
        // inside the list item an <a> anchor tag that will take us to the actual repo when we click on it ({repo.html_url})
        // the text inside the <a> tag that is displayed to the user will be the repo name ({repo.name})
        return `<li> 
                    <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
                </li>`;
    });
    // Returns list of repos if user has 1 or more repos:
    // <ul> will be the parent for all the list items created above
    // As the map function used above returns an array, we use the join method (${listItemsHTML.join("\n")}) on the listItemsHTML array and join everything with a new line ("\n") - this stops us havinf to iterate through the new array once again.
    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`

}

function fetchGitHubInformation(event) {

    let username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
        return;
    }
    
    $("#gh-user-data").html(
        `<div id="loader"> 
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

    $.when (
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then (
        function (firstResponse, secondResponse) {
            let userData = firstResponse[0];
            let repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        }, function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(
                    `<h2> no information forund for ${username}</h2>`);
            } else {
                console.log(errorResponse);
                $("gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
    })
}