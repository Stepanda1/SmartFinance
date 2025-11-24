export enum TransactionType {
  INCOME = 'Доход',
  EXPENSE = 'Расход'
}

export enum ExpenseCategoryGroup {
  FIXED = 'Обязательные (Fixed)',
  VARIABLE = 'Переменные (Variable)',
  FUNDS = 'Фонды и Сбережения',
  OTHER = 'Прочее'
}

export interface Transaction {
  id: string;
  date: string; // ISO string or DD.MM format for UI
  type: TransactionType;
  categoryGroup: string;
  subcategory: string;
  amount: number;
  account: string;
  comment: string;
  createdAt: number;
}

export interface CategoryStructure {
  [key: string]: string[];
}

export interface AggregatedData {
  name: string;
  value: number;
}