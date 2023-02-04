const createError = require('http-errors')
const { loginSchema, regSchema, inspectionmanagerSchema } = require('../helpers/validation_schema')

const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwt_helper')
const client = require('../helpers/init_redis')
const passHelper = require('../helpers/passHelper')

//load models
const User = require('../Models/User.model')
const Userdetails = require('../Models/Userdetails.model')

const Sequelize = require('sequelize');
module.exports = {

    register: async (req, res, next) => {
        try { 
                
                const userId = req.payload.aud;

                const userdetails = await User.findOne({
                    attributes:['user_type'],
                    where: { 
                        user_id: userId
                    } 
                });

               
                if (!userdetails){
                    throw createError.Unauthorized(`SomeThis went Wrong.`) 
                } 


                let result;

                //console.log(req.body)

                if(userdetails.user_type>2) {
                    throw createError.Unauthorized('Only Admin and PM can Create others')
                }

                if(userdetails.user_type==2 && (req.body.type==2)) {
                    throw createError.Unauthorized('Procure Manager only create Inspection Manager and Client')
                }

                if(req.body.type==1){
                    throw createError.Unauthorized('Invalid User Type.')
                }

                if(req.body.type==2 ||req.body.type==4) 
                    result = await regSchema.validateAsync(req.body)  
                
                if(req.body.type==3) 
                    result = await inspectionmanagerSchema.validateAsync(req.body)  


                const doesExist = await User.findOne({
                    where: { 
                        user_name: result.username
                    } 
                });

                if (doesExist){
                    throw createError.Conflict(`${result.username} is already been registered.`)
                }

                const hashPassword = await passHelper.hashPassword(result.password)
                const savedUser = await User.create({
                    user_name: req.body.username,
                    user_password: hashPassword,
                    user_type: req.body.type,
                    parent_id: userId
                })

                const savedUserDetails = await Userdetails.create({        
                    user_id: savedUser.user_id,
                    full_name:req.body.fullname
                })

           
                res.send({
                  status: 200,
                  message: 'Registration successfull',
                  data: savedUser
                });

        } catch (error) {
              if (error.isJoi === true) error.status = 422
              next(error)
        }
    },


    login: async (req, res, next) => {
        try {
                const result = await loginSchema.validateAsync(req.body)
                const user = await User.findOne({
                    attributes:['user_id', 'user_password'],
                    where: {
                        user_name: result.username,
                        user_status: 1
                    },
                    raw:true
                })

                if (!user) throw createError.NotFound('User not registered')

                const isMatch = await passHelper.isValidPassword(result.password, user.user_password)
                if (!isMatch)
                    throw createError.Unauthorized('Invalid Username/Password')


                const accessToken = await signAccessToken(user.user_id)
                const refreshToken = await signRefreshToken(user.user_id)

                let makeSecure = false
                if (process.env.COOKIE_SAME_SITE == 'none') {
                    makeSecure = true
                }

                res.status(202).cookie('secretCookie', accessToken, {
                    sameSite: process.env.COOKIE_SAME_SITE,
                    path: '/',
                    expires: new Date(new Date().getTime() + process.env.ACCESS_TOKEN_EXPIRY * 1000),
                    httpOnly: true,
                    domain: process.env.COOKIE_DOMAIN,
                    secure: makeSecure
                });

                res.status(202).cookie('secretCook', refreshToken, {
                    sameSite: process.env.COOKIE_SAME_SITE,
                    path: '/',
                    expires: new Date(new Date().getTime() + process.env.REFRESH_TOKEN_EXPIRY * 1000),
                    httpOnly: true,
                    domain: process.env.COOKIE_DOMAIN,
                    secure: makeSecure
                });

                res.send({ 
                    'status': 200,
                    'message': 'Login successfull'
                })

        } catch (error) {
          if (error.isJoi === true)
            return next(createError.BadRequest('Invalid Username/Password'))
            next(error)
        }
    },

    refreshToken: async (req, res, next) => {
        try {

            if (req.cookies.secretCook == '') throw createError.BadRequest('Refresh token is required to generate new access token.');
            let refreshToken = '';
            if (req.body.refreshToken) {
                refreshToken = req.body.refreshToken;
            }

            if (req.cookies.secretCook) {
                refreshToken = req.cookies.secretCook
            }
            const userId = await verifyRefreshToken(refreshToken);
            if (!userId) throw createError.BadRequest('Invalid Refresh token or it has been expired, try to Login!')

            const newAccessToken = await signAccessToken(userId);
            const newRefreshToken = await signRefreshToken(userId);

            let makeSecure = false
            if (process.env.COOKIE_SAME_SITE == 'none') {
                makeSecure = true
            }

            res.status(202).cookie('secretCookie', newAccessToken, {
                sameSite: process.env.COOKIE_SAME_SITE,
                path: '/',
                expires: new Date(new Date().getTime() + process.env.ACCESS_TOKEN_EXPIRY * 1000),
                httpOnly: true,
                domain: process.env.COOKIE_DOMAIN,
                secure: makeSecure
            });
            res.status(202).cookie('secretCook', newRefreshToken, {
                sameSite: process.env.COOKIE_SAME_SITE,
                path: '/',
                expires: new Date(new Date().getTime() + process.env.REFRESH_TOKEN_EXPIRY * 1000),
                httpOnly: true,
                domain: process.env.COOKIE_DOMAIN,
                secure: makeSecure
            });
            return res.send({
                'status': 200,
                'message': 'New Access Token generated successfully.',
            });
        } catch (error) {
            next(error)
        }
    },

    logout: async (req, res, next) => {
        try {            
                if (req.body.refreshToken == '' || req.cookies.secretCook == '') throw createError.BadRequest('Alert!! something unexpected happened, contact admin.');
                let refreshToken = '';
                if (req.body.refreshToken) {
                    refreshToken = req.body.refreshToken;
                }

                if (req.cookies.secretCook) {
                    refreshToken = req.cookies.secretCook;
                }
                res.clearCookie('secretCookie', { domain: process.env.COOKIE_DOMAIN });
                res.clearCookie('secretCook', { domain: process.env.COOKIE_DOMAIN });
                const userId = await verifyRefreshToken(refreshToken)

                client.DEL(`auth-${userId}`, (err, val) => {
                    if (err) {
                        throw createError.InternalServerError()
                    }
                    res.send({ 
                        status: 204,
                        message: 'Logout success.'
                    })
                });

        } catch (error) {
          next(error)
        }
    },
}