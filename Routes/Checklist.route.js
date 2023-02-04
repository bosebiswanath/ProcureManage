"use strict";

const express = require('express')
const router = express.Router()
//Biswa2022

const ChecklistController = require('../Controllers/Checklist.Controller')

const { verifyAccessToken } = require('../helpers/jwt_helper');


/**
 * @swagger
 *
 * /checklist/createchecklist:
 *   post:
 *     tags:
 *       - Checklist
 *     description: Procure Manager can create checklist
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: checklistData
 *         description: Object of fields need for this
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             driverDetails:
 *               type: object
 *               properties:
 *                 isLiscencePresent:
 *                   type: boolean
 *                 isDriverNumberActive:
 *                   type: boolean
 *                 isVehicleRcPresent:
 *                   type: boolean
 *             isProdPresent:
 *               type: boolean
 *             isImageRequire:
 *               type: boolean
 *               default: false
 *             isnoteRequire:
 *               type: boolean
 *               default: false
 *             checklistName:
 *               type: string
  *               default: null
 *     responses:
 *       200:
 *         description: Checklist creation successfull
 *       403: 
 *         description: You do not have necessary permissions to get token
 */
router.post('/createchecklist', verifyAccessToken, ChecklistController.createchecklist);

 /**
 * @swagger
 *
 * /checklist/viewchecklist:
 *   get:
 *     tags:
 *       - Checklist
 *     description: Admin and Procure manager will see the checklist
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Checklist successfully fetched.
 *       403: 
 *         description: You do not have necessary permissions to create new user or register.
 */
router.get('/viewchecklist', verifyAccessToken, ChecklistController.viewchecklist);

module.exports = router


