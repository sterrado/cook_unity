// pages/Home.tsx
"use client"; // This is a client component 👈🏽
import React, { useState } from "react";
import Link from "next/link";
import { Card } from "../interfaces/Card";
import "./Home.css";

interface HomeProps {
  cards: Card[];
}

export default function Home({ cards }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const filteredCards = cards.filter((card) => {
    const nameMatch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = selectedType === "" || card.type === selectedType;
    return nameMatch && typeMatch;
  });

  return (
    <div className="container">
      <h1 className="title">Pokemon Cards</h1>
      <div className="search-and-filter-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <select
          value={selectedType}
          onChange={handleTypeFilter}
          className="type-filter"
        >
          <option value="">All Types</option>
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Electric">Electric</option>
          <option value="Grass">Grass</option>
          <option value="Ghost">Ghost</option>
          <option value="Psychic">Psychic</option>
          <option value="Fighting">Fighting</option>
          <option value="Dragon">Dragon</option>
          <option value="Normal">Normal</option>
        </select>
      </div>
      <ul className="card-list">
        {filteredCards.map((card) => (
          <li key={card.id} className="card-item">
            <Link href={`/cards/${card.id}`}>
              <div className="card">
                <div className="card-header">
                  <h2>{card.name}</h2>
                  <p>Type: {card.type}</p>
                </div>
                <div className="card-body">
                  <p>HP: {card.hp}</p>
                  <p>Attack: {card.attack}</p>
                  <p>Weakness: {card.weakness}</p>
                  <p>Resistance: {card.resistance}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}