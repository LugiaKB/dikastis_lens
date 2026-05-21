// Tipos compartilhados da extensão Dikastis Lens
// Sem lógica — apenas definições de tipo

// ── Domínio ──────────────────────────────────────────────

/** Semestre letivo (ex: { id: "2025-2", label: "2025.2" }) */
export interface Semester {
  id: string;
  label: string;
}

/** Curso/turma no Dikastis (ex: CC/IA, EC, SI) */
export interface Course {
  /** ULID da turma no Dikastis */
  id: string;
  /** Nome completo do curso */
  name: string;
  /** Abreviação (ex: "CC", "EC", "SI") */
  abbrev: string;
  /** Cor para identificação visual na UI */
  color: string;
}

/** Lista de exercícios de uma turma */
export interface AssignmentList {
  /** 0 = Treinamento, 1–7 = listas numeradas */
  index: number;
  name: string;
  /** ULID da lista */
  listId: string;
  /** ULID da organização */
  orgId: string;
  /** ULID da turma */
  classId: string;
  /** Caminho relativo no Dikastis */
  href: string;
}

/** Questão individual dentro de uma lista */
export interface Problem {
  number: number;
  title: string;
  href: string;
}

/** Submissão de um aluno em uma questão */
export interface Submission {
  studentId: string;
  studentName: string;
  problem: number;
  code: string;
  /** Linguagem de programação (ex: "python", "c", "java") */
  language: string;
  /** Data da submissão no Dikastis (ISO 8601) */
  submittedAt: string;
  /** Momento em que a extensão coletou a submissão (ISO 8601) */
  collectedAt: string;
}

/** Estrutura de armazenamento agrupada por turma/lista */
export interface ClassData {
  /** Identificador do semestre (ex: "2025-2") */
  semester: string;
  /** Abreviação do curso */
  course: string;
  /** Índice da lista */
  list: number;
  submissions: Submission[];
}

// ── Contexto de página ───────────────────────────────────

/** Tipo de página detectado pelo content script */
export type PageType =
  | "organizacao"
  | "turma"
  | "lista"
  | "problema"
  | "submissao"
  | "desconhecida";

/** Contexto da página atual detectado pelo content script */
export interface PageContext {
  type: PageType;
  orgId?: string;
  classId?: string;
  listId?: string;
  problemId?: string;
  submissionId?: string;
  url: string;
}

/** IDs extraídos da URL atual */
export interface UrlIds {
  orgId?: string;
  classId?: string;
  listId?: string;
  problemId?: string;
  submissionId?: string;
}

// ── Resultado genérico ───────────────────────────────────

/** Resultado discriminado para operações assíncronas */
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ── Mensagens entre componentes ──────────────────────────

/** Ações possíveis trocadas entre popup, content script e background */
export type MessageAction =
  | "getContexto"
  | "getAvailableLists"
  | "getStudentLinks"
  | "collectSubmissions"
  | "scanProgress"
  | "updateListCache"
  | "getListCache";

/** Mensagem enviada entre componentes da extensão */
export interface Message {
  action: MessageAction;
  payload?: unknown;
}

/** Resposta padronizada de uma mensagem */
export interface MessageResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}
