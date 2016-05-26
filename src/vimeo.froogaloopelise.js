var froogaloopelise = {};

froogaloopelise.init = function(query, callback){

	// Append the script and rerun the function
	if(!document.querySelector('script[src*="https://f.vimeocdn.com/js/froogaloop2.min.js"]')){
		
		var script 	= document.createElement('script');
		
		script.id	= 'froogaloopise-script';
		script.type = 'text/javascript';
		script.addEventListener('load', function(){ froogaloopelise.init(query, callback); }, false);
		script.src 	= 'https://f.vimeocdn.com/js/froogaloop2.min.js';
		
		document.head.appendChild(script);
		
		return;
	
	}
	
	var iframes = document.querySelectorAll(query || 'iframe[src*="vimeo"]');
		iframes = Array.prototype.slice.call(iframes);
	
	var wrappers = this.each(iframes, this.wrap, function(wrapper){
		froogaloopelise.playPause(wrapper);
		froogaloopelise.volume(wrapper);
		froogaloopelise.seek(wrapper);
		froogaloopelise.rewind(wrapper);
		froogaloopelise.fullscreen(wrapper);
		froogaloopelise.resizeable(wrapper);
		
		wrapper.querySelector('ul.controls').className = '[ froogaloopelise : controls ]';
		
		if(callback) callback(wrapper);
	});
	
	return wrappers;

}

froogaloopelise.id = (function(){ var id = 0; return function(prefix){
	id++; return (prefix || 'froogaloopelise-vimeo-') + id;
}})();

froogaloopelise.each = function(elements, func, callback){
	if(elements instanceof Array || elements.length){
		for(var i = 0; i < elements.length; i++)
			elements[i] = func(elements[i], callback);
	} else {
		return [func(wrapper, callback)];
	}
	return elements;
}

froogaloopelise.wrap = function(element, callback){
	var wrapper = document.createElement('div');
		wrapper.className = '[ froogaloopelise : wrapper ]';
		element.parentNode.insertBefore(wrapper, element);
	var controls = document.createElement('ul');
		controls.className = '[ froogaloopelise : controls : loading ]';
		wrapper.name = element.getAttribute('data-name') || froogaloopelise.id();
		element.src += '?player_id=' + wrapper.name;
		element.id = wrapper.name;
		wrapper.appendChild(element);
		wrapper.appendChild(controls);
		wrapper.froogaloop = $f(element);
		wrapper.froogaloop.addEvent('ready', function(id){
			wrapper.froogaloop.api('getDuration', function(v){ 
				wrapper.duration = v;
				if(callback) callback(wrapper);
			});
		});
	return wrapper;
}

froogaloopelise.playPause = function(element){
	
	var playPause = document.createElement('li');
		playPause.className = '[ froogaloopelise : controls : play-pause : paused ]';
		playPause.textContent = 'Play';
	
	var currentPlayState = false;
	
	playPause.addEventListener('click', function(event){
		event.preventDefault();
		element.froogaloop.api('paused', function(paused){
			if(paused) element.froogaloop.api('play');
			else element.froogaloop.api('pause');
		});
	});
	element.froogaloop.addEvent('play', function(){
		playPause.textContent = 'Pause';
		playPause.className = '[ froogaloopelise : controls : play-pause : playing ]';
	});
	element.froogaloop.addEvent('pause', function(){
		playPause.textContent = 'Play';
		playPause.className = '[ froogaloopelise : controls : play-pause : paused ]';
	});
	
	element.querySelector('ul.controls').appendChild(playPause);
	
}

froogaloopelise.rewind = function(element){
	
	var rewind = document.createElement('li');
		rewind.className = '[ froogaloopelise : controls : rewind ]';
		rewind.textContent = 'Rewind';
	
	rewind.addEventListener('click', function(event){
		event.preventDefault();
		element.froogaloop.api('seekTo', 0);
	});
	
	element.querySelector('ul.controls').appendChild(rewind);
	
}

