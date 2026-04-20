import request from "request";

type CategoriesResponse = {
  success: boolean,
  errMsg?: string,
  message?: ObjCategories
}

type ObjCategories = {
  trivia_categories: {id: number, name: string}[]
}

/**
 * Obtiene todas las categorías disponibles
 * @returns - Una promesa de tipo CategoriesResponse
 */
export function getCategories(): Promise<CategoriesResponse> {
  return new Promise<CategoriesResponse>((resolve, reject) => {
    const url = 'https://opentdb.com/api_category.php';
    request({url: url, json: true}, (error: Error, response) => {
      if (error) {
        reject({
          success: false,
          errMsg: error.message
        });
      } else if (response.body.statusCode === 1) {
        resolve({ 
          success: false,
          errMsg: 'Category list is empty'
        });
      } else {
        resolve({
          success: true,
          message: response.body
        })
      }
    });
  });
}