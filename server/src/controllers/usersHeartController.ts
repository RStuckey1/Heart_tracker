import { Request, Response } from "express";
import { Heart } from '../models/heart.js';
import { User } from '../models/user.js';

declare global {
  namespace Express {
    interface Request {
      User?: { id: number; username: string }; // Ensure the type includes 'id'
    }
  }
}

export const getUserHeartData = async (_req: Request, res: Response) => {
  try {
    const UserId = _req.User?.id;

    if (!UserId) {
      res.status(400).json({ message: "unauthorized" });
      return; // Explicitly return
    }

    const HeartList = await Heart.findAll({
      where: { UserId: UserId },
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
    });

    res.json(HeartList);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createUserHeartData = async (req: Request, res: Response) => {
  const { date, time, systolic, diastolic, pulse, weight, UserId } = req.body;
  try {
    const newHeartData = await Heart.create({
      date,
      time,
      systolic,
      diastolic,
      pulse,
      weight,
      UserId,
    } as any);
    res.status(201).json(newHeartData);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const updateUserHeartData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, time, systolic, diastolic, pulse, weight } = req.body;
  try {
    const vehicle = await Heart.update(
      { date, time, systolic, diastolic, pulse, weight } as any,
      { where: { id } });
    if (Heart) {
      res.json({ message: "Heart data was updated successfully" });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUserHeart= async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const heart = await Heart.destroy({ where: { id } });
    if (heart) {
      res.json({ message: "Heart Data deleted successfully" });
    } else {
      res.status(404).json({ message: "data not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
