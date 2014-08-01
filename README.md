# spotify-player [![Build Status](https://travis-ci.org/lozlow/spotify-player.svg?branch=master)](https://travis-ci.org/lozlow/spotify-player)

This library builds on the [node-spotify](https://github.com/FrontierPsychiatrist/node-spotify) module and provides additional objects Player and PlayerQueue, which produce events suited for updating a player and playlist queue.

## Prerequisites
From node-spotify: libspotify, libasound2-dev, G++-4.7+, and a spotify premium application key (link to spotify website)

## API
spotify-player:
 - SpotifyPlayer.spotify - the node-spotify player (this objects track manipulation features should not be used)
 - SpotifyPlayer.player - the Player object
 - SpotifyPlayer.queue - the TrackQueue object

Player:
 - SpotifyPlayer.player.play(track) - plays the given track
 - SpotifyPlayer.player.pause() - pauses the player if it is playing
 - SpotifyPlayer.player.resume() - resumes the player if it is paused
 - SpotifyPlayer.player.stop() - stops the player if it is not already stopped
 - SpotifyPlayer.player.seek(time) - moves the playhead to the specified time (in seconds)
 - SpotifyPlayer.player.getState() - returns the state of the player
 - SpotifyPlayer.player.isPlaying() - returns true if the player is playing
 - SpotifyPlayer.player.isPaused() - returns true if the player is paused
 - SpotifyPlayer.player.isStopped() - returns true if the player is stopped
 - SpotifyPlayer.player.getCurrentTrack() - returns the currently loaded track
 - SpotifyPlayer.player.getCurrentSecond() - returns the current player second

TrackQueue:
 - SpotifyPlayer.queue.enqueue(track, [idx]) - enqueues the track at an optional index, if the index is not given the track is added to the back of the queue
 - SpotifyPlayer.queue.queueNext(track) - convenience method for queueing a track next.
 - SpotifyPlayer.queue.clearQueue() - clears the queue.
 - SpotifyPlayer.queue.getQueue() - returns the queue contents as an array.
 - SpotifyPlayer.queue.getQueueLength() - returns the queue length as an integer.
 - SpotifyPlayer.queue.poll() - returns and removes the head element of the queue.
 - SpotifyPlayer.queue.peek() - returns but does not remove the head element of the queue.

## Events
On Player object:
 - playerStateChanged - emitted when the player's state changes. Emits -1 when stopped, 0 when paused and 1 when playing.
 - trackChanged - emitted when a new track is loaded. Emits the track object.
 - trackEnded - emitted when the currently playing song finishes.
 - timeChanged - emitted when the second of the currently playing song changes. Emits the time in seconds as an integer.
 - playerSeeking - emitted as soon as seek() is called. Emits the new time position, in seconds, as an integer.

On TrackQueue object:
 - trackEnqueued - emitted when a track is enqueued. Emits the index at which the track was entered, and the track object.
 - trackRemoved - emitted when a track is removed. Emits the index at which the track was removed, and the track object.
 - queueCleared - emitted when the queue is cleared. trackRemoved events are NOT emitted whilst the tracks are removed.

## Usage Example
	var SpotifyPlayer = require('spotify-player'),
	    sPlayer = new SpotifyPlayer({ appkeyFile: '/path/to/spotify_appkey.key' }, ready);

	var ready = function()  {
	    var track1 = spotify.createFromLink('spotify:track:3RyTl2QSgLWNkrwWHS7IGX');
	    sPlayer.queue.enqueue(track1);
	    var track2 = spotify.createFromLink('spotify:track:5nReZ5ztVR8C8KFPjkS4D3');
	    sPlayer.queue.enqueue(track2);
	};

	sPlayer.spotify.login('username', 'password', false, false);

## TODOs

- Allow multiple tracks to be enqueued at once (easy)
- Improve tests (beforeEach etc) (easy)
- Input validation, don't accept invalid tracks (easy)