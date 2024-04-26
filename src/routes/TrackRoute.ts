import express from "express";
import {
  GetAllTrack,
  GetTrackByID,
  CreateNewTrack,
  UpdateTrackByID,
  DeleteTrackByID,
} from "../controllers";

const router = express.Router();

router.get("/", GetAllTrack);
router.get("/:id", GetTrackByID);

router.post("/", CreateNewTrack);

router.put("/:id", UpdateTrackByID);
router.delete("/:id", DeleteTrackByID);

export { router as TrackRoute };
