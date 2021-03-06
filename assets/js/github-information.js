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

    let listItemsHTML = repos.map(function (repo) { // The map method works like a forEach but it returns an array with the results of this function
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
    $("#gh-user-data").html(""); // sets the #gh-user-data div to an empty string
    $("#gh-repo-data").html(""); // sets the #gh-repo-data div to an empty string

    let username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h4>Please enter a GitHub username</h4>`);
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader"> 
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function (firstResponse, secondResponse) {
            let userData = firstResponse[0];
            let repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        }, function (errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(
                    `<h2> no information forund for ${username}</h2>`);
            } else if (errorResponse.status === 403) {
                let resetTime = new Date(errorResponse.getResponseHeader("X-RateLimit-Reset")*1000) // Retrieves header supplied by GitHub that lets us know when our API call limit will be reset, when you can use the API again and sets it in date from (it is initially presented as a unix timestamp)
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleDateString()} to make another</h4>`) // Use JQuery to target the gh-user-data element, then set the HTML content of this element to an error message
            } else {
                console.log(errorResponse);
                $("gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        })
}

$(document).ready(fetchGitHubInformation); // Displays theopmw profile when the page is loaded instead of just having an empty <div>
// To do this, use the document.ready() function in JQuery and execute the fetchGitHubInformation() function when the DOM is fully loaded