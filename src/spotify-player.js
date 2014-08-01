var Player = require('./Player'),
    TrackQueue = require('./TrackQueue'),
    spotify;

var trckEnqueuedFunc;

var SpotifyPlayer = function(spotifyOpt, readyFn) {
  this.spotify = require('node-spotify')(spotifyOpt);
  this.player = new Player(this.spotify);
  this.queue = new TrackQueue();

  this.spotify.on({
      ready: readyFn
  });

  this.player.on('trackEnded', handleEndTrack(this));
  trckEnqueuedFunc = handleTrackEnqueued(this);
  this.queue.on('trackEnqueued', trckEnqueuedFunc);
}

SpotifyPlayer.prototype.skip = function() {
  if (this.queue.getQueueLength()) {
    this.player.play(this.queue.poll());
  } else {
    this.player.stop();
  }
}

var handleEndTrack = function(spObj) {
    return function() {
        if (spObj.queue.getQueueLength() != 0) {
            spObj.player.play(spObj.queue.poll());
        } else {
            spObj.player.stop();
            trckEnqueuedFunc = handleTrackEnqueued(spObj);
            spObj.queue.on('trackEnqueued', trckEnqueuedFunc);
        }
    }
}

var handleTrackEnqueued = function(spObj) {
    return function() {
        spObj.player.play(spObj.queue.poll());
        spObj.queue.removeListener('trackEnqueued', trckEnqueuedFunc);
    }
}

module.exports = SpotifyPlayer;
