// Test src/TrackQueue.js
var TrackQueue = require('../src/TrackQueue'),
    assert = require('assert'),
    trackQueue = new TrackQueue();

describe('TrackQueue', function() {
    describe('.enqueue()', function() {
        it('should emit trackEnqueued', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            trackQueue.on('trackEnqueued', function(track, idx) {
                clearTimeout(errTimeout);
                assert({id: 123}, track);
                //assert.strictEqual(0, idx);
            });

            trackQueue.enqueue({id: 123});
        });

        it('should contain enqueued track as last element', function() {
            trackQueue.enqueue({id: 321});
            var queue = trackQueue.getQueue();
            assert({id: 321}, queue[queue.length - 1]);
        });
    });

    describe('.queueNext()', function() {
        it('should emit trackEnqueued', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            trackQueue.on('trackEnqueued', function(track, idx) {
                clearTimeout(errTimeout);
                assert({id: 123}, track);
                //assert.strictEqual(0, idx);
            });

            trackQueue.queueNext({id: 123});
        });

        it('should contain enqueued track as first element', function() {
            trackQueue.queueNext({id: 546});
            var queue = trackQueue.getQueue();
            assert({id: 546}, queue[0]);
        });
    });

    describe('.clearQueue()', function() {
        it('should emit queueCleared', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            trackQueue.on('queueCleared', function() {
                clearTimeout(errTimeout);
                assert(true);
            });

            trackQueue.clearQueue();
        });

        it('should contain no tracks', function() {
            assert.strictEqual(0, trackQueue.getQueue().length);
        });
    });

    describe('.getQueue()', function() {
        it('should return all tracks', function() {
            trackQueue.clearQueue();
            trackQueue.enqueue({id: 123});
            trackQueue.enqueue({id: 456});

            var queue = trackQueue.getQueue();
            assert([{id: 123}, {id: 456}], queue);
        });
    });

    describe('.poll()', function() {
        var removedTrack;
        it('should emit trackRemoved', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            trackQueue.on('trackRemoved', function(track, idx) {
                clearTimeout(errTimeout);
                assert({id: 142536}, track);
                assert.strictEqual(0, idx);
            });

            trackQueue.queueNext({id: 142536});
            removedTrack = trackQueue.poll();
        });

        it('should return first track', function() {
            assert({id: 142536}, removedTrack);
        });

        it('returned element should no longer be at head of queue', function() {
            assert.notEqual({id: 142536}, trackQueue.peek());
        });
    });

    describe('.peek()', function() {
        it('should return first track', function() {
            trackQueue.queueNext({id: 142536});
            assert({id: 142536}, trackQueue.peek());
        });

        it('should still contain first track, as the first element', function() {
            assert({id: 142536}, trackQueue.getQueue()[0])
        });
    });
});
