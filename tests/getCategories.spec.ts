import { describe, test, expect } from "vitest";
import { getCategories } from '../src/ejercicio_modf/getCategories'

describe("getCategories", () => {
  test("getCategories", () => {
    return getCategories()
      .then((data) => {
        expect(data.success).toBe(true);
        expect(data.message).not.toBeUndefined();
      });
  });
});