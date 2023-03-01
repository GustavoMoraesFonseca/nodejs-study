import { PokemonController } from '../controller/pokemon.controller.js';
import { app } from '../config/server.config.js';

export const pokemonController = new PokemonController();

export function pokemonRoutes() {
    app.post('/pokemon', pokemonController.create);
    app.get('/pokemon', pokemonController.findAll);
    app.get('/pokemon/:id', pokemonController.findById);
    app.put('/pokemon/:id', pokemonController.update);
    app.delete('/pokemon/:id', pokemonController.delete);
}
