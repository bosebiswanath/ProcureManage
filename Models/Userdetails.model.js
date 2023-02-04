const Sequelize = require('sequelize');
const db = require('../helpers/db');

const masterUserDetails = db.define('master_user_details', {
    // attributes
    user_details_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    full_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    // options
    timestamps: false,
    freezeTableName: true,
});

module.exports = masterUserDetails;
