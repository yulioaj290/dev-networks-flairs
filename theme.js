(function (themes) {
    
    themes.default = '\
            <style type="text/css" rel="stylesheet">\
                .blue {\
                    background-color: #eeeeee;\
                }\
            </style>\
            \
            <p class="text-dark" data-property="username"></p>\
            <p class="text-dark" data-property="userid"></p>\
            <p class="text-dark" data-property="fullname"></p>\
            <p><a class="text-primary" data-property="website" data-link="link"></a></p>\
            <p><a class="text-primary" data-property="website" data-link="text"></a></p>\
            <p class="text-success" data-property="location"></p>';

})(window.flairThemes = {});