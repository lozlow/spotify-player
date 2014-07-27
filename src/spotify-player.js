var Player = require('./Player');

var SpotifyPlayer = function(spotifyObj) {
  this.player = new Player(spotifyObj);
}

module.exports = SpotifyPlayer;