froogaloopelise.seek = function(element){
	var seek = document.createElement('li');
		seek.className = '[ froogaloopelise : controls : seek ]';
	var scrub = document.createElement('span');
		scrub.className = '[ froogaloopelise : controls : seek-scrub ]';
	var duration = getFormattedTime(element.duration * 1000);
		scrub.textContent = '00:00 / ' + duration;
		scrub.style.width = 0;
		
	seek.appendChild(scrub);
	
	function getFormattedTime(milliSeconds){
		var hours = Math.floor(milliSeconds / (60 * 60 * 1000));
		var minutes = Math.floor((milliSeconds - hours * (60 * 60 * 1000)) / (60 * 1000));
		var seconds = Math.floor((milliSeconds - hours * (60 * 60 * 1000) - minutes * (60 * 1000)) / (1000));
		return 	(hours ? ('0000' + hours).slice(-4) + ':' : '') 
				+ ('00' + minutes).slice(-2) + ':' 
				+ ('00' + seconds).slice(-2);
	}
	
	element.froogaloop.addEvent('playProgress', function(data){
		scrub.style.width = (data.percent * 100) + '%';
		scrub.textContent = getFormattedTime(data.seconds * 1000) + ' / ' + duration;
	});
				
	var seeking = false;
	seek.addEventListener('mousedown', function(event){
		seeking = event.clientX;
	});
	document.addEventListener('mousemove', function(event){
		if(seeking !== false){
			seeking = event.pageX;
			var bb = seek.getBoundingClientRect();
			var where = (seeking - bb.left) / bb.width;
			scrub.style.width = (where * 100) + '%';
			element.froogaloop.api('seekTo', where * element.duration);
		}
	});
	document.addEventListener('mouseup', function(){
		if(seeking !== false){
			var bb = seek.getBoundingClientRect();
			var where = (seeking - bb.left) / bb.width;
			scrub.style.width = (where * 100) + '%';
			element.froogaloop.api('seekTo', where * element.duration);
			seeking = false;
		}
	});
	
	element.querySelector('ul.controls').appendChild(seek);
	
}

froogaloopelise.volume = function(element){
	
	var volume = document.createElement('li');
		volume.className = '[ froogaloopelise : controls : volume ]';
	var scrub = document.createElement('span');
		scrub.className = '[ froogaloopelise : controls : volume-scrub ]';
		scrub.textContent = 'Volume 5/10';
		scrub.style.width = '50%';
		volume.appendChild(scrub);
	
	element.froogaloop.api('setVolume', .5);
	
	function applyVolume(vol){
		scrub.textContent = 'Volume ' + vol * 10 + '/10';
		scrub.style.width = vol * 100 + '%';
		element.froogaloop.api('setVolume', vol);
	}
	
	var dragging = false;
	volume.addEventListener('mousedown', function(event){
		dragging = event.clientX;
	});
	document.addEventListener('mousemove', function(event){
		if(dragging !== false){
			dragging = event.pageX;
			var bb = volume.getBoundingClientRect();
			var vol = (dragging - bb.left) / bb.width;
			applyVolume(vol);
		}
	});
	document.addEventListener('mouseup', function(){
		if(dragging !== false){
			var bb = volume.getBoundingClientRect();
			var vol = (dragging - bb.left) / bb.width;
			applyVolume(vol);
			dragging = false;
		}
	});
	
	element.querySelector('ul.controls').appendChild(volume);
	
}



froogaloopelise.fullscreen = function(element){
	
	var fullScreen = document.createElement('li');
		fullScreen.className = '[ froogaloopelise : controls : fullscreen ]';
		fullScreen.textContent = 'Fullscreen';
	
	var fullScreenCancel = (
		document.exitFullscreen
		|| document.msExitFullscreen
		|| document.mozCancelFullScreen
		|| document.webkitExitFullscreen
		|| function(){ return false; }
	);
	
	var isFullScreen = false;
	
	fullScreen.addEventListener('click', function(event){
		event.preventDefault();
		if(isFullScreen) fullScreenCancel.call(document);
		else if(element.requestFullscreen){
			element.requestFullscreen();
		} else if(element.msRequestFullscreen){
			element.msRequestFullscreen();
		} else if(element.mozRequestFullScreen){
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen){
			element.webkitRequestFullscreen();
		}
	});
	
	['mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenchange'].forEach(function(event){
		element.addEventListener(event, function(){
			isFullScreen = !isFullScreen;
			element.className = isFullScreen
				? '[ froogaloopelise : wrapper : fullscreen ]'
				: '[ froogaloopelise : wrapper ]';
			fullScreen.textContent = isFullScreen
				? 'Exit Fullscreen'
				: 'Fullscreen';
			fullScreen.className = isFullScreen
				? '[ froogaloopelise : controls : fullscreen : exit ]'
				: '[ froogaloopelise : controls : fullscreen ]';
		}.bind(this), false)
	});
	
	element.querySelector('ul.controls').appendChild(fullScreen);
	
}

froogaloopelise.resizeable = function(element){
	
	element.style.height = element.clientWidth / 16 * 9 + 'px';
	
	window.addEventListener('resize', function(){
		element.style.height = element.clientWidth / 16 * 9 + 'px';
	}, false);
	
}