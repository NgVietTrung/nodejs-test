export interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
}

class Artist {
  private id: string;
  private name: string;
  private grammy: boolean;

  constructor(id: string, name: string, grammy: boolean) {
    this.id = id;
    this.name = name;
    this.grammy = grammy;
  }
}

export { Artist };
