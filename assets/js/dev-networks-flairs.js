/**
 * Created by yulio on 25/10/18.
 */
function domFlairReady(themes, c) {
    return function() {
        var API_GITHUB = "https://api.github.com/";
        var API_STACK_OVERFLOW = "https://api.stackexchange.com/";
        var profile = {};

        function buildFlairs() {
            var flair = document.querySelectorAll("[data-flair]");

            if (flair.length) {
                var network = "";
                flair.forEach(function(flairItem) {
                    network = flairItem.getAttribute("data-flair");

                    var dataTheme = flairItem.getAttribute("data-theme");

                    if (
                        dataTheme !== undefined &&
                        dataTheme !== null &&
                        dataTheme !== false &&
                        themes !== undefined &&
                        themes !== null
                    ) {
                        flairItem.innerHTML = "\n" + themes[dataTheme] + "\n";
                    }
                    var userid = getInput(flairItem);

                    afterSetTheme(flairItem, network, userid);
                });
            }
        }

        function afterSetTheme(flairItem, network, userid) {
            if (!userid) {
                c(
                    "DEV NETWORKS FLAIRS [ERROR]: You must to provide a user id of " +
                        network +
                        "."
                );
            } else {
                var userPromise = new Promise(function(resolve, reject) {
                    getUser(network, userid, function(response) {
                        if (response.status !== 0) {
                            // if response is not error
                            // c(response.message);
                            resolve();
                        } else {
                            c(response.message);
                            reject();
                        }
                    });
                });

                // first execute main profile data Promise
                userPromise.then(function() {
                    // execute derivated or dependant Promises
                    var listPromises = [];
                    listPromises.push(
                        new Promise(function(resolve, reject) {
                            getGitHubUserRepos(network, userid, function(
                                response
                            ) {
                                if (response.status !== 0) {
                                    // if response is not error
                                    // c(response.message);
                                    resolve();
                                } else {
                                    c(response.message);
                                    reject();
                                }
                            });
                        })
                    );

                    Promise.all(listPromises).then(function() {
                        // execute when all promises are fulfilled
                        setProperties(flairItem);
                    });
                });
            }
        }

        function getInput(flairItem) {
            // c(flairItem.getAttribute('data-user'));
            return flairItem.getAttribute("data-user");
        }

        function getUser(network, userid, callback) {
            var url;

            if (network === "github") {
                url = API_GITHUB + "users/" + userid;
            } else if (network === "stackoverflow") {
                url =
                    API_STACK_OVERFLOW +
                    "2.2/users/" +
                    userid +
                    "?order=desc&sort=reputation&site=stackoverflow&filter=!Lot_8zr6DBKY4h6OoYkbF*";
            }

            var successMessage =
                "DEV NETWORKS FLAIRS [INFO]: The " +
                network +
                " user id data was retrieved successfully.";

            var failedMessage =
                "DEV NETWORKS FLAIRS [ERROR]: The " +
                network +
                " user id is not valid or was not found.";

            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText);
                        getUserProfile(network, data);
                        // execute callback when success
                        callback({ status: 1, message: successMessage });
                    } else {
                        // execute callback when failed
                        callback({ status: 0, message: failedMessage });
                    }
                }
            });

            xhr.addEventListener("error", function() {
                // a listener which executes when the xhr request fails
                // execute callback when failed
                callback({ status: 0, message: failedMessage });
            });

            xhr.open("GET", url, true);
            xhr.send();
        }

        function getGitHubUserRepos(network, userid, callback) {
            if (network === "github") {
                var url = API_GITHUB + "users/" + userid + "/repos";
                var xhr = new XMLHttpRequest();

                var successMessage =
                    "DEV NETWORKS FLAIRS [INFO]: The github user repos data was retrieved successfully.";

                var failedMessage =
                    "DEV NETWORKS FLAIRS [ERROR]: The githb user repos data was not found.";

                xhr.addEventListener("load", function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            // Getting repos from github for the username
                            var repos = JSON.parse(xhr.responseText);

                            var reposData = {
                                repos: repos.length,
                                forks: 0,
                                sources: 0
                            };

                            if (repos.length > 0) {
                                repos.forEach(function(itemRepo) {
                                    reposData.forks += itemRepo.fork ? 1 : 0;
                                });
                            }
                            reposData.sources =
                                reposData.repos - reposData.forks;

                            getUserProfileGHRepos(userid, reposData);
                            // execute callback when success
                            callback({ status: 1, message: successMessage });
                        } else {
                            // execute callback when failed
                            callback({ status: 0, message: failedMessage });
                        }
                    }
                });

                xhr.addEventListener("error", function() {
                    // a listener which executes when the xhr request fails
                    // execute callback when failed
                    callback({ status: 0, message: failedMessage });
                });
                xhr.open("GET", url, true);
                xhr.send();
            } else {
                // if not github then execute callback success
                callback({ status: 1, message: successMessage });
            }
        }

        function getUserProfile(network, userData) {
            if (network === "github") {
                getProfileGithub(userData);
            } else if (network === "stackoverflow") {
                userData = userData.items[0];
                getProfileStackof(userData);
            }
        }

        function getProfileGithub(userData) {
            profile[userData.login] = {};

            profile[userData.login].username = userData.login;
            profile[userData.login].fullname = userData.name;
            profile[userData.login].avatar = userData.avatar_url;
            profile[userData.login].url = userData.html_url;
            profile[userData.login].company = userData.company;
            profile[userData.login].location = userData.location;
            profile[userData.login].website = userData.blog;
            profile[userData.login].repos = truncateNum(userData.public_repos);
            profile[userData.login].gists = truncateNum(userData.public_gists);
            profile[userData.login].followers = truncateNum(userData.followers);
            profile[userData.login].hireable = userData.hireable ? "YES" : "NO";
            profile[userData.login].bio = userData.bio;
        }

        function getUserProfileGHRepos(username, reposData) {
            profile[username].forks = truncateNum(reposData.forks);
            profile[username].sources = truncateNum(reposData.sources);
        }

        function getProfileStackof(userData) {
            profile[userData.user_id] = {};

            profile[userData.user_id].userid = userData.user_id;
            profile[userData.user_id].fullname = userData.display_name;
            profile[userData.user_id].avatar = userData.profile_image;
            profile[userData.user_id].url = userData.link;
            profile[userData.user_id].location = userData.location;
            profile[userData.user_id].website = userData.website_url;
            profile[userData.user_id].reputation = truncateNum(
                userData.reputation
            );
            profile[userData.user_id].answers = truncateNum(
                userData.answer_count
            );
            profile[userData.user_id].questions = truncateNum(
                userData.question_count
            );
            profile[userData.user_id]["badge-bronze"] = truncateNum(
                userData.badge_counts.bronze
            );
            profile[userData.user_id]["badge-silver"] = truncateNum(
                userData.badge_counts.silver
            );
            profile[userData.user_id]["badge-gold"] = truncateNum(
                userData.badge_counts.gold
            );
        }

        function setProperties(flairItem) {
            var userid = flairItem.getAttribute("data-user");

            for (var property in profile[userid]) {
                // c(property + ": " + profile[userid][property]);
                if (profile[userid].hasOwnProperty(property)) {
                    flairItem
                        .querySelectorAll('[data-property="' + property + '"]')
                        .forEach(function(itemProperty) {
                            if (itemProperty.textContent == "") {
                                var el = document.createElement("quote");
                                el.innerHTML = profile[userid][property];
                                itemProperty.textContent = el.textContent;
                            }
                        });

                    setLink(flairItem, property, profile[userid][property]);
                }
            }
        }

        function truncateNum(number) {
            var num = parseInt(number, 10);
            if (num < 1000) return num;
            return (num / 1000).toFixed(1) + "k";
        }

        function setLink(flairItem, property, value) {
            var userid = flairItem.getAttribute("data-user");
            flairItem
                .querySelectorAll('[data-property="' + property + '"]')
                .forEach(function(itemProperty) {
                    var link = itemProperty.getAttribute("data-link");

                    if (link === "link") {
                        itemProperty.setAttribute("href", value);
                        itemProperty.textContent = "";
                    } else if (link === "text") {
                        itemProperty.setAttribute("href", value);
                        itemProperty.textContent = value;
                    } else if (link === "src") {
                        itemProperty.setAttribute("src", value);
                        itemProperty.textContent = "";
                    } else if (profile[userid][link] !== undefined) {
                        itemProperty.setAttribute("href", profile[userid][link]);
                    }
                });
        }

        window.buildFlairs = buildFlairs;
    };
}

if (document.readyState !== "loading") {
    domFlairReady(window.flairThemes, console.log);
} else {
    document.addEventListener(
        "DOMContentLoaded",
        domFlairReady(window.flairThemes, console.log)
    );
}

window.addEventListener("load", function() {
    window.buildFlairs();
});
