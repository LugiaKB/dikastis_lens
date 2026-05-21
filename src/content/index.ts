import { ContextDetector } from "@/content/context-detector";
import type { PageContext } from "@/types";

// Ponto de entrada do content script
const context = ContextDetector.detectCurrent();
route(context);

/**
 * Roteia para o handler correto de acordo com o tipo de página.
 */
export function route(context: PageContext): void {
  switch (context.type) {
    case "lista":
      handleListPage(context);
      break;
    case "submissao":
      handleSubmissionPage(context);
      break;
    case "problema":
      handleProblemPage(context);
      break;
    case "turma":
      handleCoursePage(context);
      break;
    case "organizacao":
      handleOrgPage(context);
      break;
    case "desconhecida":
      console.log(`Página desconhecida detectada: ${context.url}`);
      break;
  }
}

/**
 * Página de lista — Fase 2: coletar links dos alunos.
 */
export function handleListPage(context: PageContext): void {
  console.log(`Manipulando página de lista. Org: ${context.orgId} Class: ${context.classId} List: ${context.listId}`);
  // Fase 2: coletar links de alunos
}

/**
 * Página de submissão — Fase 3: extrair código do aluno.
 */
export function handleSubmissionPage(context: PageContext): void {
  console.log(`Manipulando página de submissão. Submission: ${context.submissionId}`);
  // Fase 3: extrair código do aluno
}

/**
 * Página de problema — uso futuro.
 */
export function handleProblemPage(context: PageContext): void {
  console.log(`Manipulando página de problema. Problem: ${context.problemId}`);
  // Fase futura: obter detalhes do problema
}

/**
 * Página de turma — uso futuro.
 */
export function handleCoursePage(context: PageContext): void {
  console.log(`Manipulando página de turma. Org: ${context.orgId} Class: ${context.classId}`);
  // Fase futura: listar atividades da turma
}

/**
 * Página de organização — uso futuro.
 */
export function handleOrgPage(context: PageContext): void {
  console.log(`Manipulando página de organização. Org: ${context.orgId}`);
  // Fase futura: listar turmas da organização
}
