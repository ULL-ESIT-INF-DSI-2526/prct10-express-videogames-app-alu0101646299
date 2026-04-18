import fs from 'fs';
import { Videogame } from './videogame.js';

export type ResponseType = {
  success: boolean;
  message?: string;
  videogames?: Videogame[];
}

/**
 * Clase que gestiona el almacenamiento, lectura y modificación de la colección de videojuegos de un usuario.
 */
export class GameCollection {
  /** Ruta al directorio donde se guardan los juegos del usuario */
  private userPath: string;

  /**
   * Inicializa la colección para un usuario específico y crea su directorio si no existe.
   * @param user - Nombre del usuario propietario de la colección.
   */
  constructor(private user: string) {
    this.userPath = "./db/" + user; 
    if (!fs.existsSync(this.userPath)) {
      fs.mkdirSync(this.userPath, { recursive: true });
    }
  }

  /**
   * Obtiene la ruta del archivo JSON correspondiente a un videojuego por su ID.
   * @param id - Identificador del videojuego.
   * @returns Ruta completa del archivo.
   */
  private getFilePath(id: number): string {
    return `${this.userPath}/${id}.json`;
  }

  /**
   * Añade un nuevo videojuego a la colección si no existe previamente.
   * @param game - Objeto con los datos del videojuego a añadir.
   */
  public addGame(game: Videogame): Promise<ResponseType> {
    return new Promise<ResponseType>((resolve, reject) => {
      const filePath: string = this.getFilePath(game.id);

      if (fs.existsSync(filePath)) {
        resolve({
          success: false,
          message: `Videogame already exists at ${this.user} collection!`
        });
      } else {
        fs.writeFile(filePath, JSON.stringify(game, null, 2), (err) => {
          if (err) {
            reject(err.message);
          } else {
            resolve({
              success: true,
              message: `New videogame added to ${this.user} collection!`
            });
          }
        });
      }
    });
  }

  /**
   * Actualiza los datos de un videojuego existente en la colección.
   * @param game - Objeto con los datos actualizados del videojuego.
   */
  public updateGame(game: Videogame): Promise<ResponseType> {
    return new Promise<ResponseType>((resolve, reject) => {
      const filePath: string = this.getFilePath(game.id);

      if (!fs.existsSync(filePath)) {
        resolve({
          success: false,
          message: `Videogame not found at ${this.user} collection!`
        });
      } else {
        fs.writeFile(filePath, JSON.stringify(game, null, 2), (err) => {
          if (err) {
            reject(err.message);
          } else {
            resolve({
              success: true,
              message: `Videogame updated at ${this.user} collection!`
            })
          }
        });
      }
    });
  }

  /**
   * Elimina un videojuego de la colección mediante su ID.
   * @param id - Identificador del videojuego a eliminar.
   */
  public removeGame(id: number): Promise<ResponseType> {
    return new Promise<ResponseType>((resolve, reject) => {
      const filePath: string = this.getFilePath(id);

      if (!fs.existsSync(filePath)) {
        resolve({
          success: false,
          message: `Videogame not found at ${this.user} collection!`
        })
      } else {
        fs.rm(filePath, (err) => {
          if (err) {
            reject(err.message);
          } else {
            resolve({
              success: true,
              message: `Videogame removed from ${this.user} collection!`
            })
          }
        });
      }
    })
  }

  /**
   * Lee un videojuego específico de la colección y lo muestra por consola.
   * @param id - Identificador del videojuego a leer.
   */
  public readGame(id: number): Promise<ResponseType> {
    return new Promise<ResponseType>((resolve) => {
      const filePath: string = this.getFilePath(id);

      fs.readFile(filePath, (err, gameData) => {
        if (err) {
          resolve({
            success: false,
            message: `Videogame not found at ${this.user} collection!`
          })
        } else {
          resolve({
            success: true,
            videogames: [JSON.parse(gameData.toString())]
          })
        }
      });
    })
  }

  /**
   * Lista todos los videojuegos presentes en la colección del usuario especificado usando el comando `ls`.
   * @param user - Nombre del usuario a listar.
   */
  public listGames(): Promise<ResponseType> {
    return new Promise<ResponseType>((resolve, reject) => {
      fs.readdir(this.userPath, (err, files) => {
        if (err || !files || files.length === 0) {
          resolve({
            success: false,
            message: `${this.user} collection is empty!`
          })
          return;
        }

        let list: Videogame[] = [];
        let counter: number = 0;

        files.forEach(file => {
          const filePath: string = this.userPath + "/" + file;
          fs.readFile(filePath, (err, gameData) => {
            if (err) {
              reject(err.message);
            } else {
              list.push(JSON.parse(gameData.toString()));
              if (++counter === files.length) {
                resolve({
                  success: true,
                  videogames: list
                });
              }
            }
          });
        });
      });
    });
  }
}