var events = require('events'),
    util   = require('util'),
    winston = require('winston');

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
    nsPlayer.on({
         endOfTrack: endOfTrack(this)
    });

    this.on('playerPlaying', timeEmitter(this));
    this.on('trackChanged', function() {
        winston.debug('clearing TimeEmitter interval');
        clearInterval(timeEmitterId);
    });
    this.on('playerStopped', function() {
        winston.debug('clearing TimeEmitter interval');
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
    
    winston.debug('play called');
    winston.debug(JSON.stringify(track));
}

Player.prototype.pause = function() {
    nsPlayer.pause();
    isPlaying = false;
    isPaused = true;
    this.emit('playerPaused');

    winston.debug('pause called');
}

Player.prototype.resume = function() {
    if (isPaused) {
        nsPlayer.resume();
        this.isPaused = false;
        this.isPlaying = true;
        this.emit('playerPlaying');
    }

    winston.debug('resume called');
}

Player.prototype.stop = function() {
    if (isPlaying) {
        nsPlayer.stop();
        this.isPlaying = false;
        currentTrack = {};
        currentSecond = 0;
        this.emit('playerStopped');
    }

    winston.debug('stop called');
}

/* Accessors */

Player.prototype.isPlaying = function() {
    return isPlaying;
}

Player.prototype.isPaused = function() {
    return isPaused;
}

Player.prototype.getCurrentTrack = function() {
    return currentTrack;
}

Player.prototype.getCurrentSecond = function() {
    return currentSecond;
}

/* TimeEmitter function */

var timeEmitter = function(player) {

    return function() {
        timeEmitterId = setInterval(function() {
            if (nsPlayer.currentSecond != currentSecond) {
                currentSecond = nsPlayer.currentSecond;
                player.emit('timeChanged', currentSecond);
            }
        }, 250);

        winston.debug('creating TimeEmitter interval');
    };
}

/* Ancillary functions */

var endOfTrack = function(player) {
    return function() {
        player.stop();
    };
};

module.exports = Player;
