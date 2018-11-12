(function($) {
    $(document).ready(function() {
        checkScreenSize();

        var codeGithub = initCodeEditor("github");
        var codeStackof = initCodeEditor("stackof");

        $("label.onoffswitch-ios-label").click(function(e) {
            e.preventDefault();
            var chBox = $(this)
                .parent()
                .find('input[type="checkbox"]');
            chBox.attr("checked", !chBox.attr("checked"));
            chBox.toggleClass("checked");
        });

        $(".theme-icon > a").click(function(e) {
            e.preventDefault();
            toggleCollapse();
        });

        $(".theme-buttons > button").click(function(e) {
            e.preventDefault();
            var ghFlair = $(".network-flair.flair");
            var ghCards = $(".network-flair.cards");
            var ghColor = ghFlair.attr("data-color");
            var currColor = $(this).attr("data-color");
            ghFlair.removeClass(ghColor);
            ghCards.removeClass(ghColor);
            ghFlair.addClass(currColor);
            ghCards.addClass(currColor);
            ghFlair.attr("data-color", currColor);
            ghCards.attr("data-color", currColor);

            var stFlair = $(".network-flair.flair");
            var stCards = $(".network-flair.cards");
            var stColor = stFlair.attr("data-color");
            stFlair.removeClass(stColor);
            stCards.removeClass(stColor);
            stFlair.addClass(currColor);
            stCards.addClass(currColor);
            stFlair.attr("data-color", currColor);
            stCards.attr("data-color", currColor);
        });

        $("#load_data").click(function(e) {
            e.preventDefault();

            var github = $("#username")
                .val()
                .trim();
            var stackof = $("#userid")
                .val()
                .trim();

            if (github !== "") {
                $(".network-flair.github.flair").attr("data-user", github);
                $(".network-flair.github.cards").attr("data-user", github);
            }

            if (stackof !== "") {
                $(".network-flair.stackoverflow.flair").attr(
                    "data-user",
                    stackof
                );
                $(".network-flair.stackoverflow.cards").attr(
                    "data-user",
                    stackof
                );
            }

            buildFlairs();
        });

        // setting data initial color
        var ghFlair = $(".network-flair.github.flair");
        var ghCards = $(".network-flair.github.cards");
        ghFlair.addClass(ghFlair.attr("data-color"));
        ghCards.addClass(ghCards.attr("data-color"));
        var stFlair = $(".network-flair.stackoverflow.flair");
        var stCards = $(".network-flair.stackoverflow.cards");
        stFlair.addClass(stFlair.attr("data-color"));
        stCards.addClass(stCards.attr("data-color"));

        // Mutation observer to update CodeMirrors
        var ghFlairN = ghFlair.get(0);
        var ghCardsN = ghCards.get(0);
        var stFlairN = stFlair.get(0);
        var stCardsN = stCards.get(0);

        // Options for the observer (which mutations to observe)
        var config = { attributes: true, childList: true, characterData: true, subtree: true };

        // Callback function to execute when mutations are observed
        var callback = function() {
            updateCode(codeGithub, "github");
            updateCode(codeStackof, "stackoverflow");
        };

        // Create an observer instance linked to the callback function
        var ghFo = new MutationObserver(callback);
        var ghCo = new MutationObserver(callback);
        var stFo = new MutationObserver(callback);
        var stCo = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        ghFo.observe(ghFlairN, config);
        ghCo.observe(ghCardsN, config);
        stFo.observe(stFlairN, config);
        stCo.observe(stCardsN, config);

        // Later, you can stop observing
        // observer.disconnect();

        $("code").each(function(i) {
            var template =
                '<div class="inline-code"><textarea>' +
                $(this).html() +
                "</textarea></div>";
            $(this).html(template);

            var cm = CodeMirror.fromTextArea($(this).find("textarea")[0], {
                mode: "javascript",
                readOnly: true,
                lineNumbers: true,
                matchBrackets: true,
                styleActiveLine: true,
                theme: "material"
            });
        });
    });

    $(window).bind("load resize", function() {
        checkScreenSize();
    });

    function checkScreenSize() {
        var docWidth = $(document).width();

        if (docWidth < 992) {
            collapseSections(true);
        } else {
            collapseSections(false);
        }
    }

    function collapseSections(value) {
        if (value) {
            $(".theme-colors").addClass("th-collapse");
            $(".page-content").addClass("th-collapse");
        } else if (!value) {
            $(".theme-colors").removeClass("th-collapse");
            $(".page-content").removeClass("th-collapse");
        }
    }

    function toggleCollapse() {
        $(".theme-colors").toggleClass("th-collapse");
        $(".page-content").toggleClass("th-collapse");
    }

    function initCodeEditor(typeFlair) {
        return CodeMirror.fromTextArea(
            document.getElementById("code_" + typeFlair),
            {
                mode: "javascript",
                readOnly: true,
                lineNumbers: true,
                matchBrackets: true,
                styleActiveLine: true,
                theme: "material"
            }
        );
    }

    function updateCode(codeMirror, typeFlair) {
        var code =
            "\n<!-- <<<<<<<<<< CODE FOR " +
            String.prototype.toUpperCase(typeFlair) +
            " FLAIR >>>>>>>>>> -->\n\n";
        code += $(".network-flair." + typeFlair + ".flair")
            .parent()
            .html()
            .trim();
        code +=
            "\n\n\n<!-- <<<<<<<<<< CODE FOR " +
            String.prototype.toUpperCase(typeFlair) +
            " CARDS >>>>>>>>>> -->\n\n";
        code += $(".network-flair." + typeFlair + ".cards")
            .parent()
            .html()
            .trim();

        codeMirror.getDoc().setValue(code);
    }
})(window.jQuery);
