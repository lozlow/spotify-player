var events = require('events')
    util   = require('util')

var nsPlayer,
    currentTrack,
    currentSecond,
    isPlaying,
    isPaused,
    timeEmitterId;

/**
 * Constructor
 */
var Player = function(spotifyObj) {
    events.EventEmitter.call(this);

    nsPlayer = spotifyObj.player;
    //nsPlayer.on('endOfTrack', Player.stop);

    this.on('playerPlaying', timeEmitter(this));
    this.on('playerStopped', function() {
        clearInterval(timeEmitterId);
    });

    currentTrack = {};
    currentSecond = 0;
    isPlaying = false;
    isPaused = false;
};

/* Set up the EventEmitter inheritance */
util.inherits(Player, events.EventEmitter);

/* Player functions */

Player.prototype.play = function(track) {
    nsPlayer.play(track);
    isPlaying = true;
    currentTrack = track;
    this.emit('trackChanged', track);
    this.emit('playerPlaying');
}

Player.prototype.pause = function() {
    nsPlayer.pause();
    isPlaying = false;
    isPaused = true;
    this.emit('playerPaused');
}

Player.prototype.resume = function() {
    if (isPaused) {
        nsPlayer.resume();
        this.isPaused = false;
        this.isPlaying = true;
        this.emit('playerPlaying');
    }
}

Player.prototype.stop = function() {
    if (isPlaying) {
        nsPlayer.stop();
        this.isPlaying = false;
        currentTrack = {};
        currentSecond = 0;
        this.emit('playerStopped');
    }
}

var timeEmitter = function(player) {

    return function() {
        timeEmitterId = setInterval(function() {
            if (nsPlayer.currentSecond != currentSecond) {
                currentSecond = nsPlayer.currentSecond;
                player.emit('timeChanged', currentSecond);
            }
        }, 250);
    };
}

module.exports = Player;
