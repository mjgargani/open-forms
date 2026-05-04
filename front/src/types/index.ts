// src/types/index.ts

export type OptionType = 'INPUT' | 'MARKDOWN';

export interface Option {
  id: string;
  active?: boolean;
  description: string;
  type: OptionType;
  correct?: boolean; // É opcional porque na Visão do Aluno o backend esconde o gabarito!
  questionId: string;
}

export interface Question {
  id: string;
  active?: boolean;
  title: string;
  formId: string;
  required?: boolean;
  options: Option[];
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  active?: boolean;
  questions: Question[];
}