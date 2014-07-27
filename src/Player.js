var events = require('events'),
    util   = require('util'),
    winston = require('winston');

var PLAYER_STATE_STOPPED = -1,
    PLAYER_STATE_PAUSED = 0,
    PLAYER_STATE_PLAYING = 1;

var nsPlayer,
    currentTrack,
    currentSecond,
    playerState,
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
    playerState = PLAYER_STATE_STOPPED;
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
    playerState = PLAYER_STATE_PLAYING;
    currentTrack = track;
    this.emit('trackChanged', track);
    this.emit('playerStateChange', playerState);

    winston.debug('play called');
    winston.debug(JSON.stringify(track));
}

/**
 * pause() - pauses the player if it is
 *   playing, updates the player state
 *   and emits playerPaused
 */
Player.prototype.pause = function() {
    if (playerState == PLAYER_STATE_PLAYING) {
        nsPlayer.pause();
        playerState = PLAYER_STATE_PAUSED;
        this.emit('playerStateChange', playerState);
    }

    winston.debug('pause called');
}

/**
 * resume() - resumes the player if it is
 *   paused, updates the player state
 *   and emits playerPlaying
 */
Player.prototype.resume = function() {
    if (playerState == PLAYER_STATE_PAUSED) {
        nsPlayer.resume();
        playerState = PLAYER_STATE_PLAYING;
        this.emit('playerStateChange', playerState);
    }

    winston.debug('resume called');
}

/**
 * stop() - stops the player if it is
 *   playing or paused, updates the
 *   player state and emits playerStopped
 */
Player.prototype.stop = function() {
    if (playerState == PLAYER_STATE_PLAYING || playerState == PLAYER_STATE_PAUSED) {
        nsPlayer.stop();
        playerState = PLAYER_STATE_STOPPED;
        currentTrack = {};
        currentSecond = 0;
        this.emit('playerStateChange', playerState);
    }

    winston.debug('stop called');
}

/* Accessors */

/**
 * getState() - returns the player state
 *   -1 - Player stopped
 *    0 - Player paused
 *    1 - Player playing
 */
Player.prototype.getState = function() {
    return playerState;
}

/**
 * isPlaying() - returns playing player state
 */
Player.prototype.isPlaying = function() {
    return (playerState == PLAYER_STATE_PLAYING);
}

/**
 * isPaused() - returns paused player state
 */
Player.prototype.isPaused = function() {
    return (playerState == PLAYER_STATE_PAUSED);
}

/**
 * isStopped() - returns true if the player is stopped
 */
 Player.prototype.isStopped = function() {
    return (playerState == PLAYER_STATE_STOPPED);
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
