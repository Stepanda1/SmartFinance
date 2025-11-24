import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const analyzeBudgetWithGemini = async (transactions: Transaction[]): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "API ключ Gemini не найден. Пожалуйста, настройте переменную окружения.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Filter minimal data to save tokens
    const dataSummary = transactions.map(t => ({
      date: t.date,
      type: t.type,
      category: t.categoryGroup === 'Источники дохода' ? t.subcategory : `${t.categoryGroup} - ${t.subcategory}`,
      amount: t.amount,
      comment: t.comment
    }));

    const prompt = `
      Ты — опытный финансовый консультант. Проанализируй предоставленные ниже данные о доходах и расходах пользователя.
      
      Данные (JSON):
      ${JSON.stringify(dataSummary)}

      Пожалуйста, сделай следующее:
      1. Посчитай общий баланс (Доходы - Расходы).
      2. Определи основные статьи расходов.
      3. Проверь, соблюдается ли правило: "Обязательные расходы" (Fixed) не должны быть слишком высокими.
      4. Найди "дыры" в бюджете (категории "Разное", "Мелочи" или странные большие траты).
      5. Дай 3 конкретных совета по оптимизации бюджета на основе этих данных.
      
      Отформатируй ответ, используя Markdown. Будь краток, вежлив и профессионален.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple analysis
      }
    });

    return response.text || "Не удалось получить ответ от модели.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Ошибка при анализе данных: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`;
  }
};