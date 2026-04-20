import { describe, test, expect } from "vitest";
import { difficulties, types, findQuestions } from '../src/ejercicio_modf/findQuestions'

describe("findQuestions", () => {
  test("findQuestions sin parámetros", () => {
    return findQuestions()
      .then((data) => {
        expect(data.success).toBe(true);
        expect(data.response_code).toBe(0);
      });
  });
  
  test("findQuestions con todos los parámetros", () => {
    return findQuestions(10, difficulties.EASY, types.BOOLEAN)
      .then((data) => {
        expect(data.success).toBe(true);
        expect(data.response_code).toBe(0);
        if (data.results) {
          expect(data.results[0].category).toBe(10);
          expect(data.results[0].difficulty).toBe(difficulties.EASY);
          expect(data.results[0].type).toBe(types.BOOLEAN);
        }
      });
  });

  test("findQuestions con 1 parámetro", () => {
    return findQuestions(10)
      .then((data) => {
        expect(data.success).toBe(true);
        expect(data.response_code).toBe(0);
        if (data.results) {
          expect(data.results[0].category).toBe(10);
        }
      });
  });

  test("findQuestions con 2 parámetros", () => {
    return findQuestions(10, difficulties.HARD)
      .then((data) => {
        expect(data.success).toBe(true);
        expect(data.response_code).toBe(0);
        if (data.results) {
          expect(data.results[0].category).toBe(10);
          expect(data.results[0].difficulty).toBe(difficulties.HARD);
        }
      });
  });

  test("findQuestions con parámetros incorrectos", () => {
    return findQuestions(1)
      .then((data) => {
        expect(data.success).toBe(false);
        expect(data.response_code).toBe(1);
        expect(data.errMsg).toBe('No results');
      });
  });
});