import { artistFilePath } from './ArtistController';
import { Request, Response, NextFunction } from 'express';
import { trackFilePath } from './TrackController';
import { albumFilePath } from './AlbumController';
const fs = require('fs');
const path = require('path');

export const favFilePath = path.join(__dirname, '../', '../', 'data', 'fav.json');

export const GetAllFavorites = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(favFilePath, 'utf8', async (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}

		const favs = JSON.parse(data);
		let favAlbums = [];
		let favTracks = [];
		let favArtists = [];
		const dataAlbum = await fs.promises.readFile(albumFilePath, 'utf8');
		const albums = JSON.parse(dataAlbum);
		albums.forEach((album) => {
			if (favs.albums.includes(album.id)) {
				favAlbums.push(album);
			}
		});

		const dataTracks = await fs.promises.readFile(trackFilePath, 'utf8');
		const tracks = JSON.parse(dataTracks);
		tracks.forEach((track) => {
			if (favs.tracks.includes(track.id)) {
				favTracks.push(track);
			}
		});

		const dataArtists = await fs.promises.readFile(artistFilePath, 'utf8');
		const artists = JSON.parse(dataArtists);
		artists.forEach((artist) => {
			if (favs.artists.includes(artist.id)) {
				favArtists.push(artist);
			}
		});

		return res.status(200).json({
			albums: favAlbums,
			tracks: favTracks,
			artists: favArtists,
		});
	});
};

export const AddTrackToFavorites = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(trackFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		let tracks = JSON.parse(data);
		const index = tracks.findIndex((track) => {
			return track.id == req.params.id;
		});
		if (index === -1) {
			return res.status(422).json({ message: 'ID track not valid' });
		}

		fs.readFile(favFilePath, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			let favs = JSON.parse(data);
			favs.tracks.push(req.params.id);
			fs.writeFile(favFilePath, JSON.stringify(favs, null, 4), (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'Internal server error' });
				}
				res.status(201).json({ message: 'Add successfully' });
			});
		});
	});
};

export const AddAlbumToFavorites = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(albumFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		let albums = JSON.parse(data);
		const index = albums.findIndex((album) => {
			return album.id == req.params.id;
		});
		if (index === -1) {
			return res.status(422).json({ message: 'ID album not valid' });
		}

		fs.readFile(favFilePath, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			let favs = JSON.parse(data);
			favs.albums.push(req.params.id);
			fs.writeFile(favFilePath, JSON.stringify(favs, null, 4), (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'Internal server error' });
				}
				res.status(201).json({ message: 'Add successfully' });
			});
		});
	});
};

export const AddArtistToFavorites = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(artistFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		let artists = JSON.parse(data);
		const index = artists.findIndex((artist) => {
			return artist.id == req.params.id;
		});
		if (index === -1) {
			return res.status(422).json({ message: 'ID artist not valid' });
		}

		fs.readFile(favFilePath, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			let favs = JSON.parse(data);
			favs.artists.push(req.params.id);
			fs.writeFile(favFilePath, JSON.stringify(favs, null, 4), (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'Internal server error' });
				}
				res.status(201).json({ message: 'Add successfully' });
			});
		});
	});
};

export const DeleteTrackFromFavorites = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(trackFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		let tracks = JSON.parse(data);
		const index = tracks.findIndex((track) => {
			return track.id == req.params.id;
		});
		if (index === -1) {
			return res.status(400).json({ message: 'ID track not valid' });
		}

		fs.readFile(favFilePath, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			let favs = JSON.parse(data);
			const indexTrack = favs.tracks.findIndex((id) => {
				return id == req.params.id;
			});
			if (indexTrack === -1) {
				return res.status(404).json({ message: 'ID is not in favorite' });
			}
			favs.tracks.splice(indexTrack, 1);
			fs.writeFile(favFilePath, JSON.stringify(favs, null, 4), (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'Internal server error' });
				}
				res.status(204).json({ message: 'Delete successfully' });
			});
		});
	});
};

export const DeleteAlbumFromFavorites = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(albumFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		let albums = JSON.parse(data);
		const index = albums.findIndex((album) => {
			return album.id == req.params.id;
		});
		if (index === -1) {
			return res.status(400).json({ message: 'ID album not valid' });
		}

		fs.readFile(favFilePath, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			let favs = JSON.parse(data);
			const indexAlbum = favs.albums.findIndex((id) => {
				return id == req.params.id;
			});
			if (indexAlbum === -1) {
				return res.status(404).json({ message: 'ID is not in favorite' });
			}
			favs.albums.splice(indexAlbum, 1);
			fs.writeFile(favFilePath, JSON.stringify(favs, null, 4), (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'Internal server error' });
				}
				res.status(204).json({ message: 'Delete successfully' });
			});
		});
	});
};

export const DeleteArtistFromFavorites = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	fs.readFile(artistFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		let artists = JSON.parse(data);
		const index = artists.findIndex((artist) => {
			return artist.id == req.params.id;
		});
		if (index === -1) {
			return res.status(400).json({ message: 'ID artist not valid' });
		}

		fs.readFile(favFilePath, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			let favs = JSON.parse(data);
			const indexArtist = favs.artists.findIndex((id) => {
				return id == req.params.id;
			});
			if (indexArtist === -1) {
				return res.status(404).json({ message: 'ID is not in favorite' });
			}
			favs.artists.splice(indexArtist, 1);
			fs.writeFile(favFilePath, JSON.stringify(favs, null, 4), (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'Internal server error' });
				}
				res.status(204).json({ message: 'Delete successfully' });
			});
		});
	});
};
