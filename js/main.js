$(document).ready(function () {
    $("#about-button").click(function () {
        $("#about").css("display", "block");
        $("#player").css("display", "none");
        $("#accomplishment").css("display", "none");
    });
    
    $("#player-button").click(function () {
        $("#about").css("display", "none");
        $("#player").css("display", "block");
        $("#accomplishment").css("display", "none");
    });
    
    $("#accomplishment-button").click(function () {
        $("#about").css("display", "none");
        $("#player").css("display", "none");
        $("#accomplishment").css("display", "block");
    });
    
    var rotation = 0;

    jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate(' + degrees + 'deg)',
                 '-moz-transform' : 'rotate(' + degrees + 'deg)',
                 '-ms-transform' : 'rotate(' + degrees + 'deg)',
                 'transform' : 'rotate(' + degrees + 'deg)',
                });
    };

    $('#arrow-button').click(function() {
        rotation += 180;
        $(this).rotate(rotation);
    });
    
});