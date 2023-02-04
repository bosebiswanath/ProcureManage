const createError = require('http-errors')
//load models
const User = require('../Models/User.model')
const Userdetails = require('../Models/Userdetails.model')
const Category = require('../Models/Category.model')
const Sequelize = require('sequelize');

module.exports = {

    viewprocuremanager: async (req, res, next) => {

        try{
                const userId = req.payload.aud;                         
                const user = await User.findOne({
                    attributes:['user_name', 'user_type', 'parent_id'],
                    where: { 
                        user_id: userId
                    },
                    raw:true
                });

                if (user){
                    if (!user) throw createError.NotFound('User not registered')
                }

                if(user.user_type>1){
                    throw createError.Unauthorized('Only Admin only see Procure Manager')
                }
       


                User.hasMany(Userdetails, {foreignKey: 'user_id'})
                Userdetails.belongsTo(User, {foreignKey: 'user_id'})

                const procurenmanager_list= await User.findAll(
                    { 
                        attributes:['user_name'],
                        where: { parent_id: userId, user_type:2 },
                        include: [{
                            model: Userdetails,
                            required: false,
                            attributes: ['full_name']
                        }]                        
                    });

                //console.log(inspectionmanager_list);


                res.send({
                      status: 200,
                      message: 'Successfully Fetched',
                      data: procurenmanager_list
                });

        }catch(error){
            next(error)
        }

    },

    viewinspectionmanager: async (req, res, next) => {

        try{
                const userId = req.payload.aud;                         
                const user = await User.findOne({
                    attributes:['user_name', 'user_type', 'parent_id'],
                    where: { 
                        user_id: userId,
                        user_status: 1
                    },
                    raw:true
                });

                if (user){
                    if (!user) throw createError.NotFound('User not registered')
                }

                if(user.user_type>2){
                    throw createError.Unauthorized('Only Admin and Procure Manager only see their Inspection Manager')
                }
       


                User.hasMany(Userdetails, {foreignKey: 'user_id'})
                Userdetails.belongsTo(User, {foreignKey: 'user_id'})

                const inspectionmanager_list= await User.findAll(
                    { 
                        attributes:['user_name'],
                        where: { parent_id: userId, user_type:3 },
                        include: [{
                            model: Userdetails,
                            required: false,
                            attributes: ['full_name']
                        }]                        
                    });

                //console.log(inspectionmanager_list);
                let Responseresult= inspectionmanager_list;
                if( Object.keys(inspectionmanager_list).length === 0){
                    Responseresult ="No Record found."
                }


                res.send({
                      status: 200,
                      message: 'Successfully Fetched',
                      data: Responseresult
                });

        }catch(error){
            next(error)
        }

    },


    assigninpectionmanagertoprocuremanager: async (req, res, next) => {

        try{
                const userId = req.payload.aud;                         
                const user = await User.findOne({
                    attributes:['user_name', 'user_type', 'parent_id'],
                    where: { 
                        user_id: userId
                    },
                    raw:true
                });

                if (user){
                    if (!user) throw createError.NotFound('User not registered')
                }

                if(user.user_type>1){
                    throw createError.Unauthorized('Only Admin can assign Inspection Manager to other Procure Manager')
                }
       
                const checkPM = await User.findOne({
                    attributes:['user_id'],
                    where: {
                        user_name: req.body.procure_manger_user_name,
                        user_type:2,
                        user_status: 1
                    },
                    raw:true
                })

                if (!checkPM) throw createError.NotFound('PM not registered')


                const checkIM = await User.findOne({
                    attributes:['user_id'],
                    where: {
                        user_name: req.body.inspection_manager_user_name,
                        user_type:3,
                        user_status: 1
                    },
                    raw:true
                })

                if (!checkIM) throw createError.NotFound('IM not registered')

                const Updateassign = await User.update({
                    parent_id: checkPM.user_id
                },{
                    where: { user_id: checkIM.user_id },
                    returning: true,
                    plain: true
                });

                res.send({
                      status: 200,
                      message: 'Assignment Success'
                });

        }catch(error){
            next(error)
        }

    },

    viewcategory: async (req, res, next) => {

        try{
                const userId = req.payload.aud;                         
                const user = await User.findOne({
                    attributes:['user_name', 'user_type', 'parent_id'],
                    where: { 
                        user_id: userId
                    },
                    raw:true
                });

                if (user){
                    if (!user) throw createError.NotFound('User not registered')
                }

                if(user.user_type>3){
                    throw createError.Unauthorized('Only client not able to see the Category List')
                }
       

                const category_list= await Category.findAll({                     
                    attributes:['category_no','category_name'],                                              
                });

                //console.log(inspectionmanager_list);


                res.send({
                      status: 200,
                      message: 'Successfully Fetched',
                      data: category_list
                });

        }catch(error){
            next(error)
        }

    },

}        