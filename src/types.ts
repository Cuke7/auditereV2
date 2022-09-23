export type Playlist = {
    name: string;
    playlist: Song[];
}

export type Song = {
    title: string;
    artwork: string;
    videoId: string;
    artist: string;
}