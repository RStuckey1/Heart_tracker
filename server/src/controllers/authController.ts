import { type Request, type Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const isValidBirthday = (birthday: unknown): birthday is string =>
  typeof birthday === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(birthday) &&
  !Number.isNaN(Date.parse(`${birthday}T00:00:00.000Z`)) &&
  new Date(`${birthday}T00:00:00.000Z`).toISOString().slice(0, 10) === birthday &&
  birthday <= new Date().toISOString().slice(0, 10);

const getAge = (birthday: string, today = new Date().toISOString().slice(0, 10)) => {
  const [birthYear, birthMonth, birthDay] = birthday.split("-").map(Number);
  const [year, month, day] = today.split("-").map(Number);
  return year - birthYear - (month < birthMonth || (month === birthMonth && day < birthDay) ? 1 : 0);
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: { username },
  });

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const secretKey = process.env.JWT_SECRET_KEY || '';

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1d' });
  
  return res.json({ token });
};

export const createUser = async (req: Request, res: Response) => {
  const { username, email, first_name, last_name, birthday, password } = req.body;
  try {
    if (!isValidBirthday(birthday)) {
      return res.status(400).json({ message: 'Enter a valid birthday that is not in the future.' });
    }

    const newUser = await User.create({
      username,
      email,
      first_name,
      last_name,
      age: getAge(birthday),
      birthday,
      password,
    });
    const secretKey = process.env.JWT_SECRET_KEY || '';

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, secretKey, { expiresIn: '1d' });
  
    return res.json({ token });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};