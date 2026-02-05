import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSong, getAllSongs } from "@/lib/songs";
import { SongView } from "@/components/SongView";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static pages for all songs at build time
export async function generateStaticParams() {
  const songs = getAllSongs();
  return songs.map((song) => ({
    id: song.id,
  }));
}

// Generate metadata for each song page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const song = getSong(id);

  if (!song) {
    return {
      title: "Sang ikke funnet",
    };
  }

  const description = song.artist
    ? `Gitarakkorder for "${song.title}" av ${song.artist}. Gratis sangbok med akkorddiagrammer.`
    : `Gitarakkorder for "${song.title}". Gratis sangbok med akkorddiagrammer.`;

  return {
    title: `${song.title} - Akkorder og tekst`,
    description,
    openGraph: {
      title: `${song.title} - Akkorder`,
      description,
      type: "article",
    },
  };
}

export default async function SongPage({ params }: PageProps) {
  const { id } = await params;
  const song = getSong(id);

  if (!song) {
    notFound();
  }

  return <SongView song={song} />;
}
