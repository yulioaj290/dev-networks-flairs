(function($) {
    $(document).ready(function() {
        var codeGithub = initCodeEditor("github");
        var codeStackof = initCodeEditor("stackof");

        // setting data initial color
        var ghFlair = $(".network-flair.github");
        var stFlair = $(".network-flair.stackoverflow");

        // Mutation observer to update CodeMirrors
        var ghFlairN = ghFlair.get(0);
        var stFlairN = stFlair.get(0);

        // Options for the observer (which mutations to observe)
        var config = { attributes: true, childList: true, characterData: true, subtree: true };

        // Callback function to execute when mutations are observed
        var callback = function() {
            updateCode(codeGithub, "github");
            updateCode(codeStackof, "stackoverflow");
        };

        // Create an observer instance linked to the callback function
        var ghFo = new MutationObserver(callback);
        var stFo = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        ghFo.observe(ghFlairN, config);
        stFo.observe(stFlairN, config);

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
        code += $(".network-flair." + typeFlair)
            .parent()
            .html()
            .trim();
        codeMirror.getDoc().setValue(code);
    }
})(window.jQuery);
