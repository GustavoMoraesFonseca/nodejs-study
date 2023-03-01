var schema;
var relationSchema;

export class PokemonRepository {
    get _schema() {
        return schema;
    }

    set _schema(value) {
        schema = value;
    }

    get _relationSchema() {
        return relationSchema;
    }

    set _relationSchema(value) {
        relationSchema = value;
    }

    create({
        name,
        dexNumber: dex_number, 
        mainTypeId: main_type_id, 
        secondTypeId: second_type_id, 
        dthr_create = new Date(),
        dthr_update = new Date()
    }) {
        return schema.create({
            name, dex_number, main_type_id, second_type_id, dthr_create, dthr_update
        });
    }

    findAll() {
        return schema.findAll(getPokemonColumnsForSelect());
    }

    findById(id) {
        return schema.findByPk(id, getPokemonColumnsForSelect());
    }

    update({
        id,
        name,
        dexNumber: dex_number, 
        mainTypeId: main_type_id, 
        secondTypeId: second_type_id,
        dthr_update = new Date()
    }) {
        return schema.update(
            {name, dex_number, main_type_id, second_type_id, dthr_update}, 
            getWhereId(id)
        );
    }

    delete(id) {
        return schema.destroy(getWhereId(id));
    }
}

function getRelationTable(relationAs) {
    return {
        model: relationSchema,
        attributes: ['name'],
        as: relationAs
    };
}

function getPokemonColumnsForSelect() {
    const pokemonColumns = ['id', 'name', 'dex_number'];
    return {
        attributes: pokemonColumns,
        include: [
            getRelationTable('main_type'), 
            getRelationTable('second_type')
        ]
    }
}

function getWhereId(id) {
    return {where: {id: id}};
}