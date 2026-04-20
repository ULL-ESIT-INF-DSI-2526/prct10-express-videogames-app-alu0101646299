import request from "request"

export enum difficulties {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum types {
  MULTIPLE = 'multiple',
  BOOLEAN = 'boolean'
}

type QuestionsResponse = {
  success: boolean,
  errMsg?: string,
  response_code?: number,
  results?: Questions[]
}

type Questions = {
  type: types,
  difficulty: difficulties,
  category: string,
  question: string,
  correctAnswer: string,
  incorrectAnswers: string[]
}

/**
 * Busca preguntas con filtros especificados o ninguno
 * @param category - id de la categoría
 * @param difficulty - tipo dificultad
 * @param type - tipo pregunta
 * @returns Promesa de tipo QuestionsResponse
 */
export function findQuestions(category?: number, difficulty?: difficulties, type?: types): Promise<QuestionsResponse> {
  return new Promise<QuestionsResponse>((resolve, reject) => {
    const url = `https://opentdb.com/api.php?amount=10${category ? `&category=${category}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}${type ? `&type=${type}` : ''}`;
    request({url: url, json: true}, (error: Error, response) => {
      if (error) {
        reject({
          success: false,
          errMsg: error.message
        });
      } else if (response.body.response_code === 1) {
        resolve({
          success: false,
          response_code: response.body.response_code,
          errMsg: 'No results'
        });
      } else {
        resolve({
          success: true,
          response_code: response.body.response_code,
          results: response.body.results
        });
      }
    });
  });
}