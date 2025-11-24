import { ExpenseCategoryGroup, Transaction, TransactionType } from "./types";

export const EXPENSE_CATEGORIES = {
  [ExpenseCategoryGroup.FIXED]: [
    "Аренда / Ипотека",
    "Коммуналка / Интернет",
    "Кредиты",
    "Обучение / Подписки"
  ],
  [ExpenseCategoryGroup.VARIABLE]: [
    "Еда (продукты домой)",
    "Еда вне дома (кафе, кофе)",
    "Транспорт (бензин, такси, метро)",
    "Красота / Здоровье",
    "Досуг / Хобби"
  ],
  [ExpenseCategoryGroup.FUNDS]: [
    "Резервный фонд",
    "Отпуск",
    "Крупные покупки"
  ],
  [ExpenseCategoryGroup.OTHER]: [
    "Мелочи",
    "Забытое"
  ]
};

export const INCOME_SOURCES = [
  "Зарплата",
  "Подработка",
  "Дивиденды",
  "Подарок",
  "Прочее"
];

export const ACCOUNTS = [
  "Карта Тинькофф",
  "Карта Сбер",
  "Наличные",
  "Кредитка",
  "Сберегательный счет"
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2023-10-01',
    type: TransactionType.EXPENSE,
    categoryGroup: ExpenseCategoryGroup.VARIABLE,
    subcategory: 'Еда (продукты домой)',
    amount: 2500,
    account: 'Карта Тинькофф',
    comment: 'Ашан',
    createdAt: 1696118400000
  },
  {
    id: '2',
    date: '2023-10-01',
    type: TransactionType.EXPENSE,
    categoryGroup: ExpenseCategoryGroup.VARIABLE,
    subcategory: 'Транспорт (бензин, такси, метро)',
    amount: 450,
    account: 'Наличные',
    comment: 'Опаздывал',
    createdAt: 1696122000000
  },
  {
    id: '3',
    date: '2023-10-05',
    type: TransactionType.INCOME,
    categoryGroup: 'Источники дохода',
    subcategory: 'Зарплата',
    amount: 60000,
    account: 'Карта Сбер',
    comment: 'Аванс',
    createdAt: 1696464000000
  },
  {
    id: '4',
    date: '2023-10-07',
    type: TransactionType.EXPENSE,
    categoryGroup: ExpenseCategoryGroup.FIXED,
    subcategory: 'Коммуналка / Интернет',
    amount: 5000,
    account: 'Карта Сбер',
    comment: 'За сентябрь',
    createdAt: 1696636800000
  }
];