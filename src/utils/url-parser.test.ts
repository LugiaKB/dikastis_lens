import { describe, it, expect } from "vitest";
import { UrlParser } from "@/utils";

const BASE = "https://dikastis.com.br";

describe("UrlParser.extractIds", () => {
  it("extrai orgId, classId e listId do caminho completo", () => {
    const ids = UrlParser.extractIds(`${BASE}/organizations/ORG1/CLASS2/LIST3`);
    expect(ids).toEqual({ orgId: "ORG1", classId: "CLASS2", listId: "LIST3" });
  });

  it("extrai orgId e classId quando lista está ausente", () => {
    const ids = UrlParser.extractIds(`${BASE}/organizations/ORG1/CLASS2`);
    expect(ids).toEqual({ orgId: "ORG1", classId: "CLASS2" });
    expect(ids.listId).toBeUndefined();
  });

  it("extrai apenas orgId quando turma e lista estão ausentes", () => {
    const ids = UrlParser.extractIds(`${BASE}/organizations/ORG1`);
    expect(ids).toEqual({ orgId: "ORG1" });
    expect(ids.classId).toBeUndefined();
    expect(ids.listId).toBeUndefined();
  });

  it("extrai problemId do caminho /problems/", () => {
    const ids = UrlParser.extractIds(`${BASE}/problems/PROB1`);
    expect(ids.problemId).toBe("PROB1");
  });

  it("extrai submissionId do caminho /submissions/", () => {
    const ids = UrlParser.extractIds(`${BASE}/submissions/SUB1`);
    expect(ids.submissionId).toBe("SUB1");
  });

  it("extrai submissionId do caminho /submission/ (singular)", () => {
    const ids = UrlParser.extractIds(`${BASE}/submission/SUB1`);
    expect(ids.submissionId).toBe("SUB1");
  });

  it("extrai orgId e submissionId quando ambos estão presentes", () => {
    const ids = UrlParser.extractIds(
      `${BASE}/organizations/ORG1/submissions/SUB1`
    );
    expect(ids.orgId).toBe("ORG1");
    expect(ids.submissionId).toBe("SUB1");
  });

  it("retorna objeto vazio para URL malformada", () => {
    expect(UrlParser.extractIds("não é url")).toEqual({});
  });

  it("retorna objeto vazio para string vazia", () => {
    expect(UrlParser.extractIds("")).toEqual({});
  });
});

describe("UrlParser.detectPageType", () => {
  it('retorna "organizacao" para /organizations/ORG', () => {
    expect(UrlParser.detectPageType(`${BASE}/organizations/ORG1`)).toBe(
      "organizacao"
    );
  });

  it('retorna "turma" para /organizations/ORG/CLASS', () => {
    expect(
      UrlParser.detectPageType(`${BASE}/organizations/ORG1/CLASS2`)
    ).toBe("turma");
  });

  it('retorna "lista" para /organizations/ORG/CLASS/LIST', () => {
    expect(
      UrlParser.detectPageType(`${BASE}/organizations/ORG1/CLASS2/LIST3`)
    ).toBe("lista");
  });

  it('retorna "lista" para caminho com barra final', () => {
    expect(
      UrlParser.detectPageType(`${BASE}/organizations/ORG1/CLASS2/LIST3/`)
    ).toBe("lista");
  });

  it('retorna "problema" para /problems/ID', () => {
    expect(UrlParser.detectPageType(`${BASE}/problems/P1`)).toBe("problema");
  });

  it('retorna "submissao" para /submissions/ID', () => {
    expect(UrlParser.detectPageType(`${BASE}/submissions/S1`)).toBe(
      "submissao"
    );
  });

  it('retorna "submissao" para /submission/ID (singular)', () => {
    expect(UrlParser.detectPageType(`${BASE}/submission/S1`)).toBe(
      "submissao"
    );
  });

  it('prioriza "submissao" sobre "organizacao" quando ambos os padrões casam', () => {
    expect(
      UrlParser.detectPageType(`${BASE}/organizations/ORG1/submissions/S1`)
    ).toBe("submissao");
  });

  it('retorna "desconhecida" para URL não reconhecida', () => {
    expect(UrlParser.detectPageType("https://google.com")).toBe(
      "desconhecida"
    );
  });

  it('retorna "desconhecida" para URL malformada', () => {
    expect(UrlParser.detectPageType("não é url")).toBe("desconhecida");
  });
});
