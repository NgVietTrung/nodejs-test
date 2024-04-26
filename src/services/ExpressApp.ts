import express, { Application } from "express";

import {
  UserRoute,
  AlbumRoute,
  ArtistRoute,
  TrackRoute,
  FavoritesRoute,
} from "../routes";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(express.json());

  app.use("/user", UserRoute);
  app.use("/track", TrackRoute);
  app.use("/artist", ArtistRoute);
  app.use("/album", AlbumRoute);
  app.use("/favs", FavoritesRoute);

  return app;
};
