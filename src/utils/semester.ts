// Utilitários para manipulação de semestres letivos

/** Regex para validar formato de semestre: YYYY.N */
const SEMESTER_REGEX = /^\d{4}\.[12]$/;

/**
 * Operações sobre semestres letivos.
 * Formato esperado: "YYYY.N" (ex: "2025.2")
 */
export class SemesterHelper {
  /**
   * Formata label de semestre para chave de storage.
   * "2025.2" → "2025-2"
   * Lança erro se o formato for inválido.
   */
  static format(label: string): string {
    if (!SEMESTER_REGEX.test(label)) {
      throw new Error(`Formato de semestre inválido: "${label}". Esperado: YYYY.N`);
    }
    return label.replace(".", "-");
  }

  /** Valida se uma string segue o formato de semestre YYYY.N */
  static isValid(label: string): boolean {
    return SEMESTER_REGEX.test(label);
  }
}

// ── Exemplos de uso ──────────────────────────────────────
//
// SemesterHelper.format("2025.2")   → "2025-2"
// SemesterHelper.format("2024.1")   → "2024-1"
// SemesterHelper.format("25.2")     → throw Error
// SemesterHelper.format("")         → throw Error
//
// SemesterHelper.isValid("2025.2")  → true
// SemesterHelper.isValid("25.2")    → false
// SemesterHelper.isValid("2025")    → false
