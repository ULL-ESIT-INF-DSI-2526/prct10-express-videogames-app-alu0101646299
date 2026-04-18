import express from 'express';
import { GameCollection } from './gameCollection.js';
import { Videogame } from './videogame.js';

const app = express();

app.use(express.json());

app.get('/videogames', (req, res) => {
  const user = req.query.user as string;
  const id = req.query.id ? Number(req.query.id) : undefined;

  if (!user) {
    res.send({ error: 'A user must be provided' });
  } else {
    const collection = new GameCollection(user);

    if (id !== undefined) {
      collection.readGame(id)
        .then((data) => res.send(data))
        .catch((err) => res.send({ error: err }));
    } else {
      collection.listGames()
        .then((data) => res.send(data))
        .catch((err) => res.send({ error: err }));
    }
  }
});

app.post('/videogames', (req, res) => {
  const user = req.body.user as string;
  const videogame = req.body.videogame as Videogame;

  if (!user || !videogame) {
    res.send({ error: 'A user and a videogame must be provided' });
  } else {
    const collection = new GameCollection(user);

    collection.addGame(videogame)
      .then((data) => res.send(data))
      .catch((err) => res.send({ error: err}));
  }
});

app.patch('/videogames', (req, res) => {
  const user = req.body.user as string;
  const videogame = req.body.videogame as Videogame;

  if (!user || !videogame) {
    res.send({ error: 'A user and a videogame must be provided' });
  } else {
    const collection = new GameCollection(user);

    collection.updateGame(videogame)
      .then((data) => res.send(data))
      .catch((err) => res.send({ error: err}));
  }
});

app.delete('/videogames', (req, res) => {
  const user = req.query.user as string;
  const id = req.query.id ? Number(req.query.id) : undefined;

  if (!user || id === undefined) {
    res.send({ error: 'A user and an id must be provided' });
  } else {
    const collection = new GameCollection(user);

    collection.removeGame(id)
      .then((data) => res.send(data))
      .catch((err) => res.send({ error: err }));
  }
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});