import type { PageContext } from "@/types";
import { UrlParser } from "@/utils";

/**
 * Detecta e monta o contexto completo da página atual.
 */
export class ContextDetector {
  /**
   * Analisa a URL e retorna um PageContext completo.
   * Combina detectPageType e extractIds em um único objeto.
   *
   * Exemplos:
   *   detect("https://dikastis.com.br/organizations/ORG1/CLS1/LST1")
   *     → { type: "lista", orgId: "ORG1", classId: "CLS1", listId: "LST1", url: "..." }
   *
   *   detect("https://dikastis.com.br/problems/P1")
   *     → { type: "problema", problemId: "P1", url: "..." }
   *
   *   detect("não é url")
   *     → { type: "desconhecida", url: "não é url" }
   */
  static detect(url: string): PageContext {
    const type = UrlParser.detectPageType(url);
    const ids = UrlParser.extractIds(url);

    return {
      type,
      url,
      ...ids,
    };
  }

  /**
   * Atalho que detecta o contexto da página atual do browser.
   * Só deve ser chamado no content script (window disponível).
   */
  static detectCurrent(): PageContext {
    return ContextDetector.detect(window.location.href);
  }
}
