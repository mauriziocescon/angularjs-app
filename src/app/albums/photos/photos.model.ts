export class Photo {
  public albumId: number;
  public id: number;
  public title: string;
  public url: string;
  public thumbnailUrl: string;

  constructor(albumId: number, id: number, title: string, url: string, thumbnailUrl: string) {
    this.albumId = albumId;
    this.id = id;
    this.title = title;
    this.url = url;
    this.thumbnailUrl = thumbnailUrl;
  }
}
