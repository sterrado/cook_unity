import axios from "axios";
import { Card } from "../interfaces/Card";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Only run this code client-side
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
}

export const login = async (
  username: string,
  password: string
): Promise<void> => {
  if (typeof window !== "undefined") {
    // Ensure this runs only in the browser
    try {
      const response = await api.post("/login", { username, password });
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid credentials: " + error.message);
      } else {
        throw new Error("Invalid credentials");
      }
    }
  }
};

// Keep the remaining API functions as is
export const fetchCards = async (): Promise<Card[]> => {
  try {
    const response = await api.get<Card[]>("/cards");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cards:", error);

    // Check if error is an instance of Error
    if (error instanceof Error) {
      throw new Error("Failed to fetch cards: " + error.message); // Access message safely
    } else {
      throw new Error("Failed to fetch cards: An unknown error occurred");
    }
  }
};

export const fetchCard = async (id: number): Promise<Card> => {
  try {
    const response = await api.get<Card>(`/cards/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch card with ID ${id}`);
  }
};

export const createCard = async (card: Omit<Card, "id">): Promise<Card> => {
  try {
    const response = await api.post<Card>("/cards", card);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create card");
  }
};

export const updateCard = async (
  id: number,
  card: Partial<Card>
): Promise<Card> => {
  try {
    const response = await api.put<Card>(`/cards/${id}`, card);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update card with ID ${id}`);
  }
};

export const deleteCard = async (id: number): Promise<void> => {
  try {
    await api.delete(`/cards/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete card with ID ${id}`);
  }
};

export const simulateBattle = async (
  attackerId: number,
  defenderId: number
): Promise<{ winner: Card; damage: number }> => {
  try {
    const response = await api.get<{ winner: Card; damage: number }>(
      `/cards/${attackerId}/battle/${defenderId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to simulate battle");
  }
};

export const getWeaknessesResistances = async (
  cardId: number
): Promise<{ weaknesses: Card[]; resistances: Card[] }> => {
  try {
    const response = await api.get<{ weaknesses: Card[]; resistances: Card[] }>(
      `/cards/${cardId}/weaknesses-resistances`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get weaknesses and resistances for card with ID ${cardId}`
    );
  }
};
