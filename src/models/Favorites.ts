export interface IFavorites {
	artists: string[];
	albums: string[];
	tracks: string[];
}

class Favorites {
	private artists: string[];
	private albums: string[];
	private tracks: string[];

	constructor(artists: string[], albums: string[], tracks: string[]) {
		this.artists = artists;
		this.albums = albums;
		this.tracks = tracks;
	}
}

export { Favorites };
