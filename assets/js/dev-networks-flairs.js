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
                getUser(flairItem, network, userid);
            }
        }

        function getInput(node) {
            // c(node.getAttribute('data-user'));
            return node.getAttribute("data-user");
        }

        function getUser(flairItem, network, userid) {
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

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        c(
                            "DEV NETWORKS FLAIRS [INFO]: The " +
                                network +
                                " user id data was retrieved successfully."
                        );
                        var data = JSON.parse(xhr.responseText);
                        getProfile(network, data);
                        setProperties(flairItem);
                    } else {
                        c(
                            "DEV NETWORKS FLAIRS [ERROR]: The " +
                                network +
                                " user id is not valid or was not found."
                        );
                        return false;
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        }

        function getProfile(network, userData) {
            profile = {};

            if (network === "github") {
                getProfileGithub(userData);
            } else if (network === "stackoverflow") {
                userData = userData.items[0];
                getProfileStackof(userData);
            }
        }

        function getProfileGithub(userData) {
            profile.username = userData.login;
            profile.fullname = userData.name;
            profile.avatar = userData.avatar_url;
            profile.url = userData.html_url;
            profile.company = userData.company;
            profile.location = userData.location;
            profile.website = userData.blog;
            profile.repos = truncateNum(userData.public_repos);
            profile.gists = truncateNum(userData.public_gists);
            profile.followers = truncateNum(userData.followers);
            profile.hireable = truncateNum(userData.hireable);
            profile.bio = truncateNum(userData.bio);
        }

        function getProfileStackof(userData) {
            profile.userid = userData.user_id;
            profile.fullname = userData.display_name;
            profile.avatar = userData.profile_image;
            profile.url = userData.link;
            profile.location = userData.location;
            profile.website = userData.website_url;
            profile.reputation = truncateNum(userData.reputation);
            profile.answers = truncateNum(userData.answer_count);
            profile.questions = truncateNum(userData.question_count);
            profile["badge-bronze"] = truncateNum(userData.badge_counts.bronze);
            profile["badge-silver"] = truncateNum(userData.badge_counts.silver);
            profile["badge-gold"] = truncateNum(userData.badge_counts.gold);
        }

        function setProperties(flairItem) {
            for (var property in profile) {
                if (profile.hasOwnProperty(property)) {
                    flairItem
                        .querySelectorAll('[data-property="' + property + '"]')
                        .forEach(function(itemProperty) {
                            if (itemProperty.textContent == "") {
                                var el = document.createElement("quote");
                                el.innerHTML = profile[property];
                                itemProperty.textContent = el.textContent;
                            }
                        });

                    setLink(flairItem, property, profile[property]);
                }
            }
        }

        function truncateNum(number) {
            var num = parseInt(number, 10);
            if (num < 1000) return num;
            return (num / 1000).toFixed(1) + "k";
        }

        function setLink(flairItem, property, value) {
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
                    } else if (profile[link] !== undefined) {
                        itemProperty.setAttribute("href", profile[link]);
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
