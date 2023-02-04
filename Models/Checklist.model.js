const Sequelize = require('sequelize');
const db = require('../helpers/db');

const masterChecklist = db.define('master_checklist', {
    // attributes
    checklist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    checklist_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    checklist_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
    is_liscence_present: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_driver_number_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_vehicle_rc_present: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_image_require: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_prod_present: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_note_require: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
}, {
    // options
    timestamps: false,
    freezeTableName: true,
});

module.exports = masterChecklist;