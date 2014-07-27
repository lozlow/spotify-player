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
 *
 * spotifyObj - the node-spotify object
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

/**
 * play(track) - plays a given track, updates
 *   the player state and emits events
 *   trackChanged and playerPlaying
 */
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

/**
 * pause() - pauses the player if it is
 *   playing, updates the player state
 *   and emits playerPaused
 */
Player.prototype.pause = function() {
    if (playing) {
        nsPlayer.pause();
        playing = false;
        paused = true;
        this.emit('playerPaused');
    }

    winston.debug('pause called');
}

/**
 * resume() - resumes the player if it is
 *   paused, updates the player state
 *   and emits playerPlaying
 */
Player.prototype.resume = function() {
    if (paused) {
        nsPlayer.resume();
        paused = false;
        playing = true;
        this.emit('playerPlaying');
    }

    winston.debug('resume called');
}

/**
 * stop() - stops the player if it is
 *   playing or paused, updates the
 *   player state and emits playerStopped
 */
Player.prototype.stop = function() {
    if (playing || paused) {
        nsPlayer.stop();
        playing = false;
        paused = false;
        currentTrack = {};
        currentSecond = 0;
        this.emit('playerStopped');
    }

    winston.debug('stop called');
}

/* Accessors */

/**
 * isPlaying() - returns playing player state
 */
Player.prototype.isPlaying = function() {
    return playing;
}

/**
 * isPaused() - returns paused player state
 */
Player.prototype.isPaused = function() {
    return paused;
}

/**
 * getCurrentTrack() - returns currently loaded track
 */
Player.prototype.getCurrentTrack = function() {
    return currentTrack;
}

/**
 * getCurrentSecond() - returns current player second
 */
Player.prototype.getCurrentSecond = function() {
    return currentSecond;
}

/* TimeEmitter function */

/**
 * timeEmitter() - returns a function that creates a timer
 *   to update the current player second, and emit timeChanged
 */
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

/**
 * endOfTrack() - returns a function to handle the endOfTrack
 *   event from libspotify
 */
var endOfTrack = function(player) {
    return function() {
        player.stop();
        player.emit('trackEnded');
    };
};

module.exports = Player;
