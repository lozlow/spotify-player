var events = require('events'),
    util   = require('util'),
    array = require('array');

var trackQueue;

/**
 * Constructor
 */
var TrackQueue = function() {
    events.EventEmitter.call(this);
    
    trackQueue = new array();

    trackQueue.on('add', addHandler(this));
    trackQueue.on('remove', removeHandler(this));
}

/* Set up the EventEmitter inheritance */
util.inherits(TrackQueue, events.EventEmitter);

/**
 * enqueue(track, [idx]) - adds the given track to the queue
 *   (at end) or, at idx if supplied
 */
TrackQueue.prototype.enqueue = function(track, idx) {
    if (idx || idx === 0) {
        trackQueue.splice(idx, 0, track);
    } else {
        trackQueue.push(track);
    }
};

/**
 * queueNext(track) - adds the given track to the
 *   front of the queue
 */
TrackQueue.prototype.queueNext = function(track) {
    trackQueue.unshift(track);
}

/**
 * clearQueue() - detaches handler for remove event,
 *   clears the contents of the queue, emits queueCleared,
 *   re-attaches handler for remove event
 */
TrackQueue.prototype.clearQueue =  function() {
    trackQueue.off('remove');

    while(trackQueue.length > 0) {
        trackQueue.pop();
    }

    trackQueue.on('remove', removeHandler(this));
    this.emit('queueCleared');
}

/**
 * getQueue() - returns the queue as an array
 */
TrackQueue.prototype.getQueue = function() {
    return trackQueue.toArray();
}

/**
 * getQueueLength() - returns the queue length
 */
TrackQueue.prototype.getQueueLength = function() {
    return trackQueue.length;
}

/**
 * poll() - returns and removes the head of the queue
 */
TrackQueue.prototype.poll = function() {
    return trackQueue.shift();
}

/**
 * peek() - returns the head of the queue but does not
 *   remove it
 */
TrackQueue.prototype.peek = function() {
    return trackQueue[0];
}

/**
 * addHandler() - returns a function to handle the add event
 */
var addHandler = function(trackQueueObj) {
    return function(elem, index) {
        trackQueueObj.emit('trackEnqueued', elem, index);
    }
}

/**
 * removeHandler() - returns a function to handle the add event
 */
var removeHandler = function(trackQueueObj) {
    return function(elem, index) {
        trackQueueObj.emit('trackRemoved', elem, index);
    }
}

module.exports = TrackQueue;
