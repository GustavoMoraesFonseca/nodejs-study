export class PokemonDto {
    id = null;
    name = null;
    dexNumber = null;
    mainTypeId = null;
    secondTypeId = null;

    constructor(pokemonDto) {
        this.id = pokemonDto.id;
        this.name = pokemonDto.name;
        this.dexNumber = pokemonDto.dexNumber;
        this.mainTypeId = pokemonDto.mainTypeId;
        this.secondTypeId = pokemonDto.secondTypeId;
    }
}