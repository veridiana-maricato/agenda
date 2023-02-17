const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logged')
    return res.render('login')
}

exports.register = async function (req, res) {
    try {
        const login = new Login(req.body)
        await login.register()

        if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('/login/index')
            })
            return
        }

        req.flash('success', 'User created!')
        req.session.user = login.user
        req.session.save(function () {
            return res.redirect('/')
        })

    } catch (e) {
        console.log(e)
        return res.render('404')
    }
}

exports.login = async function (req, res) {
    try {
        // creating an instance of Login class
        const login = new Login(req.body)

        // waiting for user to become the user found on database (as long as it's password matches the hash)
        await login.login() 

        if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('/login/index')
            })
            return
        }

        // at this point, user is either equal to the user found on database, or user is equal to null (if there are errors).
        // if it is null, than this function will return (because of the if above)

        req.flash('success', 'User logged in!')

        // if this is still executing, then this means user is not null.
        // because of that, the req.session.user will become the login.user.
        // remember that login.user is equal to the user found on database (composed by email and hash)
        req.session.user = login.user
        req.session.save(function () {
            return res.redirect('/')
        })
        
    } catch (e) {
        console.log(e)
        return res.render('404')
    }
}

exports.logout = function (req, res){
    req.session.destroy()
    res.redirect('/')
}