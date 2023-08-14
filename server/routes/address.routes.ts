import express from "express";
import {
  createAddress,
  getAddressesByUserId,
} from "../controller/address.controller";

const addressRouter = express.Router();

addressRouter.post("/create", createAddress);

addressRouter.get("/locations/:userId", getAddressesByUserId);

export default addressRouter;
