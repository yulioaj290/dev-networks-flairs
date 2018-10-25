(function ($, c) {

    var API_GITHUB = "https://api.github.com/";
    var profile = {};

    tmpData = {
        "login": "yulioaj290",
        "id": 15785234,
        "node_id": "MDQ6VXNlcjE1Nzg1MjM0",
        "avatar_url": "https://avatars3.githubusercontent.com/u/15785234?v=4",
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

    function start() {
        flair = $('[data-flair="github"]');

        if (flair.length) {
            loadTheme(function () {
                var username = getInput();
                profile = {};
                getProfile(tmpData);   //--------------------TMP
                setProperties();       //--------------------TMP
                // if (!username) {
                //     c("DEV NETWORKS FLAIRS [ERROR]: You must to provide a username of GitHub.");
                // } else {
                //     getUser(username).then(function (data) {
                //         getProfile(data);
                //         setProperties();
                //     });
                // }
            });
        }
    }

    function getInput() {
        return $('[data-flair="github"]').data('user');
    }

    function getUser(username) {
        var url = API_GITHUB + 'users/' + username;
        return $.get(url)
            .done(function () {
                c("DEV NETWORKS FLAIRS [INFO]: The username data was retrieved successfully.");
            })
            .fail(function () {
                c("DEV NETWORKS FLAIRS [ERROR]: GitHub username is not valid or was not found.");
            });
    }

    function getProfile(userData) {
        profile.username = userData['login'];
        profile.fullname = userData['name'];
        profile.avatar = userData['avatar_url'];
        profile.link = userData['html_url'];
        profile.company = userData['company'];
        profile.location = userData['location'];
        profile.website = userData['blog'];
        profile.repos = truncateNum(userData['public_repos']);
        profile.gists = truncateNum(userData['public_gists']);
        profile.followers = truncateNum(userData['followers']);
        profile.hireable = truncateNum(userData['hireable']);
        profile.bio = truncateNum(userData['bio']);

        // flair.html(JSON.stringify(profile));
        // c('<pre>' + JSON.stringify(profile) + '</pre>');
    }

    function setProperties() {
        for (var property in profile) {
            if (profile.hasOwnProperty(property)) {
                flair.find('[data-property="' + property + '"]').each(function () {
                    $(this).text(profile[property]);
                });
                setLink(property, profile[property]);
            }
        }
    }

    function truncateNum(number) {
        var num = parseInt(number, 10);
        if (num < 1000) return num;
        return (num / 1000).toFixed(1) + 'k';
    }

    function setLink(property, value) {
        flair.find('[data-property="' + property + '"]').each(function () {
            var link = $(this).data("link");

            if (link === "link") {
                $(this).attr("href", value);
                // $(this).text("");
                $(this).text("%");
            } else if (link === "text") {
                $(this).attr("href", value);
                $(this).text(value);
            }
        });
    }

    function loadTheme(afterLoad) {
        var theme = flair.data("theme");

        if (theme !== undefined && theme !== false && theme !== '') {
            flair.load(flair.data("theme"), afterLoad);
        } else {
            afterLoad();
        }
    }

    window.onload = start;

})(window.jQuery, console.log);
