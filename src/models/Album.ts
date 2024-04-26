export interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId?: string | null;
}

class Album {
  private id: string;
  private name: string;
  private year: number;
  private artistId: string;

  constructor(id: string, name: string, year: number, artistId: string = null) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }
}

export { Album };
