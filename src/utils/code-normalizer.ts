// Utilitários para normalização de código-fonte

/** Mapa de prefixos de comentário de linha por linguagem */
const LINE_COMMENT_PREFIX: Record<string, string> = {
  python: "#",
  c: "//",
  java: "//",
  javascript: "//",
  typescript: "//",
};

/**
 * Normalização de código-fonte para comparação entre submissões.
 * Remove comentários de linha, linhas em branco e espaços extras.
 */
export class CodeNormalizer {
  /**
   * Normaliza código-fonte e retorna array de linhas limpas.
   * Útil para comparação de similaridade entre submissões.
   */
  static normalize(code: string, language: string): string[] {
    const prefix = CodeNormalizer.getCommentPrefix(language);

    return code
      .split("\n")
      .map((line) => {
        let cleaned = line;
        // Remove comentário de linha (se houver prefixo para a linguagem)
        if (prefix) {
          const idx = cleaned.indexOf(prefix);
          if (idx !== -1) {
            cleaned = cleaned.substring(0, idx);
          }
        }
        return cleaned.trim();
      })
      .filter((line) => line.length > 0);
  }

  /** Retorna o prefixo de comentário de linha para a linguagem */
  private static getCommentPrefix(language: string): string | null {
    return LINE_COMMENT_PREFIX[language.toLowerCase()] ?? null;
  }
}

// ── Exemplos de uso ──────────────────────────────────────
//
// CodeNormalizer.normalize("x = 1  # atribui\n\n  y = 2\n", "python")
//   → ["x = 1", "y = 2"]
// CodeNormalizer.normalize("int x = 1; // decl\n\nint y = 2;\n", "c")
//   → ["int x = 1;", "int y = 2;"]
// CodeNormalizer.normalize("code", "ruby")
//   → ["code"]  (linguagem sem prefixo conhecido — mantém tudo)
