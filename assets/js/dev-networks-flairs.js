/**
 * Created by yulio on 25/10/18.
 */
(function($, themes, c) {

    var API_GITHUB = "https://api.github.com/";
    var API_STACK_OVERFLOW = "https://api.stackexchange.com/";
    var profile = {};

    var githubTmpData = {
        "login": "yulioaj290",
        "id": 15785234,
        "node_id": "MDQ6VXNlcjE1Nzg1MjM0",
        "avatar_url": "test-assets/profile.jpg",
        "gravatar_id": "",
        "url": "https://api.github.com/users/yulioaj290",
        "html_url": "https://github.com/yulioaj290",
        "followers_url": "https://api.github.com/users/yulioaj290/followers",
        "following_url": "https://api.github.com/users/yulioaj290/following{/other_user}",
        "gists_url": "https://api.github.com/users/yulioaj290/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/yulioaj290/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/yulioaj290/subscriptions",
        "organizations_url": "https://api.github.com/users/yulioaj290/orgs",
        "repos_url": "https://api.github.com/users/yulioaj290/repos",
        "events_url": "https://api.github.com/users/yulioaj290/events{/privacy}",
        "received_events_url": "https://api.github.com/users/yulioaj290/received_events",
        "type": "User",
        "site_admin": false,
        "name": "Yulio Aleman Jimenez",
        "company": "University of Informatics Sciences",
        "blog": "https://yulioaj290.github.io",
        "location": "Havana, Cuba",
        "email": null,
        "hireable": true,
        "bio": "Computer science engineer and full-stack web developer specialized in PHP and JavaScript, looking for challenge opportunities to grow career.",
        "public_repos": 16,
        "public_gists": 1,
        "followers": 0,
        "following": 2,
        "created_at": "2015-11-10T14:57:26Z",
        "updated_at": "2018-10-22T16:59:23Z"
    };

    var stackofTmpData = {
        "items": [{
            "badge_counts": {
                "bronze": 19,
                "silver": 5,
                "gold": 0
            },
            "view_count": 133,
            "answer_count": 44,
            "question_count": 7,
            "account_id": 8105646,
            "is_employee": false,
            "last_modified_date": 1540220638,
            "last_access_date": 1540314638,
            "reputation": 676,
            "creation_date": 1458783157,
            "user_type": "registered",
            "user_id": 6107280,
            "accept_rate": 100,
            "location": "Havana, Cuba",
            "website_url": "http://yulioaj290.github.io",
            "link": "https://stackoverflow.com/users/6107280/yulio-aleman-jimenez",
            "profile_image": "test-assets/profile.jpg",
            "display_name": "Yulio Aleman Jimenez"
        }],
        "has_more": false,
        "quota_max": 300,
        "quota_remaining": 295,
        "type": "user"
    };

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

                // if (theme !== undefined && theme !== false && theme !== '') {
                //         c(network);
                //     $(this).load(theme, function () {
                //         afterLoadTheme($(this), network, userid);
                //     });
                // } else {
                afterSetTheme($(this), network, userid);
                // }

            });
        }
    }

    function afterSetTheme(flairItem, network, userid) {

        //--------------------TMP
        if (network === "github") {
            getProfile(network, githubTmpData);
        } else if (network === "stackoverflow") {
            getProfile(network, stackofTmpData);
        }
        setProperties(flairItem);
        //--------------------TMP


        // if (!userid) {
        //     c("DEV NETWORKS FLAIRS [ERROR]: You must to provide a user id of " + network + ".");
        // } else {
        //     getUser(network, userid).then(function (data) {
        //         getProfile(network, data);
        //         setProperties(flairItem);
        //     });
        // }
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
                        $(this).text(profile[property]);
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

window.onload = function() {
    window.buildFlairs();
};