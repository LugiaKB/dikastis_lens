import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from "vitest";
import { ContextDetector } from "@/content/context-detector";
import type { PageContext } from "@/types";

// Mock do window para evitar erros de ReferenceError no carregamento do módulo index.ts
// Como os imports estáticos são hoisted, precisamos importar ./index de forma dinâmica abaixo para garantir
// que o window global esteja disponível no momento da importação.
vi.stubGlobal("window", {
  location: {
    href: "https://dikastis.com.br",
  },
});

let indexModule: typeof import("./index");

beforeAll(async () => {
  indexModule = await import("./index");
});

describe("route — roteamento por tipo de página", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Tipo 'lista' → chama handleListPage", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "lista",
      url: "https://dikastis.com.br/organizations/ORG1/CLS1/LST1",
      orgId: "ORG1",
      classId: "CLS1",
      listId: "LST1",
    };

    indexModule.route(context);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Manipulando página de lista")
    );
  });

  it("Tipo 'submissao' → chama handleSubmissionPage", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "submissao",
      url: "https://dikastis.com.br/submissions/SUB1",
      submissionId: "SUB1",
    };

    indexModule.route(context);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Manipulando página de submissão")
    );
  });

  it("Tipo 'problema' → chama handleProblemPage", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "problema",
      url: "https://dikastis.com.br/problems/PROB1",
      problemId: "PROB1",
    };

    indexModule.route(context);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Manipulando página de problema")
    );
  });

  it("Tipo 'turma' → chama handleCoursePage", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "turma",
      url: "https://dikastis.com.br/organizations/ORG1/CLS1",
      orgId: "ORG1",
      classId: "CLS1",
    };

    indexModule.route(context);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Manipulando página de turma")
    );
  });

  it("Tipo 'organizacao' → chama handleOrgPage", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "organizacao",
      url: "https://dikastis.com.br/organizations/ORG1",
      orgId: "ORG1",
    };

    indexModule.route(context);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Manipulando página de organização")
    );
  });

  it("Tipo 'desconhecida' → nenhum handler é chamado", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "desconhecida",
      url: "https://google.com",
    };

    indexModule.route(context);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Página desconhecida detectada")
    );
  });
});

describe("execução ao carregar script", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("chama route com o contexto detectado por ContextDetector.detectCurrent", async () => {
    const mockContext: PageContext = {
      type: "lista",
      url: "https://dikastis.com.br/organizations/ORG1/CLS1/LST1",
      orgId: "ORG1",
      classId: "CLS1",
      listId: "LST1",
    };

    const spyDetect = vi
      .spyOn(ContextDetector, "detectCurrent")
      .mockReturnValue(mockContext);
    const logSpy = vi.spyOn(console, "log");

    // Recarrega o módulo usando parâmetro de query para forçar nova execução
    await import("./index?test=onload");

    expect(spyDetect).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Manipulando página de lista")
    );
  });
});

describe("handlers individuais", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("handleListPage recebe PageContext e loga sem lançar erros", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "lista",
      url: "...",
      orgId: "ORG1",
      classId: "CLS1",
      listId: "LST1",
    };

    expect(() => indexModule.handleListPage(context)).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
  });

  it("handleSubmissionPage recebe PageContext e loga sem lançar erros", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "submissao",
      url: "...",
      submissionId: "SUB1",
    };

    expect(() => indexModule.handleSubmissionPage(context)).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
  });

  it("handleProblemPage recebe PageContext e loga sem lançar erros", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "problema",
      url: "...",
      problemId: "PROB1",
    };

    expect(() => indexModule.handleProblemPage(context)).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
  });

  it("handleCoursePage recebe PageContext e loga sem lançar erros", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "turma",
      url: "...",
      orgId: "ORG1",
      classId: "CLS1",
    };

    expect(() => indexModule.handleCoursePage(context)).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
  });

  it("handleOrgPage recebe PageContext e loga sem lançar erros", () => {
    const logSpy = vi.spyOn(console, "log");
    const context: PageContext = {
      type: "organizacao",
      url: "...",
      orgId: "ORG1",
    };

    expect(() => indexModule.handleOrgPage(context)).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
  });
});
