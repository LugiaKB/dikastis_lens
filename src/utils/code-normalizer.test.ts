import { describe, it, expect } from "vitest";
import { CodeNormalizer } from "@/utils";

describe("CodeNormalizer.normalize", () => {
  // ── Python ───────────────────────────────────────────

  describe("python", () => {
    it('remove comentário inline após "#"', () => {
      expect(CodeNormalizer.normalize("x = 1  # assign\n", "python")).toEqual([
        "x = 1",
      ]);
    });

    it("remove linhas em branco", () => {
      expect(
        CodeNormalizer.normalize("x = 1\n\ny = 2\n", "python")
      ).toEqual(["x = 1", "y = 2"]);
    });

    it("remove espaços extras no início e fim", () => {
      expect(CodeNormalizer.normalize("  x = 1  \n", "python")).toEqual([
        "x = 1",
      ]);
    });

    it("remove linhas que são apenas comentário", () => {
      expect(CodeNormalizer.normalize("# comment\n", "python")).toEqual([]);
    });

    it('remove após "#" mesmo dentro de strings (limitação conhecida)', () => {
      // NOTA: a implementação atual não faz parsing de strings,
      // então "#" dentro de strings é tratado como comentário.
      const result = CodeNormalizer.normalize(
        'x = "hello#world"\n',
        "python"
      );
      expect(result).toEqual(['x = "hello']);
    });
  });

  // ── C / Java / TypeScript ────────────────────────────

  describe("c", () => {
    it('remove comentário inline após "//"', () => {
      expect(
        CodeNormalizer.normalize("int x = 1; // decl\n", "c")
      ).toEqual(["int x = 1;"]);
    });

    it("remove linhas que são apenas comentário", () => {
      expect(CodeNormalizer.normalize("// comment\n", "c")).toEqual([]);
    });

    it('remove após "//" mesmo dentro de strings (limitação conhecida)', () => {
      // NOTA: mesma limitação — "//" em strings é tratado como comentário.
      const result = CodeNormalizer.normalize(
        'char* s = "http://ok";\n',
        "c"
      );
      expect(result).toEqual(['char* s = "http:']);
    });
  });

  describe("java", () => {
    it('remove comentário inline após "//"', () => {
      expect(
        CodeNormalizer.normalize("int x = 1; // decl\n", "java")
      ).toEqual(["int x = 1;"]);
    });
  });

  describe("typescript", () => {
    it('remove comentário inline após "//"', () => {
      expect(
        CodeNormalizer.normalize("const x = 1; // decl\n", "typescript")
      ).toEqual(["const x = 1;"]);
    });
  });

  // ── Linguagem desconhecida ───────────────────────────

  describe("linguagem desconhecida", () => {
    it("mantém todas as linhas não vazias para linguagem não reconhecida", () => {
      expect(
        CodeNormalizer.normalize("x = 1 # not stripped\ny = 2\n", "ruby")
      ).toEqual(["x = 1 # not stripped", "y = 2"]);
    });

    it("mantém todas as linhas não vazias quando linguagem é vazia", () => {
      expect(
        CodeNormalizer.normalize("x = 1\ny = 2\n", "")
      ).toEqual(["x = 1", "y = 2"]);
    });
  });

  // ── Casos extremos ──────────────────────────────────

  describe("casos extremos", () => {
    it("retorna array vazio para código vazio", () => {
      expect(CodeNormalizer.normalize("", "python")).toEqual([]);
    });

    it("retorna array vazio para apenas linhas em branco", () => {
      expect(CodeNormalizer.normalize("\n\n\n", "python")).toEqual([]);
    });

    it("trata código sem quebra de linha final", () => {
      expect(CodeNormalizer.normalize("x = 1", "python")).toEqual(["x = 1"]);
    });
  });
});
