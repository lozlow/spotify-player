var events = require('events'),
    util   = require('util'),
    array = require('array');

var trackQueue;

var TrackQueue = function() {
    trackQueue = new array();

    trackQueue.on('add', addHandler(this));
    trackQueue.on('remove', removeHandler(this));
}

/* Set up the EventEmitter inheritance */
util.inherits(TrackQueue, events.EventEmitter);

TrackQueue.prototype.enqueue = function(track) {
    trackQueue.push(track);
};

TrackQueue.prototype.queueNext = function(track) {
    trackQueue.unshift(track);
}

TrackQueue.prototype.clearQueue =  function() {
    trackQueue.off('remove');

    while(trackQueue.length > 0) {
        trackQueue.pop();
    }

    trackQueue.on('remove', removeHandler(this));
    this.emit('queueCleared');
}

TrackQueue.prototype.getQueue = function() {
    return trackQueue.toArray();
}

TrackQueue.prototype.poll = function() {
    return trackQueue.shift();
}

TrackQueue.prototype.peek = function() {
    return trackQueue[0];
}

var addHandler = function(trackQueueObj) {
    return function(elem, index) {
        trackQueueObj.emit('trackEnqueued', elem, index);
    }
}

var removeHandler = function(trackQueueObj) {
    return function(elem, index) {
        trackQueueObj.emit('trackRemoved', elem, index);
    }
}

module.exports = TrackQueue;
