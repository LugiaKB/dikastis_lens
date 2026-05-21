import type { PageContext } from "@/types";

/** Representa o link de submissão de um aluno em uma questão */
export interface StudentSubmissionLink {
  studentName: string;
  problemNumber: number;
  href: string;
}

/**
 * Extrai links de submissão dos alunos a partir do DOM
 * da página de lista do Dikastis.
 */
export class ListScraper {
  /**
   * Extrai todos os links de submissão visíveis na página.
   * Retorna array vazio se a tabela não for encontrada.
   *
   * @param doc - Documento a ser analisado (padrão: document)
   */
  static extractLinks(doc: Document = document): StudentSubmissionLink[] {
    const links: StudentSubmissionLink[] = [];
    const rows = doc.querySelectorAll("tr");

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as HTMLTableRowElement;
      const studentName = this.extractStudentName(row);
      if (!studentName) {
        continue;
      }

      const cells = row.querySelectorAll("td");
      // As demais células contêm links de submissão do aluno para cada questão
      for (let j = 1; j < cells.length; j++) {
        const link = cells[j].querySelector("a");
        if (link) {
          const href = link.getAttribute("href");
          if (href && href.includes("/submissions/")) {
            links.push({
              studentName,
              problemNumber: j,
              href,
            });
          }
        }
      }
    }

    return links;
  }

  /**
   * Extrai o nome do aluno da primeira célula de uma linha.
   * Retorna null se a linha não tiver células suficientes.
   */
  private static extractStudentName(row: HTMLTableRowElement): string | null {
    const cells = row.querySelectorAll("td");
    if (cells.length < 1) {
      return null;
    }
    const name = cells[0].textContent?.trim();
    return name || null;
  }

  /**
   * Verifica se a página atual é uma página de lista válida
   * com base no contexto detectado.
   */
  static isValidContext(context: PageContext): boolean {
    return (
      context.type === "lista" &&
      !!context.orgId &&
      !!context.classId &&
      !!context.listId
    );
  }
}
