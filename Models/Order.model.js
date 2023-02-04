const Sequelize = require('sequelize');
const db = require('../helpers/db');

const masterOrder = db.define('master_order', {
    // attributes
    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    order_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1001
    },
    order_amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    order_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    assign_inspection_manager: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    order_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '0->new order,1->complete,2->checklist met'
    }
}, {
    // options
    timestamps: false,
    freezeTableName: true,
});

module.exports = masterOrder;
