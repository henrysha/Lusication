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
    
    $("#arrow-button").click(function () {
        var button = $("#arrow-button");
        if (button.hasClass('rotated')) {
            button.animate({"transform": "rotate(0)"}, "slow").addClass('rotated');
        } else {
            button.animate({"transform": "rotate(180deg)"}, "slow").removeClass('rotated');
        }
    });
    
});