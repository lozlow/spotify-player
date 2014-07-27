// To be passed to SpotifyPlayer
// needs to implement dummy player methods (play()/pause()/etc)

var DummySpotifyPlayer = function() {
    this.player = new Player();
}

var Player = function() {
}

Player.prototype.play = function() {
   return true;
}
Player.prototype.pause = function() {
   return true;
}
Player.prototype.resume = function() {
   return true;
}
Player.prototype.stop = function() {
   return true;
}
Player.prototype.on = function() {
   return true;
}

module.exports = DummySpotifyPlayer;
