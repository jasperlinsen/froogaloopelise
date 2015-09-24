// Standard Froogaloop Implementation

function Froogaloopelise(querySelector){
	
	Froogaloopelise.addScript();
	
	// If froogaloop is not active yet, add to queu
	if(!Froogaloopelise.scriptAdded){
		Froogaloopelise.queue.push(querySelector);
		return;
	}
	
	var iframes = document.querySelectorAll(querySelector);
	for(var i = 0; i < iframes.length; i++){
	
		var iframe, id, src;
		
		iframe 	= iframes.item(i);
		
		// Set an id;
		id	= Froogaloopelise.getId(iframe);
		iframe.setAttribute('id', id);
		
		// Set the api and id for the player
		src	= iframe.getAttribute('src');
		src	= src.indexOf('?') >= 0 ? src + '&' : src + '?';
		src = src + 'api=1&player_id=' + id;
		iframe.setAttribute('src', src);
		
		iframe = Froogaloopelise.addUI(iframe, id);
		
	}
	
	return true;
	
}
Froogaloopelise.id				= 1; 
Froogaloopelise.scriptAdded 	= false;
Froogaloopelise.queue 			= [];
Froogaloopelise.getId			= function(element){
	return element && element.getAttribute('id') 
		? element.getAttribute('id')
		: 'froogaloop-' + Froogaloopelise.id++;
}; 
Froogaloopelise.executeQueue 	= function(){
	Froogaloopelise.queue.forEach(Froogaloopelise);
}
Froogaloopelise.addScript 		= function(){

	if(Froogaloopelise.scriptAdded || document.getElementById('froogaloop-script')) 
		return false;
	
	var script 			= document.createElement('script');
		script.id		= 'froogaloop-script';
		script.type 	= 'text/javascript';
		script.src 		= 'https://f.vimeocdn.com/js/froogaloop2.min.js';
		script.addEventListener('load', function(){
			Froogaloopelise.scriptAdded = true
			Froogaloopelise.executeQueue();
		}, false);
		
	document.head.appendChild(script);
	
}
Froogaloopelise.Utils			= {
	fullScreenElement: false,
	requestFulLScreen: function(element){
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else {
			return false;
		}
		this.fullScreenElement = element;
		this.fullScreenElement.addEventListener('fullscreenchange', function(){
			this.fullScreenElement.removeAttribute('data-is-fullscreen');
			this.fullScreenElement = false;
		}.bind(this), false)
		this.fullScreenElement.setAttribute('data-is-fullscreen', 'true');
		return true;
	},
	exitFullScreen: function(){
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else {
			return false;
		}
		return true;
	}
}
Froogaloopelise.addUI			= function(iframe){

	var wrapper, list, froogaloop, duration;
	
	wrapper = document.createElement('div');
	wrapper	.className = '[ froogaloop froogaloop-wrapper ]'
	iframe	.parentNode.insertBefore(wrapper, iframe);
	iframe	.parentNode.removeChild(iframe);
	wrapper	.appendChild(iframe);
	
	function resizeIframe(){
		iframe.width = wrapper.clientWidth;
		iframe.height = wrapper.clientWidth / 16 * 9;
	}
	
	window.addEventListener('resize', resizeIframe, false);
	resizeIframe();
	
	list 	= document.createElement('ul');
	wrapper	.appendChild(list);
	console.log(iframe);
	$f(iframe).addEvent('ready', function(id){
		froogaloop 	= $f(id);
		froogaloop.api('getDuration', function(v){ duration = v; });
	
		var playpause;
	
		// Play/Pause Button
		playpause = document.createElement('li');
		playpause .className = '[ froogaloop play-pause state: paused ]';
		playpause .textContent = 'Play';
		playpause .addEventListener('click', function(){
			froogaloop.api('paused', function(paused){
				if(paused)
					froogaloop.api('play');
				else
					froogaloop.api('pause');
			});
		});
		list.appendChild(playpause);
		
		froogaloop.addEvent('play', function(){
			playpause.textContent = 'Pause';
			playpause.className = '[ froogaloop play-pause state: playing ]';
		});
		froogaloop.addEvent('pause', function(){
			playpause.textContent = 'Play';
			playpause.className = '[ froogaloop play-pause state: paused ]';
		});
		
		var rewind;
	
		rewind = document.createElement('li');
		rewind .className = '[ froogaloop rewind ]';
		rewind .textContent = 'Rewind';
		rewind .addEventListener('click', function(){
			froogaloop.api('seekTo', 0);
		});
		list.appendChild(rewind);
	
		var durationScrubber, durationScrubberPassed, durationMouseEvent;
		
		function durationScrubHandler(event){
			if(!durationMouseEvent || !duration || !durationScrubber) 
				return;
			var offsetParent = durationScrubber, 
				left = event.pageX - durationScrubber.offsetLeft;
			while(offsetParent.offsetParent){ 
				offsetParent = offsetParent.offsetParent;
				left -= offsetParent.offsetLeft;
			}
			froogaloop.api('seekTo', duration * left / durationScrubber.offsetWidth);
		}
		
		durationScrubber = document.createElement('li');
		durationScrubber .className = '[ froogaloop scrubber seek ]';
		durationScrubberPassed = document.createElement('span');
		durationScrubberPassed .className = '[ froogaloop scrubber seeker ]';
		durationScrubberPassed .textContent = 'Seek';
		durationScrubberPassed .style.width = '0%';
		durationScrubber .appendChild(durationScrubberPassed);
		durationScrubber .addEventListener('mousedown', function(event){ 
			durationMouseEvent = true;
			durationScrubHandler(event);
		}, false);
		durationScrubber .addEventListener('mouseup', 	function(){ 
			durationMouseEvent = false; 
		}, false);
		durationScrubber .addEventListener('mouseleave', 	function(){ 
			durationMouseEvent = false; 
		}, false);
		durationScrubber .addEventListener('mousemove', durationScrubHandler, false);
		list.appendChild(durationScrubber);
		
		froogaloop.addEvent('playProgress', function(data){
			durationScrubberPassed.style.width = (data.percent * 100) + '%';
		});
	
		var volumeScrubber, volumeScrubberPassed, volumeMouseEvent;
		
		function volumeScrubHandler(event){
			if(!volumeMouseEvent || !volumeScrubber) return;
			var offsetParent = volumeScrubber, 
				left = event.pageX - volumeScrubber.offsetLeft;
			while(offsetParent.offsetParent){ 
				offsetParent = offsetParent.offsetParent;
				left -= offsetParent.offsetLeft;
			}
				left = Math.round(left / volumeScrubber.offsetWidth * 10);
			volumeScrubberPassed.style.width = (left * 10) + '%';
			froogaloop.api('setVolume', left / 10);
		}
		
		volumeScrubber = document.createElement('li');
		volumeScrubber .className = '[ froogaloop scrubber volume ]';
		volumeScrubberPassed = document.createElement('span');
		volumeScrubberPassed .className = '[ froogaloop scrubber volume ]';
		volumeScrubberPassed .textContent = 'Volume';
		volumeScrubberPassed .style.width = '50%';
		volumeScrubber .appendChild(volumeScrubberPassed);
		volumeScrubber .addEventListener('mousedown', function(event){ 
			volumeMouseEvent = true;
			volumeScrubHandler(event);
		}, false);
		volumeScrubber .addEventListener('mouseup', function(){ 
			volumeMouseEvent = false; 
		}, false);
		volumeScrubber .addEventListener('mousemove', volumeScrubHandler, false);
		list.appendChild(volumeScrubber);
		
		var fullscreen, isFullScreen = false;
		
		// Play/Pause Button
		fullscreen = document.createElement('li');
		fullscreen .className = '[ froogaloop fullscreen ]';
		fullscreen .textContent = 'Fullscreen';
		fullscreen .addEventListener('click', function(){
			if(!isFullScreen && Froogaloopelise.Utils.requestFulLScreen(wrapper))
				isFullScreen = wrapper;
			else if(isFullScreen && Froogaloopelise.Utils.exitFullScreen(wrapper)) 
				isFullScreen = false;
		});
		list.appendChild(fullscreen);
	
	});
	
	
	
	return wrapper;
}