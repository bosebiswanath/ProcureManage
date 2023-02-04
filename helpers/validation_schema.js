const Joi = require('@hapi/joi')

const regSchema = Joi.object({
    username: Joi.string().email().required(),
    type: Joi.number().min(2).max(4).required().error(new Error("Type should be between 2 to 4")),
    password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    fullname: Joi.string().min(3).max(50).required(),
})

const loginSchema = Joi.object({
    username: Joi.string().regex(/^([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$/).required().messages({
      "string.base": `"username" should be a type of 'text'`,
      "string.empty": `"username" cannot be an empty field`,
      "string.min": `"username" should have a minimum length of {#limit}`,
      "string.max": `"username" should have a maximum length of {#limit}`,
      "any.required": `"username" is a required field`
    }),
    password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})

const inspectionmanagerSchema =Joi.object({
    username: Joi.string().regex(/^[0-9]{10}$/).required().error(new Error("For Inspection Manager registration username should be Phone number and 10 digits")),
    type: Joi.number().min(2).max(4).required().error(new Error("Type should be between 2 to 4")),
    password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    fullname: Joi.string().min(3).max(50).required(),
})

const createorderSchema =Joi.object({
    checklistnumber: Joi.number().min(3).required().error(new Error("Checklist Number should be between 3 to 10")),
    orderamount: Joi.string().regex(/^\d+(?:\.\d{0,2})$/).required().error(new Error("Order amount accept 2 digit after decimal")),
    username_inspection_manager:Joi.string().regex(/^[0-9]{10}$/).required().error(new Error("Inspection Manager username should be Phone number and 10 digits")),
    client_username:Joi.string().email().required()
})

const updateorderSchema =Joi.object({
    ordernumber: Joi.number().required().error(new Error("Order Number should be between 4 to 10")),  
})

/*const orderListSchema =Joi.object({
    ordernumber: Joi.number().min(4).required().error(new Error("Order Number should be between 4 to 10")),
  
})*/

const checklistSchema =Joi.object().keys({ 
    isProdPresent:Joi.boolean().required(),
    isImageRequire:Joi.boolean().required(),
    checklistName: Joi.string().required(),
    isnoteRequire:Joi.boolean().required(),
    driverDetails:Joi.object().keys({
        isLiscencePresent: Joi.boolean().required(),
        isDriverNumberActive: Joi.boolean().required(),        
        isVehicleRcPresent: Joi.boolean().required(),
    })
})

const updateOrderChecklistSchema =Joi.object().keys({ 
    orderNumber: Joi.number().min(4).required().error(new Error("Order Number should be between 4 to 10")),
    isProductPresent:Joi.boolean().required(),
    category:Joi.string().regex(/^[0-9,]*$/).required().error(new Error("Multiple category no should be seperated by comma (,)")),
    note:Joi.string(),
    driverDetails:Joi.object().keys({
        isLiscencePresent: Joi.boolean().required().error(new Error("isLiscencePresent value must be true or false ")),
        isDriverNumberActive: Joi.boolean().required().error(new Error("isDriverNumberActive value must be true or false ")),        
        isVehicleRcPresent: Joi.boolean().required().error(new Error("isVehicleRcPresent value must be true or false ")),
    })
})

module.exports = {
    regSchema,
    inspectionmanagerSchema,
    loginSchema,
    createorderSchema,
    updateorderSchema,
    updateOrderChecklistSchema,
    checklistSchema,
}