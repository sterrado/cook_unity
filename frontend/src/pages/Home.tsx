// pages/Home.tsx

"use client"; // This is a client component 👈🏽

import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { fetchCards } from "../services/api";
import { Card } from "../interfaces/Card";

const Container = styled.div`
  /* Add your styles for the container */
`;

const Title = styled.h1`
  /* Add your styles for the title */
`;

const SearchBar = styled.input`
  /* Add your styles for the search bar */
`;

const TypeFilter = styled.select`
  /* Add your styles for the type filter */
`;

const CardList = styled.ul`
  /* Add your styles for the card list */
`;

const CardItem = styled.li`
  /* Add your styles for the card item */
`;

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
    const nameMatch = card.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const typeMatch = selectedType === "" || card.type === selectedType;
    return nameMatch && typeMatch;
  });

  return (
    <Container>
      <Title>Pokemon Cards</Title>
      <SearchBar
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />
      <TypeFilter value={selectedType} onChange={handleTypeFilter}>
        <option value="">All Types</option>
        {/* Add options for each unique card type */}
        <option value="Fire">Fire</option>
        <option value="Water">Water</option>
        <option value="Electric">Electric</option>
        {/* Add more options as needed */}
      </TypeFilter>
      <CardList>
        {filteredCards.map((card) => (
          <CardItem key={card.id}>
            <Link href={`/cards/${card.id}`}>{card.name}</Link>
          </CardItem>
        ))}
      </CardList>
    </Container>
  );
}

export async function getStaticProps() {
  let cards: Card[] = [];
  try {
    cards = await fetchCards();
  } catch (error) {
    console.error("Failed to fetch cards:", error);
  }
  return {
    props: {
      cards,
    },
  };
}
