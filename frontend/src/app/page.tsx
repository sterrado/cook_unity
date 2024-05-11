// src/app/page.tsx
import Home from "@/pages/Home";
import { fetchCards } from "@/services/api";
import { Card } from "@/interfaces/Card";

interface HomePageProps {
  cards: Card[];
}

export default async function HomePage() {
  let cards: Card[] = [];
  try {
    cards = await fetchCards();
  } catch (error) {
    console.error('Failed to fetch cards:', error);
  }

  return <Home cards={cards} />;
}