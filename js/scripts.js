jQuery(document).ready(function () {
    selectOnLogin();
    homeLanguageButtons();
    setHeights();
    //bgimg();
    disableFormSubmit();
    togglePreview();
    pasteEmoji();
    disableTypingTags();
});

$(window).resize(function () {
    setHeights();
});
/*
$(document).keydown(function(e) {
    switch(e.which) {
        //case 37: // left
        //break;

        //case 38: // up
        //emojis();

        //case 39: // right
        //break;

        case 40: // down
            if($('.emojis').length){
                displayEmojis();
                //console.log("Enjoy emojis!");
                if(!emojisVisible){
                    emojisVisible = true;
                    pasteEmoji();
                }
            }
            

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

var emojisVisible = false;
*/

function selectOnLogin() {
    // Choose the "bombarder_inc" value by default.
    $("#UserLogin").val("bombardier_inc");
}

function disableTypingTags() {
    $("input").keypress(function (event) {
        var regex = new RegExp("^[^<>]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });
}



function togglePreview() {

    $(".btn-preview").click(function () {
        $(".dash-left").toggleClass("showmethemoney");
        $(this).toggleClass("opened");
    });

}

// Add a new promise for image loads
$.fn.imagesLoaded = function () {
    var $imgs = this.find('img[src!=""]');
    if (!$imgs.length) { return $.Deferred().resolve().promise(); }
    var dfds = [];
    $imgs.each(function () {
        var dfd = $.Deferred();
        dfds.push(dfd);
        var img = new Image();
        img.onload = function () { dfd.resolve(); }
        img.onerror = function () { dfd.resolve(); }
        img.src = this.src;

    });

    return $.when.apply($, dfds);

}

function disableFormSubmit() {

    $('#sendMailForm').submit(function (event) {

        event.preventDefault();

        return false;

    });

}

function homeLanguageButtons() {
    $('#languageBtn .btn:first').addClass('active');
    $('#languageBtn .btn').click(function () {

        $('#languageBtn .btn').removeClass('active');
        selLan = $(this).data('val');//jQuery('select#UserLanguage option:selected').val();
        //console.log(selLan);
        $(this).addClass('active');
        jQuery('select#UserLanguage').val(selLan);
    });
}

function setHeights() {
    var windowHeight = $(window).height();
    var headerHeight = $("#header").outerHeight() + $("#steps").outerHeight();
    var footerHeight = $("footer").outerHeight();
    var mainHeight = windowHeight - headerHeight;
    $("#main").css({ "height": mainHeight - footerHeight + "px" });
    $("#spinner").css({ "height": mainHeight + "px", "top": headerHeight + "px" });
    $(".dash-left.bgimg").css({ "height": mainHeight + "px" });
}

function bgimg() {
    if ($('.bgimg').length) {
        $('.bgimg:not(.bgimg-on)').each(function () {
            var target = $('img:first', this);
            var img = '';

            // data-src
            if (target.length) {
                if (target.data('src'))
                    img = target.data('src');
                else
                    img = target.attr('src');

                // background img style
                if (img.toLowerCase().search(/png|jpg|gif|jpeg/) != -1 || img.toLowerCase().search(/relay/g) != -1) {
                    // data-position
                    if ($(this).attr('data-position'))
                        $(this).css({ background: 'url("' + img + '") ' + $(this).data('position') + ' no-repeat' });
                    else
                        $(this).css({ background: 'url("' + img + '") 50% 50% no-repeat' });


                    $('img', this).hide();

                    $(this).addClass('bgimg-on');
                }
            }
        });
    }
}

function displayEmojis() {
    $(".emojis").toggle(function () {

        $("#user_button").css({ "display": "block" });

    }, function () {

        $("#user_button").css({ "display": "none" });

    });
}

function pasteEmoji() {

    $(".emoji").on("click", function (emoji) {

        //console.log(emoji.target.outerText);
        $("#sendMailForm input[name='Subject']").val($("#sendMailForm input[name='Subject']").val() + emoji.target.outerText);

    });

}