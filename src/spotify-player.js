var Player = require('./Player'),
    TrackQueue = require('./TrackQueue');

var trckEnqueuedFunc;

var SpotifyPlayer = function(spotifyObj) {
  this.player = new Player(spotifyObj);
  this.queue = new TrackQueue();

  this.player.on('trackEnded', handleEndTrack(this));
  trckEnqueuedFunc = handleTrackEnqueued(this);
  this.queue.on('trackEnqueued', trckEnqueuedFunc);
}

var handleEndTrack = function(spObj) {
    return function() {
            console.log('endTrack');
        if (spObj.queue.getQueueLength() != 0) {
            spObj.player.play(spObj.queue.poll());
        } else {
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
