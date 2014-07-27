var events = require('events'),
    util   = require('util'),
    winston = require('winston');

var nsPlayer,
    currentTrack,
    currentSecond,
    playing,
    paused,
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
    this.on('playerPaused', function() {
        winston.debug('clearing TimeEmitter interval');
        clearInterval(timeEmitterId);
    });
    this.on('playerStopped', function() {
        winston.debug('clearing TimeEmitter interval');
        clearInterval(timeEmitterId);
    });

    currentTrack = {};
    currentSecond = 0;
    playing = false;
    paused = false;
};


/* Set up the EventEmitter inheritance */
util.inherits(Player, events.EventEmitter);

/* Player functions */

Player.prototype.play = function(track) {
    nsPlayer.play(track);
    playing = true;
    paused = false;
    currentTrack = track;
    this.emit('trackChanged', track);
    this.emit('playerPlaying');
    
    winston.debug('play called');
    winston.debug(JSON.stringify(track));
}

Player.prototype.pause = function() {
    nsPlayer.pause();
    playing = false;
    paused = true;
    this.emit('playerPaused');

    winston.debug('pause called');
}

Player.prototype.resume = function() {
    if (paused) {
        nsPlayer.resume();
        paused = false;
        playing = true;
        this.emit('playerPlaying');
    }

    winston.debug('resume called');
}

Player.prototype.stop = function() {
    if (playing) {
        nsPlayer.stop();
        playing = false;
        currentTrack = {};
        currentSecond = 0;
        this.emit('playerStopped');
    }

    winston.debug('stop called');
}

/* Accessors */

Player.prototype.isPlaying = function() {
    return playing;
}

Player.prototype.isPaused = function() {
    return paused;
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
