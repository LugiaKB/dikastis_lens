import { describe, it, expect } from "vitest";
import { SemesterHelper } from "@/utils/semester";

describe("SemesterHelper.format", () => {
  it('formata "2025.2" para "2025-2"', () => {
    expect(SemesterHelper.format("2025.2")).toBe("2025-2");
  });

  it('formata "2024.1" para "2024-1"', () => {
    expect(SemesterHelper.format("2024.1")).toBe("2024-1");
  });

  it('formata "2000.1" para "2000-1"', () => {
    expect(SemesterHelper.format("2000.1")).toBe("2000-1");
  });

  it("lança erro para ano abreviado", () => {
    expect(() => SemesterHelper.format("25.2")).toThrow();
  });

  it("lança erro quando falta o ponto separador", () => {
    expect(() => SemesterHelper.format("2025")).toThrow();
  });

  it("lança erro para número de semestre inválido (só aceita 1 ou 2)", () => {
    expect(() => SemesterHelper.format("2025.3")).toThrow();
  });

  it("lança erro para string vazia", () => {
    expect(() => SemesterHelper.format("")).toThrow();
  });

  it("lança erro para entrada não numérica", () => {
    expect(() => SemesterHelper.format("abc")).toThrow();
  });
});

describe("SemesterHelper.isValid", () => {
  it("retorna true para semestre válido 2025.2", () => {
    expect(SemesterHelper.isValid("2025.2")).toBe(true);
  });

  it("retorna true para semestre válido 2024.1", () => {
    expect(SemesterHelper.isValid("2024.1")).toBe(true);
  });

  it("retorna false para ano abreviado", () => {
    expect(SemesterHelper.isValid("25.2")).toBe(false);
  });

  it("retorna false quando falta o ponto", () => {
    expect(SemesterHelper.isValid("2025")).toBe(false);
  });

  it("retorna false para número de semestre inválido", () => {
    expect(SemesterHelper.isValid("2025.3")).toBe(false);
  });

  it("retorna false para string vazia", () => {
    expect(SemesterHelper.isValid("")).toBe(false);
  });

  it("retorna false para ano não numérico", () => {
    expect(SemesterHelper.isValid("abc.1")).toBe(false);
  });
});
