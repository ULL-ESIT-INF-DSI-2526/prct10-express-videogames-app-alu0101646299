import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { Platform, Genre } from "../src/videogame.js";
import { Server } from "http";
import { app } from "../src/server.js"
import axios from "axios";

const url = "http://localhost:3000/videogames";
let server: Server;

test("Los enums de Videogame contienen los valores correctos", () => {
  expect(Platform.PC).toBe("PC");
  expect(Genre.ACTION).toBe("Action");
});

describe("gameCollection http", () => {

  beforeAll(() => {
    server = app.listen(3000);
  });

  afterAll(() => {
    server.close();
  });

  const testUser = "testuser";
  const testGame = {
    id: 999,
    name: "Juego de Prueba",
    description: "test",
    platform: "PC",
    genre: "Acción",
    developer: "Vitest",
    year: 2024,
    multiplayer: false,
    hours: 10,
    value: 0
  };

  test("GET debería avisar si la colección de un usuario está vacía", () => {
    return axios.get(`${url}?user=${testUser}`)
      .then((response) => {
        expect(response.data.success).toBe(false);
        expect(response.data.message).toContain("is empty");
      });
  });
  
  test("POST debería fallar si falta el body", () => {
    return axios.post(url, {}).then((response) => {
      expect(response.data.error).toBe("A user and a videogame must be provided");
    });
  });

  test("POST debería añadir un videojuego correctamente", () => {
    return axios.post(url, { user: testUser, videogame: testGame })
      .then((response) => {
        expect(response.data.success).toBe(true);
        expect(response.data.message).toContain("New videogame added");
      });
  });

  test("POST debería fallar al intentar añadir un juego que ya existe", () => {
    return axios.post(url, { user: testUser, videogame: testGame })
      .then((response) => {
        expect(response.data.success).toBe(false);
        expect(response.data.message).toContain("already exists");
      });
  });

  test("GET debería fallar si no se proporciona un usuario", () => {
    return axios.get(url).then((response) => {
      expect(response.data.error).toBe("A user must be provided");
    });
  });

  test("GET debería obtener la información de un juego concreto por su ID", () => {
    return axios.get(`${url}?user=${testUser}&id=${testGame.id}`)
      .then((response) => {
        expect(response.data.success).toBe(true);
        expect(response.data.videogames[0].name).toBe("Juego de Prueba");
      });
  });

  test("GET debería listar todos los juegos del usuario si no se da ID", () => {
    return axios.get(`${url}?user=${testUser}`)
      .then((response) => {
        expect(response.data.success).toBe(true);
        expect(response.data.videogames.length).toBeGreaterThan(0);
      });
  });

  test("PATCH debería fallar si falta el body", () => {
    return axios.patch(url, {}).then((response) => {
      expect(response.data.error).toContain("must be provided");
    });
  });

  test("PATCH debería modificar un videojuego existente", () => {
    const updatedGame = { ...testGame, hours: 200 }; 
    return axios.patch(url, { user: testUser, videogame: updatedGame })
      .then((response) => {
        expect(response.data.success).toBe(true);
        expect(response.data.message).toContain("updated");
      });
  });

  test("PATCH debería fallar si se intenta modificar un juego que no existe", () => {
    const game = { ...testGame, id: 99999 };
    return axios.patch(url, { user: testUser, videogame: game })
      .then((response) => {
        expect(response.data.success).toBe(false);
      });
  });

  test("DELETE debería eliminar el videojuego creado", () => {
    return axios.delete(`${url}?user=${testUser}&id=${testGame.id}`)
      .then((response) => {
        expect(response.data.success).toBe(true);
      });
  });

  test("DELETE debería fallar si no se proporciona el ID", () => {
    return axios.delete(`${url}?user=${testUser}`)
      .then((response) => {
        expect(response.data.error).toContain("id must be provided");
      });
  });

  test("DELETE debería fallar si el juego no existe", () => {
    return axios.delete(`${url}?user=${testUser}&id=99999`)
      .then((response) => {
        expect(response.data.success).toBe(false);
        expect(response.data.message).toContain("not found");
      });
  });
});