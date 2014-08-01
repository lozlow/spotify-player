var events = require('events'),
    util   = require('util'),
    winston = require('winston');

var PLAYER_STATE_STOPPED = -1,
    PLAYER_STATE_PAUSED  =  0,
    PLAYER_STATE_PLAYING =  1;

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

    this.PLAYER_STATE_STOPPED = PLAYER_STATE_STOPPED;
    this.PLAYER_STATE_PAUSED = PLAYER_STATE_PAUSED;
    this.PLAYER_STATE_PLAYING = PLAYER_STATE_PLAYING;

    nsPlayer = spotifyObj.player;
    nsPlayer.on({
         endOfTrack: endOfTrack(this)
    });

    this.on('playerStateChange', function(state) {
        if (timeEmitterId) {
            winston.debug('clearing TimeEmitter interval');
            clearInterval(timeEmitterId);
        }
        if (state == PLAYER_STATE_PLAYING) {
            timeEmitter(this);
        }
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
 *   trackChanged
 */
Player.prototype.play = function(track) {
    nsPlayer.play(track);
    currentTrack = track;
    this.emit('trackChanged', track);
    updateState(this, PLAYER_STATE_PLAYING);

    winston.debug('play called');
    winston.debug(JSON.stringify(track));
}

/**
 * pause() - pauses the player if it is
 *   playing, updates the player state
 */
Player.prototype.pause = function() {
    if (playerState == PLAYER_STATE_PLAYING) {
        nsPlayer.pause();
        updateState(this, PLAYER_STATE_PAUSED);
    }

    winston.debug('pause called');
}

/**
 * resume() - resumes the player if it is
 *   paused, updates the player state
 */
Player.prototype.resume = function() {
    if (playerState == PLAYER_STATE_PAUSED) {
        nsPlayer.resume();
        updateState(this, PLAYER_STATE_PLAYING);
    }

    winston.debug('resume called');
}

/**
 * stop() - stops the player if it is
 *   playing or paused, updates the
 *   player state
 */
Player.prototype.stop = function() {
    if (playerState == PLAYER_STATE_PLAYING || playerState == PLAYER_STATE_PAUSED) {
        nsPlayer.stop();
        updateState(this, PLAYER_STATE_STOPPED);
        currentTrack = {};
        currentSecond = 0;
    }

    winston.debug('stop called');
}

/**
 * seek(seekTime) - moves the play head to the specified position
 */
Player.prototype.seek = function(seekTime) {
    if (seekTime < 0) {
        // Ignore negative seek values
        return false;
    }
    if (playerState == PLAYER_STATE_PLAYING || playerState == PLAYER_STATE_PAUSED) {
        nsPlayer.seek(seekTime);
        this.emit('playerSeeking', seekTime);
    }
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

    timeEmitterId = setInterval(function() {
        if (nsPlayer.currentSecond != currentSecond && playerState == PLAYER_STATE_PLAYING) {
            currentSecond = nsPlayer.currentSecond;
            player.emit('timeChanged', currentSecond);
        }
    }, 250);

    winston.debug('creating TimeEmitter interval');
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

/**
 * updateState(player, state) - updates the player state and emits
 *   an event if necessary
 *
 * player - the Player object
 * state - the (possibly) new state
 */
var updateState = function(player, state) {
    if (playerState != state) {
        playerState = state;
        player.emit('playerStateChange', playerState);
    }
}

module.exports = Player;
