import express from "express";
import {
  GetAllArtists,
  GetArtistByID,
  CreateNewArtist,
  UpdateArtistInfo,
  DeleteArtist,
} from "../controllers";

const router = express.Router();

router.get("/", GetAllArtists);
router.get("/:id", GetArtistByID);

router.post("/", CreateNewArtist);

router.put("/:id", UpdateArtistInfo);
router.delete("/:id", DeleteArtist);

export { router as ArtistRoute };
