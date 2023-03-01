import { Sequelize }   from 'sequelize';
import { mysqlConfig } from '../config/mysql.config.js';

export const pokemonTypeSchema = mysqlConfig.define('tab_pokemon_type', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
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