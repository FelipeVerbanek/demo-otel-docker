import express from "express";
export const Router = express.Router();
import { userControllers } from "../controllers/userController";

Router.post("/signin", userControllers.create);
Router.get("/users", userControllers.findAll);
Router.get("/user/:id", userControllers.findById);
Router.put("/user/:id", userControllers.update);