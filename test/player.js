// Test src/Player.js
var Player = require('../src/Player'),
    DummySpotifyPlayer = require('./util/dummy-spotify'),
    assert = require('assert'),
    ds = new DummySpotifyPlayer(),
    player = new Player(ds);

var PLAYER_STATE_STOPPED = -1,
    PLAYER_STATE_PAUSED = 0,
    PLAYER_STATE_PLAYING = 1;

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

        it('should emit playerStateChange', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('playerStateChange', function(state) {
                clearTimeout(errTimeout);
                assert.strictEqual(PLAYER_STATE_PLAYING, state);
            });
            player.removeAllListeners();

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

        it('should emit playerStateChange', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('playerStateChange', function(state) {
                clearTimeout(errTimeout);
                assert.strictEqual(PLAYER_STATE_PAUSED, state);
            });
            player.removeAllListeners();

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

        it('should emit playerStateChange', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('playerStateChange', function(state) {
                clearTimeout(errTimeout);
                assert.strictEqual(PLAYER_STATE_PLAYING, state);
            });
            player.removeAllListeners();
            
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

        it('should emit playerStateChange', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('playerStateChange', function(state) {
                clearTimeout(errTimeout);
                assert.strictEqual(PLAYER_STATE_STOPPED, state);
            });
            player.removeAllListeners();

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

    describe('.seek()', function() {

        it('should emit playerSeeking', function() {
            var errTimeout = setTimeout(function () {
                assert(false, 'event did not fire');
            }, 100);

            player.on('playerSeeking', function(seekTime) {
                clearTimeout(errTimeout);
                assert.strictEqual(123, seekTime);
            });
            player.removeAllListeners();

            player.play({id: 123});
            player.seek(123);
        });

    });

    describe('.getState()', function() {

        it('should equal 1 when playing', function() {
            player.play();
            assert.strictEqual(PLAYER_STATE_PLAYING, player.getState());
        });

        it('should equal 0 when paused', function() {
            player.pause();
            assert.strictEqual(PLAYER_STATE_PAUSED, player.getState());
        });

        it('should equal -1 when stopped', function() {
            player.stop();
            assert.strictEqual(PLAYER_STATE_STOPPED, player.getState());
        });


    });

});
