interface RadioResponse {
	videos: VideoList[];
	audios: AudioList[];
}

interface VideoList {
	id: string;
	name: string;
	seek: Number;
	category: string[];
}

interface AudioList {
	url: string;
}
