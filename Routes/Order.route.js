"use strict";

const express = require('express')
const router = express.Router()
//Biswa2022

const OrderController = require('../Controllers/Order.Controller')

const { verifyAccessToken } = require('../helpers/jwt_helper');

/**
 * @swagger
 *
 * /order/createorder:
 *   post:
 *     tags:
 *       - Order
 *     description: Procurement manager will create orders
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: checklistnumber
 *         description: Enter Checklist Number ( You can get checklist number from viewchecklist)
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             checklistnumber:
 *               type: string
 *               default: null
 *             orderamount:
 *               type: string
 *               default: 0
 *             username_inspection_manager:
 *               type: string
 *               default: null
 *             client_username:
 *               type: string
 *               default: null
 *     responses:
 *       200:
 *         description: New order successfully created.
 *       403: 
 *         description: You do not have necessary permissions to create order.
 */
router.post('/createorder', verifyAccessToken, OrderController.createorder);


/**
 * @swagger
 *
 * /order/vieworderlistall:
 *   get:
 *     tags:
 *       - Order
 *     description: Admin view all order list, Procure manager view their created order list, 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: All orderlist successfully fetched.
 *       403: 
 *         description: You do not have necessary permissions to view order list.
 */
router.get('/vieworderlistall', verifyAccessToken, OrderController.vieworderlistall);

/**
 * @swagger
 *
 * /order/vieworderlist:
 *   get:
 *     tags:
 *       - Order
 *     description: Inspection manager will see their specific assigned order
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Orderlist successfully fetched.
 *       403: 
 *         description: You do not have necessary permissions to view specific order list.
 */
router.get('/vieworderlist', verifyAccessToken, OrderController.vieworderlist);



/**
 * @swagger
 * 
 * /order/uploadfile:
 *   post:
 *     tags:
 *       - Order
 *     description: Upload media file (Inspection Manager upload image for a particular order no)
 *     produces:
 *       - application/json
 *     consumes:
 *        - multipart/form-data
 *     parameters:
 *        - in: formData
 *          name: userPhoto
 *          type: file
 *          description: The file to upload.
 *          required: true
 *          x-mimetype: application/zip
 *        - in: formData
 *          name: ordernumber
 *          type: integer
 *          description: Enter Order Number (Order number should be minimum 4 Digits  )
 *          required: true
 *     responses:
 *       200:
 *         description: A new file has been uploaded successfully
 *       403: 
 *         description: You do not have necessary permissions to login
 */
router.post('/uploadfile', verifyAccessToken, OrderController.uploadfile)


/**
 * @swagger
 *
 * /order/updateorderchecklist:
 *   post:
 *     tags:
 *       - Order
 *     description: Inspection manager update their order checklist
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Checklist Data
 *         description: Inspection Manager update the Checklist Requirement (Multiple cateogry should be give comma seperated, use category_no)
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             orderNumber:
 *               type: integer
 *               default: null
 *             isProductPresent:
 *               type: boolean
 *             driverDetails:
 *               type: object
 *               properties:
 *                 isLiscencePresent:
 *                   type: boolean
 *                 isDriverNumberActive:
 *                   type: boolean
 *                 isVehicleRcPresent:
 *                   type: boolean
 *             note:
 *               type: string
 *               default: null
 *             category:
 *               type: string
 *               default: null
 *     responses:
 *       200:
 *         description: Order status successfully update.
 *       403: 
 *         description: You do not have necessary permissions to get token
 */

router.post('/updateorderchecklist', verifyAccessToken, OrderController.updateorderchecklist);




/**
 * @swagger
 * 
 * /order/updateorder:
 *   post:
 *     tags:
 *       - Order
 *     description: Only Procure manager update order. Those order have met checklist only be update as Complete.
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: formData
 *          name: ordernumber
 *          type: string
 *          description: Enter Order Number (Order number should be minimum 4 Digits ) 
 *          required: true
 *     responses:
 *       200:
 *         description: A new file has been uploaded successfully
 *       403: 
 *         description: You do not have necessary permissions to login
 */
router.post('/updateorder', verifyAccessToken, OrderController.updateorder)



/**
 * @swagger
 * 
 * /order/clientorderview:
 *   get:
 *     tags:
 *       - Order
 *     description: Only Client can view their order.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Order List Fetched successfully
 *       403: 
 *         description: You do not have necessary permissions to login
 */
router.get('/clientorderview', verifyAccessToken, OrderController.clientorderview)


module.exports = router