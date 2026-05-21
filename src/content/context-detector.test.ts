import { describe, it, expect, vi, afterEach } from "vitest";
import { ContextDetector } from "./context-detector";

const BASE = "https://dikastis.com.br";

describe("ContextDetector.detect", () => {
  it("retorna o contexto correto para URL de lista", () => {
    const url = `${BASE}/organizations/ORG1/CLS1/LST1`;
    const context = ContextDetector.detect(url);
    expect(context).toEqual({
      type: "lista",
      url,
      orgId: "ORG1",
      classId: "CLS1",
      listId: "LST1",
    });
  });

  it("retorna o contexto correto para URL de turma", () => {
    const url = `${BASE}/organizations/ORG1/CLS1`;
    const context = ContextDetector.detect(url);
    expect(context).toEqual({
      type: "turma",
      url,
      orgId: "ORG1",
      classId: "CLS1",
    });
  });

  it("retorna o contexto correto para URL de organização", () => {
    const url = `${BASE}/organizations/ORG1`;
    const context = ContextDetector.detect(url);
    expect(context).toEqual({
      type: "organizacao",
      url,
      orgId: "ORG1",
    });
  });

  it("retorna o contexto correto para URL de problema", () => {
    const url = `${BASE}/problems/PROB1`;
    const context = ContextDetector.detect(url);
    expect(context).toEqual({
      type: "problema",
      url,
      problemId: "PROB1",
    });
  });

  it("retorna o contexto correto para URL de submissão", () => {
    const url = `${BASE}/submissions/SUB1`;
    const context = ContextDetector.detect(url);
    expect(context).toEqual({
      type: "submissao",
      url,
      submissionId: "SUB1",
    });
  });

  it("retorna o contexto correto para URL desconhecida", () => {
    const url = "https://google.com";
    const context = ContextDetector.detect(url);
    expect(context).toEqual({
      type: "desconhecida",
      url,
    });
  });

  it("retorna o contexto correto para URL malformada", () => {
    const url = "não é url";
    const context = ContextDetector.detect(url);
    expect(context).toEqual({
      type: "desconhecida",
      url,
    });
  });

  it("sempre inclui o campo url com o valor original recebido", () => {
    const url = `${BASE}/problems/P1`;
    const context = ContextDetector.detect(url);
    expect(context.url).toBe(url);
  });
});

describe("ContextDetector.detectCurrent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("delegação correta para detect com o href atual do window", () => {
    const testUrl = `${BASE}/organizations/ORG9/CLS9/LST9`;
    vi.stubGlobal("window", {
      location: {
        href: testUrl,
      },
    });

    const context = ContextDetector.detectCurrent();
    expect(context).toEqual({
      type: "lista",
      url: testUrl,
      orgId: "ORG9",
      classId: "CLS9",
      listId: "LST9",
    });
  });
});
