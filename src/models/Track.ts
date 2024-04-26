export interface ITrack {
  id: string;
  name: string;
  artistId?: string | null;
  albumId?: string | null;
  duration: number;
}

class Track {
  private id: string;
  private name: string;
  private artistId: string | null;
  private albumId: string | null;
  private duration: number;

  constructor(
    id: string,
    name: string,
    artistId: string = null,
    albumId: string = null,
    duration: number
  ) {
    this.id = id;
    this.name = name;
    this.artistId = artistId;
    this.albumId = albumId;
    this.duration = duration;
  }
}

export { Track };
