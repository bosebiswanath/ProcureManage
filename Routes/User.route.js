"use strict";

const express = require('express')
const router = express.Router()
//Biswa2022

const UserController = require('../Controllers/User.Controller')
const { verifyAccessToken } = require('../helpers/jwt_helper');


/**
 * @swagger
 *
 * /user/viewprocuremanager:
 *   get:
 *     tags:
 *       - User
 *     description: Admin only see the procure manager
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Display procure manager list
 *       403: 
 *         description: You do not have necessary permissions to get token
 */
router.get('/viewprocuremanager', verifyAccessToken, UserController.viewprocuremanager);


/**
 * @swagger
 *
 * /user/viewinspectionmanager:
 *   get:
 *     tags:
 *       - User
 *     description: Admin and Procure Manager only can see their inspection Manager
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Display inspection manager list under respective procure manager
 *       403: 
 *         description: You do not have necessary permissions to get token
 */
router.get('/viewinspectionmanager', verifyAccessToken, UserController.viewinspectionmanager);


/**
 * @swagger
 *
 * /user/assigninpectionmanagertoprocuremanager:
 *   post:
 *     tags:
 *       - User
 *     description: Admin can assign his inspection Manager to Procure Manager 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: checklistnumber
 *         description: Enter PM user name and IM user Name
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             procure_manger_user_name:
 *               type: string
 *               default: null
 *             inspection_manager_user_name:
 *               type: string
 *               default: null
 *     responses:
 *       200:
 *         description: Assignment Success
  *       401:
 *         description: Only Admin can assign Inspection Manager to other Procure Manager
 *       403: 
 *         description: You do not have necessary permissions to get token
 */
router.post('/assigninpectionmanagertoprocuremanager', verifyAccessToken, UserController.assigninpectionmanagertoprocuremanager);






/**
 * @swagger
 *
 * /user/viewcategory:
 *   get:
 *     tags:
 *       - User
 *     description: Except Client others can able to see the category list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Display Category List
 *       403: 
 *         description: You do not have necessary permissions to get token
 */
router.get('/viewcategory', verifyAccessToken, UserController.viewcategory);





module.exports = router