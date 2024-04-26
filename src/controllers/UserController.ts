import { Request, Response, NextFunction } from 'express';
import { CreateUserDto, UpdatePasswordDto } from '../dto';
import { IUser, User } from '../models';
import { GeneratePassword, ValidatePassword } from '../utility';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { v4 as uuid } from 'uuid';

const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../', '../', 'data', 'users.json');

export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
	const createUserInput = plainToClass(CreateUserDto, req.body);

	const validationError = await validate(createUserInput, {
		validationError: { target: true },
	});

	if (validationError.length > 0) {
		return res.status(400).json(validationError);
	}
	const { login, password } = createUserInput;

	fs.readFile(usersFilePath, 'utf8', async (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Internal server error' });
		}
		const users = JSON.parse(data);
		const index = users.findIndex((user) => user.login === login);
		if (index !== -1) {
			return res.status(404).json({ message: 'User already exist' });
		}

		const userPassword = await GeneratePassword(password);
		const version = '1';
		const id = uuid();

		const newUser = new User(
			id,
			login,
			userPassword,
			version,
			new Date().toUTCString(),
			new Date().toUTCString()
		);

		users.push(newUser);

		fs.writeFile(usersFilePath, JSON.stringify(users, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			res.status(201).json(newUser);
		});
	});
};

export const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(usersFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		res.status(200).json(JSON.parse(data));
	});
};

export const GetUserByID = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(usersFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}

		const users = JSON.parse(data);
		const index = users.findIndex((user) => user.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(users[index]);
	});
};

export const UpdateUserPassword = async (req: Request, res: Response, next: NextFunction) => {
	const userInput = plainToClass(UpdatePasswordDto, req.body);

	const validationError = await validate(userInput, {
		validationError: { target: true },
	});

	if (validationError.length > 0) {
		return res.status(400).json(validationError);
	}
	const { oldPassword, newPassword } = userInput;

	fs.readFile(usersFilePath, 'utf8', async (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		const users = JSON.parse(data);
		const index = users.findIndex((user) => user.id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ message: 'User not found' });
		}

		const user: IUser = users[index];
		const checkPassword: boolean = await ValidatePassword(oldPassword, user.password);
		if (!checkPassword) {
			return res.status(403).json({ message: 'Password not match' });
		}

		const password = await GeneratePassword(newPassword);
		user.password = password;
		user.version = `${+user.version + 1}`;
		user.updatedAt = new Date().toUTCString();

		users[index] = user;

		fs.writeFile(usersFilePath, JSON.stringify(users, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			res.status(201).json(user);
		});
	});
};

export const DeleteUser = async (req: Request, res: Response, next: NextFunction) => {
	fs.readFile(usersFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Internal server error' });
		}
		let users = JSON.parse(data);
		const userId: string = req.params.id;
		const index = users.findIndex((user: IUser) => user.id === userId);
		if (index === -1) {
			return res.status(404).json({ message: 'User not found' });
		}
		users.splice(index, 1);
		fs.writeFile(usersFilePath, JSON.stringify(users, null, 4), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal server error' });
			}
			return res.status(204).json({ message: 'User deleted successfully' });
		});
	});
};
