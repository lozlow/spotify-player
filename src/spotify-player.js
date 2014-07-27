var Player = require('./Player'),
    TrackQueue = require('./TrackQueue');

var trckEnqueuedFunc;

var SpotifyPlayer = function(spotifyObj) {
  this.player = new Player(spotifyObj);
  this.queue = new TrackQueue();
  this.spotify = spotifyObj;

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
