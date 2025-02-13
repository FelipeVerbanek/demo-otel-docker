import express from "express";
export const Router = express.Router();
import { orderControllers } from "../controllers/orderController";

Router.post("/order", orderControllers.create);
Router.get("/orders", orderControllers.findAll);
Router.get("/order/:id", orderControllers.findById);
Router.put("/order/:id", orderControllers.update);