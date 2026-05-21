// Utilitários para chaves de armazenamento e timestamps

/**
 * Geração de chaves de storage e timestamps
 * para persistência de submissões.
 */
export class StorageHelper {
  /**
   * Gera chave de storage para um conjunto de submissões.
   * Formato: "submissions:2025-2:CC:1"
   */
  static buildKey(semester: string, course: string, list: number): string {
    if (!semester || !course) {
      throw new Error("Semestre e curso são obrigatórios para gerar chave de storage");
    }
    return `submissions:${semester}:${course}:${list}`;
  }

  /** Retorna timestamp ISO 8601 do momento atual */
  static createTimestamp(): string {
    return new Date().toISOString();
  }
}

// ── Exemplos de uso ──────────────────────────────────────
//
// StorageHelper.buildKey("2025-2", "CC", 1)  → "submissions:2025-2:CC:1"
// StorageHelper.buildKey("", "CC", 1)        → throw Error
//
// StorageHelper.createTimestamp()             → "2025-05-21T17:00:00.000Z"
