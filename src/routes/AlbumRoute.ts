import express, { Request, Response, NextFunction } from "express";
import {
  GetAllAlbum,
  GetAlbumByID,
  CreateNewAlbum,
  UpdateAlbumInfo,
  DeleteAlbum,
} from "../controllers";

const router = express.Router();

router.get("/", GetAllAlbum);
router.get("/:id", GetAlbumByID);

router.post("/", CreateNewAlbum);

router.put("/:id", UpdateAlbumInfo);
router.delete("/:id", DeleteAlbum);

export { router as AlbumRoute };
