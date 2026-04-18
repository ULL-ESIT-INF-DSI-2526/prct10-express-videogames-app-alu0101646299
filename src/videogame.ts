/**
 * Plataformas para los videojuegos
 */
export enum Platform {
  PC = "PC",
  PS5 = "PlayStation 5",
  XBOX = "Xbox Series X/S",
  SWITCH = "Nintendo Switch",
  DECK = "Steam Deck"
}

/**
 * Géneros para los videojuegos
 */
export enum Genre {
  ACTION = "Action",
  ADVENTURE = "Adventure",
  RPG = "Rol",
  STRATEGY = "Strategy",
  SPORTS = "Sports",
  SIMULATION = "Simulation"
}

/**
 * Estructura de un videojuego dentro de la colección
 */
export type Videogame = {
  id: number;
  name: string;
  description: string;
  platform: Platform;
  genre: Genre;
  developer: string;
  year: number;
  multiplayer: boolean;
  hours: number;
  value: number;
}