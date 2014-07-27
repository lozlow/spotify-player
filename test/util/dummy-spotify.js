var events = require('events'),
    util   = require('util');

var DummySpotifyPlayer = function() {
    this.player = new Player();
}

var Player = function() {
}

/* Set up the EventEmitter inheritance */
util.inherits(Player, events.EventEmitter);

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
Player.prototype.seek = function() {
   return true;
}
Player.prototype.trackEnded = function() {
   this.emit('endOfTrack');
}
Player.prototype.on = function() {
   return true;
}

module.exports = DummySpotifyPlayer;
