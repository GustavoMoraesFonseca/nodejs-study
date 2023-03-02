import { Sequelize } from 'sequelize';
import { sequelize } from '../config/mysql.config.js';
import { pokemonTypeSchema } from './pokemon-type.model.js';

export const pokemonSchema = sequelize.define('tab_pokemon', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(45),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: {
                arg: true,
                msg: 'Nome não deve ser vazio.'
            }
        }
    },
    dex_number: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'Número mínimo da DEX é 1.'
            },
            isInt: {
                arg: true,
                msg: 'Número da DEX deve ser um número válido.'
            }
        }
    },
    main_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'Número mínimo do Tipo Principal é 1.'
            },
            max: {
                args: [18],
                msg: 'Número máximo do Tipo Principal é 18.'
            },
            isInt: {
                arg: true,
                msg: 'Número do Tipo Principal deve ser um número válido.'
            }
        }
    },
    second_type_id: {
        type: Sequelize.INTEGER,
        validate: {
            min: {
                args: [1],
                msg: 'Número mínimo do Tipo Secundário é 1.'
            },
            max: {
                args: [18],
                msg: 'Número máximo do Tipo Secundário é 18.'
            },
            isInt: {
                arg: true,
                msg: 'Número do Tipo Secundário deve ser um número válido.'
            }
        }
    },
    dthr_create: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    dthr_update: {
        type: Sequelize.DATE,
        allowNull: false,
    }
},{
    freezeTableName: true,
    timestamps: false
});

pokemonSchema.belongsTo(pokemonTypeSchema, {
    constraint: true,
    foreignKey: 'main_type_id',
    as: 'main_type'
})

pokemonSchema.belongsTo(pokemonTypeSchema, {
    constraint: true,
    foreignKey: 'second_type_id',
    as: 'second_type'
})