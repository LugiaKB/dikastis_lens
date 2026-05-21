import { describe, it, expect, vi } from "vitest";
import { StorageHelper } from "@/utils";

describe("StorageHelper.buildKey", () => {
  it('gera chave "submissions:2025-2:CC:1"', () => {
    expect(StorageHelper.buildKey("2025-2", "CC", 1)).toBe(
      "submissions:2025-2:CC:1"
    );
  });

  it('gera chave "submissions:2025-2:EC:3"', () => {
    expect(StorageHelper.buildKey("2025-2", "EC", 3)).toBe(
      "submissions:2025-2:EC:3"
    );
  });

  it("usa 0 para índice da lista de treinamento", () => {
    expect(StorageHelper.buildKey("2025-1", "SI", 0)).toBe(
      "submissions:2025-1:SI:0"
    );
  });

  it("lança erro quando semestre está vazio", () => {
    expect(() => StorageHelper.buildKey("", "CC", 1)).toThrow();
  });

  it("lança erro quando curso está vazio", () => {
    expect(() => StorageHelper.buildKey("2025-2", "", 1)).toThrow();
  });
});

describe("StorageHelper.createTimestamp", () => {
  it("retorna string no formato ISO 8601", () => {
    const ts = StorageHelper.createTimestamp();
    expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("retorna string não vazia", () => {
    expect(StorageHelper.createTimestamp().length).toBeGreaterThan(0);
  });

  it("retorna valores diferentes em momentos diferentes", () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
    const ts1 = StorageHelper.createTimestamp();

    vi.setSystemTime(new Date("2025-01-01T00:00:01.000Z"));
    const ts2 = StorageHelper.createTimestamp();

    expect(ts1).not.toBe(ts2);

    vi.useRealTimers();
  });
});
