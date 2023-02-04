const Sequelize = require('sequelize');
const db = require('../helpers/db');

const masterOrderChecklistDetails = db.define('master_order_checklist_details', {
    // attributes
    details_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    checklist_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ocd_is_liscence_present: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    ocd_is_driver_number_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    ocd_is_vehicle_rc_present: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    ocd_is_prod_present: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    ocd_is_image_require: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    ocd_is_note_require: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    ocd_note: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: ''
    },
    ocd_image: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: ''
    },
    ocd_category: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: ''
    }

}, {
    // options
    timestamps: false,
    freezeTableName: true,
});

module.exports = masterOrderChecklistDetails;