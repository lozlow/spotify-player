var SpotifyPlayer = require('../src/spotify-player'),
    sPlayer = new SpotifyPlayer({ appkeyFile: 'spotify_appkey.key' }, ready),
    winston = require('winston');

winston.setLevels(winston.config.syslog.levels);

var ready = function()  {
    var track1 = spotify.createFromLink('spotify:track:3RyTl2QSgLWNkrwWHS7IGX');
    sPlayer.queue.enqueue(track1);
    var track2 = spotify.createFromLink('spotify:track:5nReZ5ztVR8C8KFPjkS4D3');
    sPlayer.queue.enqueue(track2);
};

sPlayer.spotify.login('username', 'password', false, false);

sPlayer.player.on('trackChanged', function(track) {
    console.log('new track', track);
});

sPlayer.player.on('playerPlaying', function() {
    console.log('playerPlaying');
});

sPlayer.player.on('trackEnded', function() {
    console.log('trackEnded');
});

sPlayer.player.on('playerPaused', function() {
    console.log('playerPaused');
});

sPlayer.player.on('timeChanged', function(time) {
    console.log('new time', time, 'progess', (time / sPlayer.player.getCurrentTrack().duration * 100).toFixed(0));
});
