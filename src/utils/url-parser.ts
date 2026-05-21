// Utilitários para parsing e detecção de URLs do Dikastis

import type { UrlIds, PageType } from "@/types";

/**
 * Extração de IDs e detecção de tipo de página
 * a partir de URLs do Dikastis.
 */
export class UrlParser {
  /**
   * Extrai IDs (org, class, list, problem, submission) de uma URL.
   *
   * Padrões reconhecidos:
   *   /organizations/ORG
   *   /organizations/ORG/CLASS
   *   /organizations/ORG/CLASS/LIST
   *   /problems/PROBLEM_ID
   *   /submissions/SUBMISSION_ID ou /submission/SUBMISSION_ID
   */
  static extractIds(url: string): UrlIds {
    const ids: UrlIds = {};

    try {
      const { pathname } = new URL(url);

      // Segmentos após /organizations/
      const orgMatch = pathname.match(
        /\/organizations\/([A-Za-z0-9]+)(?:\/([A-Za-z0-9]+))?(?:\/([A-Za-z0-9]+))?/
      );
      if (orgMatch) {
        ids.orgId = orgMatch[1];
        if (orgMatch[2]) ids.classId = orgMatch[2];
        if (orgMatch[3]) ids.listId = orgMatch[3];
      }

      // /problems/ID
      const problemMatch = pathname.match(/\/problems\/([A-Za-z0-9]+)/);
      if (problemMatch) {
        ids.problemId = problemMatch[1];
      }

      // /submissions/ID ou /submission/ID
      const submissionMatch = pathname.match(/\/submissions?\/([A-Za-z0-9]+)/);
      if (submissionMatch) {
        ids.submissionId = submissionMatch[1];
      }
    } catch {
      // URL malformada — retorna objeto vazio
    }

    return ids;
  }

  /**
   * Detecta o tipo de página a partir da URL.
   *
   * Regras (em ordem de prioridade):
   *   - Contém /submissions/ ou /submission/ → "submissao"
   *   - Contém /problems/                    → "problema"
   *   - /organizations/ORG/CLASS/LIST        → "lista"
   *   - /organizations/ORG/CLASS             → "turma"
   *   - /organizations/ORG                   → "organizacao"
   *   - Qualquer outro caso                  → "desconhecida"
   */
  static detectPageType(url: string): PageType {
    let pathname: string;

    try {
      pathname = new URL(url).pathname;
    } catch {
      return "desconhecida";
    }

    // Remove barra final para simplificar o matching
    const normalized = pathname.replace(/\/+$/, "");

    // Submissão tem prioridade (pode conter /organizations/ também)
    if (/\/submissions?\/[A-Za-z0-9]+/.test(normalized)) {
      return "submissao";
    }

    // Problema
    if (/\/problems\/[A-Za-z0-9]+/.test(normalized)) {
      return "problema";
    }

    // Caminho /organizations/ORG[/CLASS[/LIST]]
    const orgMatch = normalized.match(
      /\/organizations\/([A-Za-z0-9]+)(?:\/([A-Za-z0-9]+))?(?:\/([A-Za-z0-9]+))?$/
    );

    if (orgMatch) {
      if (orgMatch[3]) return "lista";
      if (orgMatch[2]) return "turma";
      return "organizacao";
    }

    return "desconhecida";
  }
}

// ── Exemplos de uso ──────────────────────────────────────
//
// UrlParser.extractIds("https://dikastis.com.br/organizations/ORG1/CLASS2/LIST3")
//   → { orgId: "ORG1", classId: "CLASS2", listId: "LIST3" }
// UrlParser.extractIds("https://dikastis.com.br/problems/PROB1")
//   → { problemId: "PROB1" }
// UrlParser.extractIds("https://dikastis.com.br/submissions/SUB1")
//   → { submissionId: "SUB1" }
// UrlParser.extractIds("não é url")
//   → {}
//
// UrlParser.detectPageType("https://dikastis.com.br/organizations/ORG1")
//   → "organizacao"
// UrlParser.detectPageType("https://dikastis.com.br/organizations/ORG1/CLS")
//   → "turma"
// UrlParser.detectPageType("https://dikastis.com.br/organizations/ORG1/CLS/LST")
//   → "lista"
// UrlParser.detectPageType("https://dikastis.com.br/problems/P1")
//   → "problema"
// UrlParser.detectPageType("https://dikastis.com.br/submissions/S1")
//   → "submissao"
// UrlParser.detectPageType("https://google.com")
//   → "desconhecida"
