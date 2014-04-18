//console.log("javascript loaded");

var database = new Firebase('https://sizzling-fire-9662.firebaseio.com/');
var user_key, user_lat, user_lon, user_track;

user_lat = 0;
user_lon = 0;
$(document).ready(function(){
    //console.log("document ready");
    R.ready(function(){
        R.player.on('change:playingTrack', function(track){
            var icon_big = track.get("icon400");
            var icon_small = track.get("icon");
            if (icon_big)
                $('#album-art-container').css("background-image", "url('" + icon_big + "')");
            else
                $('#album-art-container').css("background-image", "url('" + icon_small + "')");
            if (user_key != undefined){
                database.child(user_key).child("track").set({key: track.get("key"),
                                                             name: track.get("name"),
                                                             artist: track.get("artist"),
                                                            });
            }
            $("#most-recently-played-container").empty();
            $("#most-recently-played-container").append(track.get("name") + ' - ' + track.get("artist"));
        });
        //console.log("Rdio api loaded");
        if(!R.authenticated()){
            alert("rdio&trade; login is needed for the full feature of Lusication.\nGuest access grants limited functionality to the service.");
        }
        $("#login").click(function(){
            console.log("login_button_clicked");
            R.authenticate();
        });
        user_key = R.currentUser.get("key");
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                user_lat = position.coords.latitude;
                user_lon = position.coords.longitude;
                if (user_key != undefined){
                    database.child(user_key).child('location').set({
                                    latitude: user_lat,
                                    longitude: user_lon,
                                 });
                }
            });
        }
        else{
            alert('Your web-browser does not provide geolocation!\nPlease update to modern browsers to use the service!');
            user_lat = undefined;
            user_lon = undefined;
        }
        $("#search-submit").click(function(){
            var track_name = $("#search-title").val();
            R.request({
                method: "searchSuggestions",
                content: {
                    query: track_name,
                    types: "Track"
                },
                success: function(response){
                    if (response.result[0] != undefined){
                        if ($('#search-result-container').hasClass('search-tracks')){
                            $('#search-result-container').removeClass('search-tracks');}
                        $('#search-result-container').empty();
                        $('#search-result-container').append("<ul>");
                        for (var i = 0; response.result[i] != undefined; i++){
                            if(response.result[i].canStream)
                                $('#search-result-container').append("<li class='search-tracks'> <button value='" + response.result[i].key + "'>" + response.result[i].name + " - " + response.result[i].artist + "</button> </li>");
                        }
                        $('#search-result-container').append("</ul>");   
                        $(".search-tracks > button").click(function(){
                            //console.log("button clicked" + $(this).attr('value'));
                            R.player.play({source: $(this).attr('value')});
                            user_track = $(this).attr('value');
                        });
                    }
                    else {
                        if ($('#search-result-container').hasClass('search-tracks')){
                            $('#search-result-container').removeClass('search-tracks');}
                        $('#search-result-container').empty();
                        $('#search-result-container').append("track not found").addClass('search-tracks');
                    }
                },
                error: function(response){
                    $('#search-result-container').append("error: " + response.message);
                }
            });
        });
        
        database.on('value', function(dataSnapshot){
            $("#cbp-spmenu-s2 > ul").empty();
            user_lat = dataSnapshot.child(user_key).val().location.latitude;
            user_lon = dataSnapshot.child(user_key).val().location.longitude;
            user_likes = dataSnapshot.child(user_key).val().like;
            R.player.on('change:playingTrack',function(){

                played_no = dataSnapshot.child(user_key).val().no_music_played;
                if (played_no == undefined){
                    played_no = 0;
                }
                played_no = played_no + 1;
                database.child(user_key).child("no_music_played").set(played_no);
                $("#number-played-container").empty();
                $("#number-played-container").append("Number of Music Played on Lusication : " + played_no);
            });
            $("#liked-number-container").empty();
            $("#liked-number-container").append("Likes You've Gotten : " + user_likes);
            dataSnapshot.forEach(function(childSnapshot){
                if (childSnapshot.name() != user_key){
                   var d = distance (user_lat,user_lon,childSnapshot.val().location.latitude,childSnapshot.val().location.longitude);
                   if (d < 10 && childSnapshot.val().track != undefined) {
                       var track_name = childSnapshot.val().track.name;
                       var artist = childSnapshot.val().track.artist;
                       var track_key = childSnapshot.val().track.key;
                       $("#cbp-spmenu-s2 > ul").append("<li class='search-tracks'> <button class='playback' value=" + track_key + ">" + track_name + " - " + artist + "</button> <button class='like' value='" + childSnapshot.name() + "'>LIKE</button></li>");
                       $(".playback").click(function(){
                       //console.log("button clicked" + $(this).attr('value'));
                       R.player.play({source: $(this).attr('value')});
                       user_track = $(this).attr('value');
                       });
                       $(".like").click(function(){
                           var like = childSnapshot.child('like').val();
                           if (like == undefined)
                               like = 0;
                           like = like + 1;
                           database.child(childSnapshot.name()).child("like").set(like);
                       });
                   }
                }
            });
        });
    });
});
function distance (lat1, lon1, lat2, lon2){
var φ1 = lat1.toRad(), φ2 = lat2.toRad(), Δλ = (lon2-lon1).toRad(), R = 6371; // gives d in km
var d = Math.acos( Math.sin(φ1)*Math.sin(φ2) +
                   Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R;
    return d;
}
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}