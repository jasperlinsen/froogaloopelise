
function froogaloopeliseOmnitureCallback(wrapper, mediaPlayer, mediaName) {

	var mediaPlayerName = mediaPlayer || wrapper.playerName;
	var mediaName 		= mediaName || wrapper.name;
	var development		= wrapper.dev;
	
	if(!window.s) return;
	
	wrapper.froogaloop.addEvent('play', function(data){
		if (data.seconds > 0) {
			s.Media.play(mediaName, Math.round(data.seconds));
		} else {
			s.Media.open(mediaName, Math.round(data.duration), mediaPlayerName);
			s.Media.play(mediaName, Math.round(data.seconds));
		}
	});
	
	wrapper.froogaloop.addEvent('pause', function(data){
		s.Media.stop(mediaName, Math.round(data.seconds));
	});
	
	wrapper.froogaloop.addEvent('seek', function(data){
		s.Media.play(mediaName, Math.round(data.seconds));
	});
	
	wrapper.froogaloop.addEvent('finish', function(data){
		s.Media.stop(mediaName, 0);
		s.Media.close(mediaName);
	});
	
}