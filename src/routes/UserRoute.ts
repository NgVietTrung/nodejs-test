import express from "express";
import {
  CreateUser,
  DeleteUser,
  GetUserByID,
  GetAllUsers,
  UpdateUserPassword,
} from "../controllers";

const router = express.Router();

router.get("/", GetAllUsers);
router.get("/:id", GetUserByID);

router.post("", CreateUser);

router.put("/:id", UpdateUserPassword);
router.delete("/:id", DeleteUser);

export { router as UserRoute };
