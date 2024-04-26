import { Request, Response, NextFunction } from 'express';
import { CreateArtistDto, UpdateArtistDto } from '../dto';
import { Artist } from '../models';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { favFilePath } from './FavoritesRoute';

const fs = require('fs');
const path = require('path');

export const artistFilePath = path.join(__dirname, '../', '../', 'data', 'artist.json');

export const CreateNewArtist = async (req: Request, res: Response, next: NextFunction) => {
	const createArtistInput = plainToClass(CreateArtistDto, req.body);

	const validationError = await validate(createArtistInput, {
		validationError: { target: true },
	});

	if (validationError.length > 0) {
		return res.status(400).json(validationError);
	}
	const { name, grammy } = createArtistInput;

	fs.readFile(artistFilePath, 'utf8', async (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Internal server error' });
		}
		const artists = JSON.parse(data);
		const id = uuid();

		const newArtist = new Artist(id, name, grammy);

		artists.push(newArtist);

		fs.writeFile(artistFilePath, JSON.stringify(artists, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			res.status(201).json(newArtist);
		});
	});
};

export const GetAllArtists = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(artistFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		res.status(200).json(JSON.parse(data));
	});
};

export const GetArtistByID = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(artistFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}

		const artists = JSON.parse(data);
		const index = artists.findIndex((artist) => artist.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Artist not found' });
		}
		res.status(200).json(artists[index]);
	});
};

export const UpdateArtistInfo = async (req: Request, res: Response, next: NextFunction) => {
	const artistInput = plainToClass(UpdateArtistDto, req.body);

	const validationError = await validate(artistInput, {
		validationError: { target: true },
	});

	if (validationError.length > 0) {
		return res.status(400).json(validationError);
	}
	const { name, grammy } = artistInput;

	fs.readFile(artistFilePath, 'utf8', async (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		const artists = JSON.parse(data);
		const index = artists.findIndex((artist) => artist.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Artist not found' });
		}

		const artist = artists[index];

		artist.name = name;
		artist.grammy = grammy;

		artists[index] = artist;

		fs.writeFile(artistFilePath, JSON.stringify(artists, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			res.status(201).json(artist);
		});
	});
};

export const DeleteArtist = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(artistFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		let artists = JSON.parse(data);
		const artistId: string = req.params.id;
		const index = artists.findIndex((artist) => artist.id === artistId);
		if (index === -1) {
			return res.status(404).json({ message: 'Artist not found' });
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

		artists.splice(index, 1);
		fs.writeFile(artistFilePath, JSON.stringify(artists, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			return res.status(204).json({ message: 'Artist deleted successfully' });
		});
	});

	return res.status(204).json({ message: 'Artist deleted successfully' });
};
