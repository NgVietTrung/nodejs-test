import { CreateTrackDto, UpdateTrackDto } from './../dto';
import { Request, Response, NextFunction } from 'express';
import { Track } from '../models';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { favFilePath } from './FavoritesRoute';
const fs = require('fs');
const path = require('path');

export const trackFilePath = path.join(__dirname, '../', '../', 'data', 'track.json');

export const CreateNewTrack = async (req: Request, res: Response, next: NextFunction) => {
	const createTrackInput = plainToClass(CreateTrackDto, req.body);

	const validationError = await validate(createTrackInput, {
		validationError: { target: true },
	});

	if (validationError.length > 0) {
		return res.status(400).json(validationError);
	}
	const { name, duration, artistId = null, albumId = null } = createTrackInput;

	fs.readFile(trackFilePath, 'utf8', async (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Internal server error' });
		}
		const tracks = JSON.parse(data);
		const id = uuid();

		const newTrack = new Track(id, name, artistId, albumId, duration);

		tracks.push(newTrack);

		fs.writeFile(trackFilePath, JSON.stringify(tracks, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			res.status(201).json(newTrack);
		});
	});
};

export const GetAllTrack = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(trackFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		res.status(200).json(JSON.parse(data));
	});
};

export const GetTrackByID = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(trackFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}

		const tracks = JSON.parse(data);
		const index = tracks.findIndex((track) => track.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Track not found' });
		}
		res.status(200).json(tracks[index]);
	});
};

export const UpdateTrackByID = async (req: Request, res: Response, next: NextFunction) => {
	const trackInput = plainToClass(UpdateTrackDto, req.body);

	const validationError = await validate(trackInput, {
		validationError: { target: true },
	});

	if (validationError.length > 0) {
		return res.status(400).json(validationError);
	}
	const { name, duration, artistId = null, albumId = null } = trackInput;

	fs.readFile(trackFilePath, 'utf8', async (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		const tracks = JSON.parse(data);
		const index = tracks.findIndex((track) => track.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Track not found' });
		}

		const track = tracks[index];

		track.name = name;
		track.duration = duration;
		track.artistId = artistId;
		track.albumId = albumId;

		tracks[index] = track;

		fs.writeFile(trackFilePath, JSON.stringify(tracks, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			res.status(201).json(track);
		});
	});
};

export const DeleteTrackByID = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(trackFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		let tracks = JSON.parse(data);
		const trackId: string = req.params.id;
		const index = tracks.findIndex((track) => track.id === trackId);
		if (index === -1) {
			return res.status(404).json({ message: 'Track not found' });
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

		tracks.splice(index, 1);
		fs.writeFile(trackFilePath, JSON.stringify(tracks, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			return res.status(204).json({ message: 'Track deleted successfully' });
		});
	});

	return res.status(204).json({ message: 'Track deleted successfully' });
};
