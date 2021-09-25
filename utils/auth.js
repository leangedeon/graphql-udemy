const bcrypt = require('bcrypt')
const User = require('../schema/models/user')
const jwt =  require('jsonwebtoken')
const SECRET_KEY_JWT_COURSES_API = process.env.SECRET_KEY_JWT_COURSES_API;

const auth = {
    login: async(email, password, secretKey) => {
        const user = await User.findOne({email: email})
        console.log('Login', email)
        if(!user) return {error: 'Usuario o contraseña incorrectos'}

        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) return {error: 'Usuario o contraseña incorrectos'}

        const token = await jwt.sign({
            _id: user._id,
            name: user.name,
            date: user.date,
        }, secretKey)

        console.log('Login User', user)

        console.log('Login token', token)

        return {message: 'login correcto', token:token}
    },
    checkHeaders: (req, res, next) => {
        const token = req.header('Authorization')
        
        if (!token) {
            req.user = { auth: false }
            return next()
        }

        console.log('token', token)

        const jwtToken = token.split(' ')[1]
        
        console.log('jwtToken', jwtToken)
        
        if (token) {    
            try {
                const payload = jwt.verify(jwtToken, SECRET_KEY_JWT_COURSES_API)
                console.log('payload', payload)
                req.user = payload
                req.user.auth = true;
                return next()
            }catch (e){
                console.log(e.message)
                req.user = { auth: false }
                return next()
            }
        } else {
            req.user = { auth: false }
            return next()
        }
    }
}

module.exports = auth;