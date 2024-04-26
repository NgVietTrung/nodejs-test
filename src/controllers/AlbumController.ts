import { Request, Response, NextFunction } from 'express';
import { Album } from '../models';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { CreateAlbumDto, UpdateAlbumDto } from '../dto';
import { favFilePath } from './FavoritesRoute';
const fs = require('fs');
const path = require('path');

export const albumFilePath = path.join(__dirname, '../', '../', 'data', 'album.json');

export const CreateNewAlbum = async (req: Request, res: Response, next: NextFunction) => {
	const createAlbumInput = plainToClass(CreateAlbumDto, req.body);

	const validationError = await validate(createAlbumInput, {
		validationError: { target: true },
	});

	if (validationError.length > 0) {
		return res.status(400).json(validationError);
	}
	const { name, year, artistId = null } = createAlbumInput;

	fs.readFile(albumFilePath, 'utf8', async (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Internal server error' });
		}
		const albums = JSON.parse(data);
		const id = uuid();

		const newAlbum = new Album(id, name, year, artistId);

		albums.push(newAlbum);

		fs.writeFile(albumFilePath, JSON.stringify(albums, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			res.status(201).json(newAlbum);
		});
	});
};

export const GetAllAlbum = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(albumFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		res.status(200).json(JSON.parse(data));
	});
};

export const GetAlbumByID = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(albumFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}

		const albums = JSON.parse(data);
		const index = albums.findIndex((album) => album.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Album not found' });
		}
		res.status(200).json(albums[index]);
	});
};

export const UpdateAlbumInfo = async (req: Request, res: Response, next: NextFunction) => {
	const albumInput = plainToClass(UpdateAlbumDto, req.body);

	const validationError = await validate(albumInput, {
		validationError: { target: true },
	});

	if (validationError.length > 0) {
		return res.status(400).json(validationError);
	}
	const { name, year, artistId = null } = albumInput;

	fs.readFile(albumFilePath, 'utf8', async (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		const albums = JSON.parse(data);
		const index = albums.findIndex((album) => album.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'Album not found' });
		}

		const album = albums[index];

		album.name = name;
		album.year = year;
		album.artistId = artistId;

		albums[index] = album;

		fs.writeFile(albumFilePath, JSON.stringify(albums, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			res.status(201).json(album);
		});
	});
};

export const DeleteAlbum = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(albumFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		let albums = JSON.parse(data);
		const albumId: string = req.params.id;
		const index = albums.findIndex((album) => album.id === albumId);
		if (index === -1) {
			return res.status(404).json({ message: 'Album not found' });
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
				return;
			}
			favs.albums.splice(indexAlbum, 1);
			fs.writeFile(favFilePath, JSON.stringify(favs, null, 4), (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'Internal server error' });
				}
			});
		});

		albums.splice(index, 1);
		fs.writeFile(albumFilePath, JSON.stringify(albums, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			return res.status(204).json({ message: 'Album deleted successfully' });
		});
	});

	return res.status(204).json({ message: 'Album deleted successfully' });
};
