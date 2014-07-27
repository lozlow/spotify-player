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
            assert(true, player.isPlaying());
        });

        it('isPaused should be false', function() {
            assert(false, player.isPaused());
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
            assert(false, player.isPlaying());
        });

        it('isPaused should be true', function() {
            assert(true, player.isPaused());
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

            player.resume();
        });

        it('isPlaying should be true', function() {
            assert(true, player.isPlaying());
        });

        it('isPaused should be false', function() {
            assert(false, player.isPaused());
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

        it('isPlaying should be false', function() {
            assert(false, player.isPlaying());
        });

        it('isPaused should be false', function() {
            assert(false, player.isPaused());
        });

    });

});
