'use strict';
var videoList = [],
	playList = [];

let currentSongIndex = 0;
let player;
let currentState;
window.addEventListener('load', function() {
	const url = 'https://localhost/playlist';
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.responseType = 'json';
	xhr.onload = () => init(xhr.response.videos);
	xhr.send();
});

const changeSong = (songIndex) => {
	const song = videoList[songIndex];
	player.loadVideoById(song.id);
};

const playOrPause = () => {
	if (currentState === 'Playing') {
		player.pauseVideo();
	} else if (currentState === 'Paused') {
		player.playVideo();
	}
};

const muteVideo = () => {
	const icon = document.querySelector('#bsp-volume>span');
	if (player.isMuted()) {
		icon.textContent = 'volume_up';
		player.unMute();
		control.volumeSet(control.lastVolume);
	} else {
		icon.textContent = 'volume_off';
		control.volumeSet(0);
		player.mute();
	}
};

const setVolume = (value) => {
	const volume = player.getVolume();
	player.setVolume(value * 100);
	return volume;
};

function init(playlist) {
	playList = playlist;
	videoList = playList.map(() => true);
	const prevBtn = document.getElementById('prev-btn');
	const playBtn = document.getElementById('play-btn');
	const nextBtn = document.getElementById('next-btn');
	const playIcon = playBtn.getElementsByTagName('span')[0];

	prevBtn.addEventListener(
		'click',
		() => {
			currentSongIndex = --currentSongIndex < 0 ? videoList.length - 1 : currentSongIndex;
			changeSong(currentSongIndex);
		},
		false
	);

	nextBtn.addEventListener(
		'click',
		() => {
			currentSongIndex = ++currentSongIndex >= videoList.length ? 0 : currentSongIndex;
			changeSong(currentSongIndex);
		},
		false
	);

	playBtn.addEventListener('click', playOrPause, false);

	var tag = document.createElement('script');

	tag.src = 'https://www.youtube.com/iframe_api';
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
		player = new YT.Player('player', {
			videoId: videoList[0].id,
			playerVars: {
				controls: 0,
				autoplay: 1,
				disablekb: 1,
				enablejsapi: 1,
				iv_load_policy: 0,
				modestbranding: 1,
				showinfo: 0,
				rel: 0,
				theme: 'light'
			},
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange
			}
		});
	};
	function onPlayerReady(event) {
		event.target.playVideo();
	}

	function onPlayerStateChange(event) {
		if (event.data == YT.PlayerState.ENDED) {
			currentState = 'Ended';
			nextBtn.click();
		} else if (event.data == YT.PlayerState.PLAYING) {
			currentState = 'Playing';
			playIcon.textContent = 'pause';
			control.volumeSet(player.getVolume());
		} else if (event.data == YT.PlayerState.PAUSED) {
			currentState = 'Paused';
			playIcon.textContent = 'play_arrow';
		} else if (event.data == YT.PlayerState.BUFFERING) {
			currentState = 'Buffering';
			playIcon.textContent = 'play_arrow';
		} else if (event.data == YT.PlayerState.CUED) {
			currentState = 'Cued';
		} else {
			currentState = 'Unknown';
		}
	}

	var VolumeControl, control, getElementPercentage;

	getElementPercentage = function(click, elm) {
		var rect;
		rect = elm.getBoundingClientRect();
		return (click.pageX - rect.left) / rect.width * 100;
	};

	VolumeControl = class VolumeControl {
		constructor() {
			this.volumeHoverIn = this.volumeHoverIn.bind(this);
			this.volumeHoverOut = this.volumeHoverOut.bind(this);
			this.volumeClick = this.volumeClick.bind(this);
			this.volumeDrag = this.volumeDrag.bind(this);
			this.volumeMoveHandler = this.volumeMoveHandler.bind(this);
			this.volumeStopHandler = this.volumeStopHandler.bind(this);
			this.volumeMute = this.volumeMute.bind(this);
			this.elm = {
				volumeWrap: document.getElementsByClassName('bsp-volume-wrap')[0],
				volumeSlider: document.getElementsByClassName('bsp-volume-slider')[0],
				volumeProgress: document.getElementsByClassName('bsp-volume-slider-progress')[0]
			};

			this.elm.volumeWrap.addEventListener('mouseenter', this.volumeHoverIn);
			this.elm.volumeWrap.addEventListener('mouseleave', this.volumeHoverOut);
			this.elm.volumeSlider.addEventListener('click', this.volumeClick);
			this.elm.volumeSlider.addEventListener('mousedown', this.volumeDrag);
			document.getElementById('bsp-volume').addEventListener('click', this.volumeMute);
		}

		volumeHoverIn(e) {
			if (this.volumeHoverTimout) {
				clearTimeout(this.volumeHoverTimout);
			}
			return this.elm.volumeWrap.classList.add('bsp-volume-show');
		}

		volumeHoverOut(e) {
			return (this.volumeHoverTimout = setTimeout(() => {
				return this.elm.volumeWrap.classList.remove('bsp-volume-show');
			}, 300));
		}

		volumeClick(e) {
			var percent;
			percent = getElementPercentage(e, this.elm.volumeSlider);
			return this.volumeSet(percent);
		}

		volumeSet(percent) {
			this.elm.volumeProgress.style.width = percent + '%';
			this.lastVolume = setVolume(percent / 100);
		}

		volumeDrag(e) {
			e.preventDefault();
			document.addEventListener('mousemove', this.volumeMoveHandler);
			return document.addEventListener('mouseup', this.volumeStopHandler);
		}

		volumeMoveHandler(e) {
			var percent;
			percent = getElementPercentage(e, this.elm.volumeSlider);
			if (percent < 0) {
				percent = 0;
			} else if (percent > 100) {
				percent = 100;
			}
			return this.volumeSet(percent);
		}

		volumeStopHandler(e) {
			document.removeEventListener('mousemove', this.volumeMoveHandler);
			return document.removeEventListener('mouseup', this.volumeStopHandler);
		}

		volumeMute() {
			muteVideo();
		}
	};

	control = new VolumeControl();
}

function changePlaylist(category) {
	videoList = platList.filter((v) => v.category.indexOf(category) !== -1);
	player.loadVideoById(videoList[0].id);
}
