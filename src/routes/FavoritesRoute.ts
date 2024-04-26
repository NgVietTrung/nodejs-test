import express, { Request, Response, NextFunction } from "express";
import {
  GetAllFavorites,
  AddTrackToFavorites,
  AddAlbumToFavorites,
  AddArtistToFavorites,
  DeleteTrackFromFavorites,
  DeleteAlbumFromFavorites,
  DeleteArtistFromFavorites,
} from "../controllers";

const router = express.Router();

router.get("/", GetAllFavorites);

router.post("/track/:id", AddTrackToFavorites);
router.post("/album/:id", AddAlbumToFavorites);
router.post("/artist/:id", AddArtistToFavorites);

router.delete("/track/:id", DeleteTrackFromFavorites);
router.delete("/track/:id", DeleteAlbumFromFavorites);
router.delete("/artist/:id", DeleteArtistFromFavorites);

export { router as FavoritesRoute };
