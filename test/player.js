// Test src/Player.js
var Player = require('../src/Player'),
    DummySpotifyPlayer = require('./util/dummy-spotify'),
    assert = require('assert'),
    ds = new DummySpotifyPlayer(),
    player = new Player(ds);

describe('Player', function() {
    describe('.play()', function() {
        it('should emit trackChanged', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('trackChanged', function() {
                clearTimeout(errTimeout);
                assert(true);
            });

            player.play({id: 123});
        });

        it('should emit playerPlaying', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('playerPlaying', function() {
                clearTimeout(errTimeout);
                assert(true);
            });

            player.play({id: 123});
        });

        it('isPlaying should be true', function() {
            assert.strictEqual(true, player.isPlaying());
        });

        it('isPaused should be false', function() {
            assert.strictEqual(false, player.isPaused());
        });

        it('isStopped should be false', function() {
            assert.strictEqual(false, player.isStopped());
        });

        it('currentTrack should equal the track passed to play()', function() {
            assert({id: 123}, player.getCurrentTrack());
        });

    });

    describe('.pause()', function() {

        it('should emit playerPaused', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('playerPaused', function() {
                clearTimeout(errTimeout);
                assert(true);
            });

            player.pause();
        });

        it('isPlaying should be false', function() {
            assert.strictEqual(false, player.isPlaying());
        });

        it('isPaused should be true', function() {
            assert.strictEqual(true, player.isPaused());
        });

        it('isStopped should be false', function() {
            assert.strictEqual(false, player.isStopped());
        });

    });

    describe('.resume()', function() {

        it('should emit playerPlaying', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('playerPlaying', function() {
                clearTimeout(errTimeout);
                assert(true);
            });
            player.play({id: 123});
            player.pause();
            player.resume();
        });

        it('isPlaying should be true', function() {
            assert.strictEqual(true, player.isPlaying());
        });

        it('isPaused should be false', function() {
            assert.strictEqual(false, player.isPaused());
        });

        it('isStopped should be false', function() {
            assert.strictEqual(false, player.isStopped());
        });

    });

    describe('.stop()', function() {

        it('should emit playerStopped', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('playerStopped', function() {
                clearTimeout(errTimeout);
                assert(true);
            });

            player.stop();
        });

        it('should emit trackEnded when end of track', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('trackEnded', function() {
                clearTimeout(errTimeout);
                assert(true);
            });

            ds.player.trackEnded();
        });

        it('isPlaying should be false', function() {
            assert.strictEqual(false, player.isPlaying());
        });

        it('isPaused should be false', function() {
            assert.strictEqual(false, player.isPaused());
        });

        it('isStopped should be true', function() {
            assert.strictEqual(true, player.isStopped());
        });

    });

});
