import { Song } from "./types";
import { parseChordPro } from "./chordpro-parser";

// Norwegian children's songs in ChordPro format

const kuaMiChordPro = `
{title: Kua mi}
{artist: Tradisjonell}
{key: G}

{verse: Vers 1}
[G]Kua mi, eg [D]takkar deg
[D7]for mjølki du [G]gjev meg.
[G]Ho er så kvit, ho [D]er så fin,
ho [D7]lagar raude kin[G]ner.

{verse: Vers 2}
[G]Sauen min, eg [D]takkar deg
[D7]for ulla du [G]gjev meg.
[G]Ho er så fin, ho [D]held meg varm,
du [D7]mjuke, snille [G]sauen.
`;

const baeBaeLilleLamChordPro = `
{title: Bæ bæ lille lam}
{artist: Tradisjonell}
{key: C}

{verse: Vers 1}
[C]Bæ, bæ, [G]lille [C]lam,
har du noe [G]ull?
[C]Ja, ja, [G]kjære [C]barn,
jeg har [G]kroppen [C]full.

{verse: Vers 2}
[C]Søndags[G]kåpe [C]skal du få
og [G]nattlue [C]blå.
[C]Og så et [G]par små [C]votter
med [G]remse [C]på.
`;

const lillePetterEdderkoppChordPro = `
{title: Lille Petter Edderkopp}
{artist: Tradisjonell}
{key: D}

{verse: Vers 1}
[D]Lille Petter [A]Edderkopp
[A7]klatret opp i [D]taket.
[D]Så kom regnet, [A]skylte han ned,
[A7]ned i vanne[D]gransen.

{verse: Vers 2}
[D]Opp kom solen, [A]tørket ham opp,
[A7]så var han like [D]blansen.
[D]Lille Petter [A]Edderkopp
[A7]klatret opp i [D]taket.
`;

// Parse all songs from ChordPro format
const parsedSongs: Song[] = [
  parseChordPro(kuaMiChordPro, "kua-mi"),
  parseChordPro(baeBaeLilleLamChordPro, "bae-bae-lille-lam"),
  parseChordPro(lillePetterEdderkoppChordPro, "lille-petter-edderkopp"),
];

// Export songs as a map for easy lookup
export const songs: Map<string, Song> = new Map(
  parsedSongs.map((song) => [song.id, song])
);

// Export array of all songs for listing
export const songList: Song[] = parsedSongs;

// Helper function to get a song by ID
export function getSong(id: string): Song | undefined {
  return songs.get(id);
}

// Helper function to get all songs
export function getAllSongs(): Song[] {
  return songList;
}
