import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { User } from "../models/user.js";

const isValidBirthday = (birthday: unknown): birthday is string =>
  typeof birthday === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(birthday) &&
  !Number.isNaN(Date.parse(`${birthday}T00:00:00.000Z`)) &&
  new Date(`${birthday}T00:00:00.000Z`).toISOString().slice(0, 10) === birthday &&
  birthday <= new Date().toISOString().slice(0, 10);

const getAge = (birthday: string, today: string) => {
  const [birthYear, birthMonth, birthDay] = birthday.split("-").map(Number);
  const [year, month, day] = today.split("-").map(Number);
  return year - birthYear - (month < birthMonth || (month === birthMonth && day < birthDay) ? 1 : 0);
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const publicProfile = (user: User) => ({
  id: user.id,
  username: user.username,
  birthday: user.birthday,
  age: user.age,
});

export const getAccountProfile = async (req: Request, res: Response) => {
  const userId = req.User?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (user.birthday) {
      user.age = getAge(user.birthday, today);
      await user.save();
    }

    const isBirthday = user.birthday?.slice(5) === today.slice(5);
    let birthdayGreeting = false;
    if (isBirthday && user.lastBirthdayGreeting !== today) {
      const [updatedCount] = await User.update(
        { lastBirthdayGreeting: today },
        { where: { id: user.id, lastBirthdayGreeting: user.lastBirthdayGreeting } },
      );
      birthdayGreeting = updatedCount > 0;
      if (birthdayGreeting) {
        user.lastBirthdayGreeting = today;
      }
    }

    res.json({ user: publicProfile(user), birthdayGreeting });
  } catch (error) {
    console.error("Could not retrieve account profile:", error);
    res.status(500).json({ message: "Could not retrieve account settings" });
  }
};

export const updateAccountProfile = async (req: Request, res: Response) => {
  const userId = req.User?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { username, birthday, currentPassword, newPassword } =
    (req.body ?? {}) as Record<string, unknown>;
  if (!isNonEmptyString(username) || username.trim().length > 50) {
    res.status(400).json({ message: "Username must be between 1 and 50 characters." });
    return;
  }
  if (!isValidBirthday(birthday)) {
    res.status(400).json({ message: "Enter a valid birthday that is not in the future." });
    return;
  }

  const passwordChangeRequested = currentPassword !== undefined || newPassword !== undefined;
  const passwordChange = !passwordChangeRequested
    ? null
    : typeof currentPassword === "string" &&
        typeof newPassword === "string" &&
        newPassword.length >= 8 &&
        newPassword.length <= 128
      ? { currentPassword, newPassword }
      : undefined;
  if (passwordChange === undefined) {
    res.status(400).json({ message: "To change your password, enter your current password and a new password of at least 8 characters." });
    return;
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (passwordChange && !(await bcrypt.compare(passwordChange.currentPassword, user.password))) {
      res.status(400).json({ message: "Your current password is incorrect." });
      return;
    }

    user.username = username.trim();
    user.birthday = birthday;
    user.age = getAge(birthday, new Date().toISOString().slice(0, 10));
    if (passwordChange) {
      user.password = passwordChange.newPassword;
    }
    await user.save();

    res.json({ user: publicProfile(user) });
  } catch (error) {
    console.error("Could not update account settings:", error);
    res.status(400).json({ message: "Could not update account settings. The username may already be in use." });
  }
};
