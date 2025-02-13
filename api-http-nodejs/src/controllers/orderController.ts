import { Request, Response } from "express";
import { OrderService } from "../services/orderService";

export class orderControllers {
  static async findAll(req: Request, res: Response) {
    try {
      const orderService = new OrderService()
      const orders = await orderService.list()
      res.status(200).json(orders)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const orderService = new OrderService()
      const order = await orderService.create(req.body)


      res.status(201).json({
        order,
      })
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const orderService = new OrderService()
      const id = req.params.id
      const order = await orderService.update(Number(id), req.body.status)
      res.status(200).json(order)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const orderService = new OrderService()
      const order = await orderService.findById(Number(req.params.id))
      res.status(200).json(order)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }
}