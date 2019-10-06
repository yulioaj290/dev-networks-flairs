(function ($) {
    $(document).ready(function () {
        themeList(window.themeNames.data, console.log);
    });

    function themeList(themeData, c) {
        let htmlList = ``;

        themeData.map((theme) => {
            htmlList += `
                <div class="row border-bottom">
                    <div class="col mt-5">
                        <h3>${theme.name.charAt(0).toUpperCase() + theme.name.slice(1)} Theme</h3>
                    </div>
                </div>
                <div class="row border pb-3">
                    <div class="col-lg-6">
                        <div class="row mt-3">
                            <div class="col">
                                <a href="theme-list/${theme.name}/index.html">
                                    <img class="embed-responsive" src="theme-list/${theme.name}/image.png" alt="${theme.name} theme">
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="row mt-3">
                            <div class="col">
                                <h3>${theme.author}</h3>
                                <p>${theme.twitter}</p>
                                <p><a target="_blank" href="${theme.website}">${theme.website}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        $("#theme-list").html(htmlList);
    }
})(window.jQuery);
