const Sequelize = require('sequelize');
const db = require('../helpers/db');

const masterCategory = db.define('master_category', {
    // attributes
    category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    category_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1001
    },
    category_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '0->Inactive,1->Acitve'
    }
}, {
    // options
    timestamps: false,
    freezeTableName: true,
});

module.exports = masterCategory;