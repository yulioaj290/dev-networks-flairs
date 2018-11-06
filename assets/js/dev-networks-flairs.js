/**
 * Created by yulio on 25/10/18.
 */
(function($, themes, c) {

    var API_GITHUB = "https://api.github.com/";
    var API_STACK_OVERFLOW = "https://api.stackexchange.com/";
    var profile = {};

    function buildFlairs() {
        var flair = $('[data-flair]');

        if (flair.length) {
            var network = "";
            flair.each(function() {
                network = $(this).attr("data-flair");

                var dataTheme = $(this).attr("data-theme");

                if (dataTheme !== undefined && dataTheme !== false && themes !== undefined) {
                    $(this).html("\n" + themes[dataTheme] + "\n");
                }
                var userid = getInput($(this));

                afterSetTheme($(this), network, userid);
            });
        }
    }

    function afterSetTheme(flairItem, network, userid) {
        if (!userid) {
            c("DEV NETWORKS FLAIRS [ERROR]: You must to provide a user id of " + network + ".");
        } else {
            getUser(network, userid).then(function (data) {
                getProfile(network, data);
                setProperties(flairItem);
            });
        }
    }

    function getInput(node) {
        // c(node.attr('data-user'));
        return node.attr('data-user');
    }

    function getUser(network, userid) {
        var url;

        if (network === "github") {
            url = API_GITHUB + 'users/' + userid;
        } else if (network === "stackoverflow") {
            url = API_STACK_OVERFLOW + '2.2/users/' + userid + "?order=desc&sort=reputation&site=stackoverflow&filter=!Lot_8zr6DBKY4h6OoYkbF*";
        }

        return $.get(url)
            .done(function() {
                c("DEV NETWORKS FLAIRS [INFO]: The " + network + " user id data was retrieved successfully.");
            })
            .fail(function() {
                c("DEV NETWORKS FLAIRS [ERROR]: The " + network + " user id is not valid or was not found.");
            });
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
        profile['badge-bronze'] = truncateNum(userData.badge_counts.bronze);
        profile['badge-silver'] = truncateNum(userData.badge_counts.silver);
        profile['badge-gold'] = truncateNum(userData.badge_counts.gold);
    }

    function setProperties(flairItem) {
        for (var property in profile) {
            if (profile.hasOwnProperty(property)) {
                flairItem.find('[data-property="' + property + '"]').each(function() {
                    if ($(this).text() == "") {
                        $(this).text($('<quote />').html(profile[property]).text());
                    }
                });

                setLink(flairItem, property, profile[property]);
            }
        }
    }

    function truncateNum(number) {
        var num = parseInt(number, 10);
        if (num < 1000) return num;
        return (num / 1000).toFixed(1) + 'k';
    }

    function setLink(flairItem, property, value) {
        flairItem.find('[data-property="' + property + '"]').each(function() {
            var link = $(this).attr("data-link");

            if (link === "link") {
                $(this).attr("href", value);
                $(this).text("");
            } else if (link === "text") {
                $(this).attr("href", value);
                $(this).text(value);
            } else if (link === "src") {
                $(this).attr("src", value);
                $(this).text("");
            } else if (profile[link] !== undefined) {
                $(this).attr("href", profile[link]);
            }
        });
    }

    window.buildFlairs = buildFlairs;

})(window.jQuery, window.flairThemes, console.log);

window.addEventListener("load", function(){
    window.buildFlairs();
});

// window.onload = function() {
// };