import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class userControllers {
  static async findAll(req: Request, res: Response) {
    try {
      const userService = new UserService();
      const users = await userService.list();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
  static async create(req: Request, res: Response) {
    try {
      const userService = new UserService();
      const user = await userService.create(req.body);

      res.status(201).json({
        user,
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
  static async update(req: Request, res: Response) {
    try {
      const userService = new UserService();
      const id = req.params.id
      const user = await userService.update(Number(id), req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const userService = new UserService();
      const user = await userService.findById(Number(req.params.id));
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

}