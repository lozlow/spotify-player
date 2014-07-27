// Test src/TrackQueue.js
var TrackQueue = require('../src/TrackQueue'),
    assert = require('assert'),
    trackQueue = new TrackQueue();

describe('TrackQueue', function() {
    describe('.enqueue()', function() {
        it('should emit trackEnqueued');
        it('should contain enqueued track as last element');
    });

    describe('.queueNext()', function() {
        it('should emit trackEnqueued');
        it('should contain enqueued track as first element');
    });

    describe('.clearQueue()', function() {
        it('should emit queueCleared');
        it('should contain no tracks');
    });

    describe('.getQueue()', function() {
        it('should return all tracks');
    });

    describe('.pop()', function() {
        it('should emit trackRemoved');
        it('should return first track');
        it('first track should not be this element');
    });

    describe('.peek()', function() {
        it('should return first track');
        it('should still contain first track, as the first element');
    });
});
