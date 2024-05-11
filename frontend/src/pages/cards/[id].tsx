// pages/cards/[id].tsx
import React, { useState } from "react";
import styled from "styled-components";
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
  const [defenderId, setDefenderId] = useState<number | null>(null);

  const handleBattle = async () => {
    if (defenderId) {
      try {
        const result = await simulateBattle(card.id, defenderId);
        setBattleResult(result);
      } catch (error) {
        console.error("Failed to simulate battle:", error);
      }
    }
  };

  const handleWeaknessesResistances = async () => {
    try {
      const result = await getWeaknessesResistances(card.id);
      setWeaknessesResistances(result);
    } catch (error) {
      console.error("Failed to fetch weaknesses and resistances:", error);
    }
  };
  const handleDefenderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefenderId(parseInt(e.target.value, 10));
  };

  return (
    <div className="container">
      <button className="backButton">
        <Link href="/">
          Back to Home
        </Link>
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
        <label htmlFor="defenderId">Defender Card ID:</label>
        <input
          type="number"
          id="defenderId"
          className="responsiveInput"
          value={defenderId || ""}
          onChange={handleDefenderIdChange}
        />
      </div>
      <button
        className="battleButton"
        onClick={handleBattle}
        disabled={!defenderId}
      >
        Battle
      </button>
      <button
        className="weaknessesResistancesButton"
        onClick={handleWeaknessesResistances}
      >
        Show Weaknesses/Resistances
      </button>
      {battleResult && (
        <div>
          <h2>Battle Result</h2>
          <p>Winner: {battleResult.winner.name}</p>
          <p>Damage: {battleResult.damage}</p>
        </div>
      )}
      {weaknessesResistances && (
        <div>
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
