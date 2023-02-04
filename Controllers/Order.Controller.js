const createError = require('http-errors')
const { createorderSchema, updateorderSchema ,orderListSchema, updateOrderChecklistSchema} = require('../helpers/validation_schema')
const fs = require('fs')

const client = require('../helpers/init_redis')
const keyHelper = require('../helpers/generate_keys')

//load models
const User = require('../Models/User.model')
const Checklist = require('../Models/Checklist.model')
const OrderCheckListDetails = require('../Models/OrderCheckListDetails.model')
const Order = require('../Models/Order.model')

//load sequalize
const Sequelize = require('sequelize');

//load multer for file uploading
const multer  = require('multer');
const fileFilter = (req, file, callback) => {
    const ext = file.mimetype;
    if (process.env.WHITELIST_FILE_EXT.includes(ext)) {
        callback(null, true);
    } else {
        callback(new Error('The selected file type is not allowed'), false);
    }
}

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({ 
    storage : storage,
    limits: {
        fileSize: 1024 * 1024 * 50,
    },
    fileFilter: fileFilter
}).single('userPhoto');


module.exports = {

    createorder: async (req, res, next) => {

        try { 

            //console.log(req.body)

            const userId = req.payload.aud;
            const user = await User.findOne({
                attributes:['user_name', 'user_type', 'parent_id'],
                where: { 
                    user_id: userId
                },
                raw:true
            });

            if (!user) throw createError.NotFound('User not registered')

            if(user.user_type!=2){
                throw createError.Conflict('Procure Manager only create order')
            }

            result = await createorderSchema.validateAsync(req.body) 


            const chelistnumberExist= await Checklist.findOne({
                where: { 
                    checklist_no: result.checklistnumber
                } 
            });

            if (!chelistnumberExist) throw createError.NotFound('Checklist number not Found!!')

            /*const doesExist = await Order.findOne({
                where: { 
                    order_no: result.ordernumber
                } 
            });

            if (doesExist){
                throw createError.Conflict(`${result.ordernumber} duplicate order no.`)
            } */


            const IM_id = await User.findOne({
                attributes:['user_id'],
                where: { 
                    user_name: result.username_inspection_manager
                },
                raw:true
            });

            if (!IM_id) throw createError.NotFound('Inspection Manager not Found!!')

            const Client_id = await User.findOne({
                attributes:['user_id'],
                where: { 
                    user_name: result.client_username
                },
                raw:true
            });

            if (!Client_id) throw createError.NotFound('Client not Found!!')

            const createOrder = await Order.create({
                order_no: keyHelper.orderrandomnumber,
                order_amount: req.body.orderamount,
                order_by: userId,
                assign_inspection_manager:IM_id.user_id,
                client_id:Client_id.user_id,
                order_status: 0
            })


            const createOrderCheckListDetails = await OrderCheckListDetails.create({                
                order_id: createOrder.order_id,
                checklist_id: chelistnumberExist.checklist_id,
                ocd_is_liscence_present: chelistnumberExist.is_liscence_present,
                ocd_is_driver_number_active: chelistnumberExist.is_driver_number_active,
                ocd_is_vehicle_rc_present:chelistnumberExist.is_vehicle_rc_present,
                ocd_is_prod_present:chelistnumberExist.is_prod_present,
                ocd_is_image_require:chelistnumberExist.is_image_require,
                ocd_is_note_require:chelistnumberExist.is_note_require
            });                      

            res.send({
              status: 200,
              message: 'Order Created Successfully',
            });
            
        }catch (error) {

            next(error)
        }        

    },  

    vieworderlistall: async (req, res, next) =>{
        try{

                const userId = req.payload.aud;

                const user = await User.findOne({
                    attributes:['user_name', 'user_type', 'parent_id'],
                    where: { 
                        user_id: userId
                    },
                    raw:true
                });

                if (!user) throw createError.NotFound('User not registered')

                if(user.user_type>2){
                    throw createError.Conflict('Admin and Procure manager will see the order list')
                }

                OrderCheckListDetails.hasMany(Order, { foreignKey: 'order_id'})
                Order.belongsTo(OrderCheckListDetails, {foreignKey: 'order_id', targetKey: 'order_id'})

                let whereClause;
                if(user.user_type==2){
                     whereClause = {order_by: userId };
                }
         

                const orderlist = await OrderCheckListDetails.findAll({
                    attributes:[   
                        'ocd_is_liscence_present',  
                        'ocd_is_driver_number_active', 
                        'ocd_is_vehicle_rc_present',
                        'ocd_is_prod_present',
                        'ocd_is_image_require',
                        'ocd_is_note_require',
                    ],
                    include: [{
                        model: Order,
                        attributes: [
                            ['order_no','ordernumber'],
                            [Sequelize.literal(`CASE order_status WHEN '0' THEN 'New Order' WHEN '1' THEN 'Complete' WHEN '2' THEN 'Checklist Met' ELSE 'Not Processed' END`), 'orderstatus']
                        ],
                        where: whereClause,
                        required: false
                    }]
                });      

                res.send({
                      status: 200,
                      message: 'Order List successfully Fetched',
                      data: orderlist
                });

        }catch(error){
            next(error)
        }

    },

    vieworderlist: async (req, res, next) =>{
        try{

            /*const result = await orderListSchema.validateAsync(req.body) 

            const orderdetails = await Order.findOne({
                where: { 
                    order_no: req.body.ordernumber
                } 
            });


            if (!orderdetails){
                throw createError.Unauthorized(`Order Number Not Found!!`) 
            } 


            var query = {
                      attributes: [
                        'order_no',
                        [Sequelize.literal(`CASE order_status WHEN '1' THEN 'Processed' WHEN '2' THEN 'Processing' ELSE 'Not Processed' END`), 'orderstatus']
                      ],
                      where: {
                        order_no: result.ordernumber
                      },                      
                      raw: true
                    };
            */  

            const userId = req.payload.aud;

            const user = await User.findOne({
                attributes:['user_name', 'user_type', 'parent_id'],
                where: { 
                    user_id: userId
                },
                raw:true
            });

            if (!user) throw createError.NotFound('User not registered')

            if(user.user_type!=3){
                throw createError.Conflict('Only Inspection Manager can inspect their assigened order')
            }


            OrderCheckListDetails.hasMany(Order, { foreignKey: 'order_id'})
            Order.belongsTo(OrderCheckListDetails, {foreignKey: 'order_id', targetKey: 'order_id'})  

            let orderlist = await OrderCheckListDetails.findAll({
                attributes:[   
                    'ocd_is_liscence_present',  
                    'ocd_is_driver_number_active', 
                    'ocd_is_vehicle_rc_present',
                    'ocd_is_prod_present',
                    'ocd_is_image_require',
                    'ocd_is_note_require',
                    'ocd_image',
                ],
                include: [{
                    model: Order,
                    attributes: [
                        ['order_no','ordernumber'],
                        [Sequelize.literal(`CASE order_status WHEN '0' THEN 'New Order' WHEN '1' THEN 'Complete' WHEN '2' THEN 'Checklist Met' ELSE 'Not Processed' END`), 'orderstatus']
                    ],
                    where: {
                        assign_inspection_manager: userId
                    }
                }]
            }); 

            if( Object.keys(orderlist).length === 0){
                orderlist ="No Record found."
            }     

            res.send({
                  status: 200,
                  message: 'Order List successfully Fetched',
                  data: orderlist
            });

        }catch(error){
            next(error)
        }
    },

    uploadfile: async (req, res, next) =>{

        try{

            upload(req,res,async(err) => {
                if(err) {
                    console.log(err)
                    return res.end("Error uploading file.");
                }

                            
                const orderdetails = await Order.findOne({
                    where: { 
                        order_no: req.body.ordernumber
                    } 
                });

                if (!orderdetails){
                    fs.unlinkSync(req.file.path)
                    return res.end(`Order Number Not Found!!`) 
                } 

                const CheckImageRequireOrNot = await OrderCheckListDetails.findOne({
                    where: { 
                        order_id: orderdetails.order_id,
                        ocd_is_image_require:1
                    } 
                });

                if (!CheckImageRequireOrNot){
                    fs.unlinkSync(req.file.path)
                    return res.end(`Order Number Does not require Image`) 
                }

                if(CheckImageRequireOrNot.ocd_image!=''){
                    var filePath = 'uploads/'+CheckImageRequireOrNot.ocd_image; 
                    fs.unlinkSync(filePath);
                }

                //console.log(req.file)
                const mimetype = req.file.mimetype.split("/");
                const extension= mimetype[1];
                const filenewname = CheckImageRequireOrNot.details_id+'.'+extension;
                const newnamefilepath = 'uploads/'+CheckImageRequireOrNot.details_id+'.'+extension;
              

                fs.rename(req.file.path, newnamefilepath, async(err)=> {
                    if (err) throw err;
                    console.log('File Renamed.');

                    const UpdateOrderCheckListDetails = await OrderCheckListDetails.update({
                        ocd_image: filenewname
                    },{
                        where: { details_id: CheckImageRequireOrNot.details_id },
                        returning: true,
                        plain: true
                    });
                });

                res.send({
                    status: 200,
                    message: `Image is uploaded in respect of order number ${req.body.ordernumber}`
                });
            });


        }catch(error){
            next(error)
        }

    },

    updateorderchecklist: async (req, res, next) =>{

        try{
                const userId = req.payload.aud;

                const user = await User.findOne({
                    attributes:['user_type'],
                    where: { 
                        user_id: userId
                    },
                    raw:true
                });

                if (!user) throw createError.NotFound('User not registered')

                if(user.user_type!=3){
                    throw createError.Conflict('Only Inspection Manager Update their respective order checklist')
                }


                const result = await updateOrderChecklistSchema.validateAsync(req.body) 

                const order = await Order.findOne({
                    attributes:['order_id', 'order_no','assign_inspection_manager','order_status'],
                    where: { 
                        order_no: result.orderNumber
                    },
                    raw:true
                });

                if (!order) throw createError.NotFound('Order No Found!!')

                console.log(order.order_status)    
                if(order.order_status==2) 
                    throw createError.NotFound(`Checklist already updated for order no ${result.orderNumber}`);   

                if(order.assign_inspection_manager!=userId) 
                    throw createError.NotFound('Not assigned to fill this order no checklist');       


                const checklistdetails= await OrderCheckListDetails.findOne({
                    where: { 
                        order_id: order.order_id
                    },
                    raw:true
                });

                let is_image_require_checklist = checklistdetails.ocd_is_image_require;
                if(is_image_require_checklist==1 && checklistdetails.ocd_image=="")
                    throw createError.NotFound(`Order no ${result.orderNumber} required image. Please upload image before update checklist`);    



                /*let license_present_or_not = (checklistdetails.ocd_is_liscence_present > 0) ? true : false;
                let is_driver_number_active = (checklistdetails.ocd_is_driver_number_active > 0) ? true : false;
                let is_vehicle_rc_present = (checklistdetails.ocd_is_vehicle_rc_present > 0) ? true : false;
                let is_prod_present = (checklistdetails.ocd_is_prod_present > 0) ? true : false;

      

                if(license_present_or_not!=result.driverDetails.isLiscencePresent){

                    throw createError.NotFound('Please check liscense present or not for order no -'+result.orderNumber)
                }

                if(is_driver_number_active!=result.driverDetails.isDriverNumberActive){

                    throw createError.NotFound('Please check Driver Number Require or not for order no -'+result.orderNumber)
                }

                if(is_vehicle_rc_present!=result.driverDetails.isVehicleRcPresent){

                    throw createError.NotFound('Please check Vechiel RC Present or not for order no -'+result.orderNumber)
                }

                if(is_prod_present!=result.isProductPresent){

                    throw createError.NotFound('Please check Product Present or not for order no -'+result.orderNumber)
                }*/


                const UpdateOrderchecklist = await OrderCheckListDetails.update({
                    ocd_is_liscence_present: result.driverDetails.isLiscencePresent,
                    ocd_is_driver_number_active: result.driverDetails.isDriverNumberActive,
                    ocd_is_vehicle_rc_present: result.driverDetails.isVehicleRcPresent,
                    ocd_is_prod_present: result.isProductPresent,
                    ocd_note: result.note,
                    ocd_category:result.category,
                },{
                    where: { details_id: checklistdetails.details_id },
                    returning: true,
                    plain: true
                });


                const UpdateOrder = await Order.update({
                    order_status: 2
                },{
                    where: { order_id: checklistdetails.order_id },
                    returning: true,
                    plain: true
                });

                res.send({
                    status: 200,
                    message: `Checklist update for order no: ${result.orderNumber} `
                });
        }catch(error){
            next(error)
        }

    },

    updateorder: async (req, res, next) =>{

        try{
                const userId = req.payload.aud;

                const user = await User.findOne({
                    attributes:['user_type'],
                    where: { 
                        user_id: userId
                    },
                    raw:true
                });

                if (!user) throw createError.NotFound('User not registered')

                if(user.user_type!=2){
                    throw createError.Conflict('Only Procure Manager Update their respective order')
                }

         
                const result = await updateorderSchema.validateAsync(req.body) 

                const orderdetails = await Order.findOne({
                    attributes:['order_id', 'order_no','assign_inspection_manager','order_status','order_by'],
                    where: { 
                        order_no: req.body.ordernumber
                    } 
                });

          
                if (!orderdetails) throw createError.NotFound('Order No Found!!')

                if (orderdetails.order_by!=userId) throw createError.NotFound('Order not belongs') 

                if(orderdetails.order_status==1) 
                    throw createError.NotFound('Order Already Updated')                 

                if(orderdetails.order_status!=2)
                    throw createError.NotFound('For Completion order should passed checklist from Inspection Manager')


                const UpdateOrder = await Order.update({
                    order_status: 1
                },{
                    where: { order_id: orderdetails.order_id },
                    returning: true,
                    plain: true
                });

                res.send({
                    status: 200,
                    message: `Order update as complete for order no: ${result.ordernumber} `
                });

        }catch(error){
            next(error)
        }

    },

    clientorderview: async (req, res, next) =>{

        try{
            const userId = req.payload.aud;

            const user = await User.findOne({
                attributes:['user_type'],
                where: { 
                    user_id: userId
                },
                raw:true
            });

            if (!user) throw createError.NotFound('User not registered')

            if(user.user_type!=4){
                throw createError.Conflict('Only Client can view their order status')
            }

            const orderdetails = await Order.findOne({
                attributes:[
                    'order_no',
                    'order_status',
                    [Sequelize.literal(`CASE order_status WHEN '0' THEN 'New Order' WHEN '1' THEN 'Complete' WHEN '2' THEN 'Checklist Met' ELSE 'Not Processed' END`), 'order_status']
                ],
                where: { 
                    client_id: userId
                },
                raw:true
            });

            if (!orderdetails) throw createError.NotFound('Order No Found!!')

            res.send({
                  status: 200,
                  message: 'Order List successfully Fetched',
                  data: orderdetails
            });


        }catch(error){

            next(error)

        }
    }


}        