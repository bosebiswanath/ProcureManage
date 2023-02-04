const createError = require('http-errors')
const { checklistSchema} = require('../helpers/validation_schema')
const keyHelper = require('../helpers/generate_keys')

//load models
const User = require('../Models/User.model')
const Category = require('../Models/Category.model')
const Checklist = require('../Models/Checklist.model')


const Sequelize = require('sequelize');


module.exports = {


    createchecklist: async (req, res, next) => {

        try{

            const userId = req.payload.aud; 
            //console.log(userId)  

            result = await checklistSchema.validateAsync(req.body) 

            const user = await User.findOne({
                attributes:['user_name', 'user_type', 'parent_id'],
                where: { 
                    user_id: userId
                },
                raw:true
            });


            //console.log(user)  

            if (!user) throw createError.NotFound('User not registered')
            if(user.user_type!=2){
                throw createError.Unauthorized('Only Procure Manager can create checklist')
            }


            /*const categorycheck = await Category.findOne({
                attributes:['category_no'],
                where: { 
                    category_no: req.body.categoryNumber
                },
                raw:true
            });

            if (!categorycheck) throw createError.NotFound('Category number not Found!!')*/


            const ChecklistnameCheck = await Checklist.findOne({
                where: { 
                    checklist_name: req.body.checklistName
                },
                raw:true
            });

            if (ChecklistnameCheck) throw createError.NotFound('Checklist Name Already exist!!')

            const createChecklist = await Checklist.create({
                checklist_name: req.body.checklistName,
                checklist_no: keyHelper.randomnumber,
                is_liscence_present: req.body.driverDetails.isLiscencePresent,
                is_driver_number_active: req.body.driverDetails.isDriverNumberActive,
                is_vehicle_rc_present: req.body.driverDetails.isVehicleRcPresent,
                is_image_require: req.body.isImageRequire,
                is_prod_present: req.body.isProdPresent,
                is_note_require: req.body.isnoteRequire
            })

           res.send({
              status: 200,
              message: 'Checklist Created Successfully',
              checklistnumber: createChecklist.checklist_no
            });

        }catch(error){
            next(error)
        }

    },

    viewchecklist: async (req, res, next) => {

        try{

        }catch(error){
            next(error)
        }

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
                throw createError.Unauthorized('Only Procure Manager and Admin can view checklist')
            }


            const checklist_list= await Checklist.findAll({
                attributes:['checklist_name', 'checklist_no', 'is_liscence_present', 'is_driver_number_active', 'is_vehicle_rc_present', 'is_prod_present','is_image_require','is_note_require'],
            });

            //console.log(inspectionmanager_list);


            res.send({
                  status: 200,
                  message: 'Successfully Fetched',
                  data: checklist_list
            });


        }catch(error){
            next(error)
        }
    },

}        