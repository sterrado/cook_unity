// pages/cards/[id].tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  fetchCard,
  fetchCards,
  simulateBattle,
  getWeaknessesResistances,
} from "../../services/api";
import { Card } from "../../interfaces/Card";
import "./CardPage.css";

interface CardProps {
  card: Card;
}

export default function CardPage({ card }: CardProps) {
  const [battleResult, setBattleResult] = useState<{
    winner: Card;
    damage: number;
  } | null>(null);
  const [weaknessesResistances, setWeaknessesResistances] = useState<{
    weaknesses: Card[];
    resistances: Card[];
  } | null>(null);
  const [opponentCard, setOpponentCard] = useState<Card | null>(null);
  const [showWeaknessesResistances, setShowWeaknessesResistances] =
    useState(false);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchAllCards = async () => {
      try {
        const allCards = await fetchCards();
        setCards(allCards);
      } catch (error) {
        console.error("Failed to fetch cards:", error);
      }
    };

    fetchAllCards();
  }, []);

  const handleBattle = async () => {
    if (opponentCard) {
      try {
        const result = await simulateBattle(card.id, opponentCard.id);
        setBattleResult(result);
      } catch (error) {
        console.error("Failed to simulate battle:", error);
      }
    }
  };

  const handleWeaknessesResistances = async () => {
    if (!weaknessesResistances) {
      try {
        const result = await getWeaknessesResistances(card.id);
        setWeaknessesResistances(result);
      } catch (error) {
        console.error("Failed to fetch weaknesses and resistances:", error);
      }
    }
    setShowWeaknessesResistances(!showWeaknessesResistances);
  };

  const handleOpponentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCard = cards.find(
      (card) => card.id === parseInt(e.target.value, 10)
    );
    setOpponentCard(selectedCard || null);
  };

  const closeBattleModal = () => {
    setBattleResult(null);
  };
  return (
    <div className="container">
      <button className="backButton">
        <Link href="/">Back to Home</Link>
      </button>
      <h1 className="title">{card.name}</h1>
      <div className="cardDetails">
        <p>Type: {card.type}</p>
        <p>HP: {card.hp}</p>
        <p>Attack: {card.attack}</p>
        <p>Weakness: {card.weakness}</p>
        <p>Resistance: {card.resistance}</p>
      </div>
      <div>
        <label htmlFor="opponentCard">Select Opponent:</label>
        <select
          id="opponentCard"
          className="responsiveInput"
          value={opponentCard?.id || ""}
          onChange={handleOpponentChange}
        >
          <option value="">Select a card</option>
          {cards
            .filter((c) => c.id !== card.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      <button
        className="battleButton"
        onClick={handleBattle}
        disabled={!opponentCard}
      >
        Battle
      </button>
      <button
        className="weaknessesResistancesButton"
        onClick={handleWeaknessesResistances}
      >
        {showWeaknessesResistances ? "Hide" : "Show"} Weaknesses/Resistances
      </button>
      {showWeaknessesResistances && weaknessesResistances && (
        <div className="weaknessesResistances">
          <h2>Weaknesses</h2>
          <ul>
            {weaknessesResistances.weaknesses.map((card) => (
              <li key={card.id}>{card.name}</li>
            ))}
          </ul>
          <h2>Resistances</h2>
          <ul>
            {weaknessesResistances.resistances.map((card) => (
              <li key={card.id}>{card.name}</li>
            ))}
          </ul>
        </div>
      )}
      {battleResult && (
        <div className="modal">
          <div className="modalContent">
            <h2>Battle Result</h2>
            <p>Winner: {battleResult.winner.name}</p>
            <p>Damage: {battleResult.damage}</p>
            <button className="closeButton" onClick={closeBattleModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  try {
    console.log("Fetching card with ID:", params.id); // Log the ID being fetched
    const card = await fetchCard(parseInt(params.id, 10));
    console.log("Fetched card:", card); // Log the fetched card
    return {
      props: {
        card,
      },
    };
  } catch (error) {
    console.error("Failed to fetch card:", error);
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const cards = await fetchCards(); // Assuming this fetches all cards correctly
    const paths = cards.map((card) => ({
      params: { id: card.id.toString() },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error("Error fetching cards for paths:", error);
    return { paths: [], fallback: false };
  }
}
