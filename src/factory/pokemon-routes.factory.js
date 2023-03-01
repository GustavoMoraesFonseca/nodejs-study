import { pokemonRoutes, pokemonController } from '../routes/pokemon.routes.js';
import { PokemonService } from '../service/pokemon.service.js';
import { PokemonRepository } from '../repository/pokemon.repository.js';
import { pokemonSchema } from '../models/pokemon.model.js';
import { pokemonTypeSchema } from '../models/pokemon-type.model.js';

export function pokemonRoutesInitialize() {
    pokemonController._service = new PokemonService();
    pokemonController._service._repository = new PokemonRepository();
    pokemonController._service._repository._schema = pokemonSchema;
    pokemonController._service._repository._relationSchema = pokemonTypeSchema;
    
    pokemonRoutes();
}
