(function($) {
    $(document).ready(function() {
        checkScreenSize();

        var codeGithub = initCodeEditor();

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
            var flair = $(".network-flair.flair");
            var cards = $(".network-flair.cards");
            var color = flair.attr("data-color");
            var currColor = $(this).attr("data-color");
            flair.removeClass(color);
            cards.removeClass(color);
            flair.addClass(currColor);
            cards.addClass(currColor);
            flair.attr("data-color", currColor);
            // flair.attr("data-color", currColor);
            cards.attr("data-color", currColor);

            updateCode(codeGithub);
        });

        $('#load_data').click(function (e) { 
            e.preventDefault();
            var github = $('#username').val();
            var stackof = $('#userid').val();

            $(".network-flair.github.flair").attr('data-user', github);
            $(".network-flair.github.cards").attr('data-user', github);
            updateCode(codeGithub);

            // buildFlairs();
        });

        $("body").on('DOMSubtreeModified', ".network-flair", function() {
            // alert('changed');
        });

        // setting data initial color
        var flair = $(".network-flair.flair");
        var cards = $(".network-flair.cards");
        flair.addClass(flair.attr("data-color"));
        cards.addClass(cards.attr("data-color"));

        updateCode(codeGithub);
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

    function initCodeEditor() {
        return CodeMirror.fromTextArea(document.getElementById("code_github"), {
            mode: "javascript",
            readOnly: true,
            lineNumbers: true,
            matchBrackets: true,
            styleActiveLine: true,
            theme: "material"
        });
    }

    function initTextCode() {
        var code =
            "\n<!-- <<<<<<<<<< DEV NETWORKS FLAIRS STYLES >>>>>>>>>> -->\n\n";
        code +=
            "\n<!-- <<<<<<<<<< DEV NETWORKS FLAIRS SCRIPTS >>>>>>>>>> -->\n\n";
        return code;
    }

    function updateCode(codeGithub) {
        var code = initTextCode();
        code += "\n<!-- <<<<<<<<<< CODE FOR GITHUB FLAIR >>>>>>>>>> -->\n\n";
        code += $(".network-flair.github.flair")
            .parent()
            .html()
            .trim();
        code +=
            "\n\n\n<!-- <<<<<<<<<< CODE FOR GITHUB CARDS >>>>>>>>>> -->\n\n";
        code += $(".network-flair.github.cards")
            .parent()
            .html()
            .trim();

        codeGithub.getDoc().setValue(code);
    }
})(window.jQuery);
