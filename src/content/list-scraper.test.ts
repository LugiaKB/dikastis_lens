// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { ListScraper } from "./list-scraper";
import type { PageContext } from "@/types";

/**
 * Cria um documento DOM simulado contendo uma tabela de submissões.
 */
function buildTableDoc(rows: { name: string; hrefs: (string | null)[] }[]): Document {
  const doc = new DOMParser().parseFromString("<!DOCTYPE html><html><body></body></html>", "text/html");
  const table = doc.createElement("table");

  rows.forEach((rowData) => {
    const tr = doc.createElement("tr");

    // Primeira td: Nome do aluno
    const nameTd = doc.createElement("td");
    nameTd.textContent = rowData.name;
    tr.appendChild(nameTd);

    // Demais tds: Links das submissões
    rowData.hrefs.forEach((href) => {
      const td = doc.createElement("td");
      if (href !== null) {
        const a = doc.createElement("a");
        a.setAttribute("href", href);
        a.textContent = "Submissão";
        td.appendChild(a);
      } else {
        td.textContent = "-";
      }
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  doc.body.appendChild(table);
  return doc;
}

describe("ListScraper.extractLinks", () => {
  it("tabela com 2 alunos e 3 questões retorna todos os links válidos", () => {
    const doc = buildTableDoc([
      {
        name: "Aluno A",
        hrefs: [
          "/organizations/ORG1/CLASS1/LIST1/problems/PROB1/submissions/SUB1",
          "/organizations/ORG1/CLASS1/LIST1/problems/PROB2/submissions/SUB2",
          "/organizations/ORG1/CLASS1/LIST1/problems/PROB3/submissions/SUB3",
        ],
      },
      {
        name: "Aluno B",
        hrefs: [
          "/organizations/ORG1/CLASS1/LIST1/problems/PROB1/submissions/SUB4",
          "/organizations/ORG1/CLASS1/LIST1/problems/PROB2/submissions/SUB5",
          "/organizations/ORG1/CLASS1/LIST1/problems/PROB3/submissions/SUB6",
        ],
      },
    ]);

    const links = ListScraper.extractLinks(doc);

    expect(links).toHaveLength(6);
    expect(links[0]).toEqual({
      studentName: "Aluno A",
      problemNumber: 1,
      href: "/organizations/ORG1/CLASS1/LIST1/problems/PROB1/submissions/SUB1",
    });
    expect(links[5]).toEqual({
      studentName: "Aluno B",
      problemNumber: 3,
      href: "/organizations/ORG1/CLASS1/LIST1/problems/PROB3/submissions/SUB6",
    });
  });

  it("célula sem href (nula) é ignorada e não entra no resultado", () => {
    const doc = buildTableDoc([
      {
        name: "Aluno A",
        hrefs: [
          "/organizations/ORG1/CLASS1/LIST1/problems/PROB1/submissions/SUB1",
          null,
          "/organizations/ORG1/CLASS1/LIST1/problems/PROB3/submissions/SUB3",
        ],
      },
    ]);

    const links = ListScraper.extractLinks(doc);

    expect(links).toHaveLength(2);
    expect(links[0]).toEqual({
      studentName: "Aluno A",
      problemNumber: 1,
      href: "/organizations/ORG1/CLASS1/LIST1/problems/PROB1/submissions/SUB1",
    });
    expect(links[1]).toEqual({
      studentName: "Aluno A",
      problemNumber: 3,
      href: "/organizations/ORG1/CLASS1/LIST1/problems/PROB3/submissions/SUB3",
    });
  });

  it("linha sem nome do aluno é ignorada por completo", () => {
    const doc = buildTableDoc([
      {
        name: "",
        hrefs: ["/organizations/ORG1/CLASS1/LIST1/problems/PROB1/submissions/SUB1"],
      },
      {
        name: "Aluno B",
        hrefs: ["/organizations/ORG1/CLASS1/LIST1/problems/PROB1/submissions/SUB2"],
      },
    ]);

    const links = ListScraper.extractLinks(doc);

    expect(links).toHaveLength(1);
    expect(links[0]).toEqual({
      studentName: "Aluno B",
      problemNumber: 1,
      href: "/organizations/ORG1/CLASS1/LIST1/problems/PROB1/submissions/SUB2",
    });
  });

  it("documento sem tabela retorna array vazio", () => {
    const doc = new DOMParser().parseFromString(
      "<!DOCTYPE html><html><body>Sem Tabela</body></html>",
      "text/html"
    );

    const links = ListScraper.extractLinks(doc);

    expect(links).toEqual([]);
  });

  it("link que não contém /submissions/ é ignorado", () => {
    const doc = buildTableDoc([
      {
        name: "Aluno A",
        hrefs: [
          "/organizations/ORG1/CLASS1/LIST1/problems/PROB1",
          "/organizations/ORG1/CLASS1/LIST1/problems/PROB1/submissions/SUB1",
        ],
      },
    ]);

    const links = ListScraper.extractLinks(doc);

    expect(links).toHaveLength(1);
    expect(links[0]).toEqual({
      studentName: "Aluno A",
      problemNumber: 2,
      href: "/organizations/ORG1/CLASS1/LIST1/problems/PROB1/submissions/SUB1",
    });
  });

  it("aluno com todas as questões vazias não gera nenhum link no resultado", () => {
    const doc = buildTableDoc([
      {
        name: "Aluno A",
        hrefs: [null, null],
      },
    ]);

    const links = ListScraper.extractLinks(doc);

    expect(links).toEqual([]);
  });
});

describe("ListScraper.isValidContext", () => {
  it("contexto tipo lista com todos os IDs válidos retorna true", () => {
    const context: PageContext = {
      type: "lista",
      orgId: "ORG1",
      classId: "CLS1",
      listId: "LST1",
      url: "https://dikastis.com.br/organizations/ORG1/CLS1/LST1",
    };

    expect(ListScraper.isValidContext(context)).toBe(true);
  });

  it("contexto tipo lista sem listId retorna false", () => {
    const context: PageContext = {
      type: "lista",
      orgId: "ORG1",
      classId: "CLS1",
      url: "https://dikastis.com.br/organizations/ORG1/CLS1",
    };

    expect(ListScraper.isValidContext(context)).toBe(false);
  });

  it("contexto tipo turma retorna false", () => {
    const context: PageContext = {
      type: "turma",
      orgId: "ORG1",
      classId: "CLS1",
      url: "https://dikastis.com.br/organizations/ORG1/CLS1",
    };

    expect(ListScraper.isValidContext(context)).toBe(false);
  });

  it("contexto tipo desconhecida retorna false", () => {
    const context: PageContext = {
      type: "desconhecida",
      url: "https://google.com",
    };

    expect(ListScraper.isValidContext(context)).toBe(false);
  });
});
