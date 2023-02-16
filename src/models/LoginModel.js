const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {

    this.validates()

    if (this.errors.length > 0) return

    // if user is already on database, then this.user becomes the user from database (created by LoginModel)
    this.user = await LoginModel.findOne({ email: this.body.email })

    // in case user is not on database
    if (!this.user) {
      this.errors.push('Invalid user or password')
      return
    }

    // checks if password from req.body is equal to the user's password (which became a hash when user was created with the method register.)
    // ps: this.body.password became a hash INSIDE the register method. Outside of it, it is still the password written on the form's input.
    // this means that, when the user is created ALSO inside the register method, it access the new value of this.body.password. 
    // that is why user.password is a hash. Because, it is defined that this.user is no longer null: it is the user found on the database, which was created by LoginModel.
    // the user created and saved on database has a hash for a password, as it was defined by register method. 
    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Invalid user or password')

      // if the password does not match the hash, than user is no longer the user found on database. Now user is again null.
      this.user = null
      return  
    }

    // if user passes the validations above, than user is, to this point, still equal to user found on database (created by LoginModel)
  }

  async register() {
    this.validates()
    if (this.errors.length > 0) return

    // checks if user is already on database
    await this.userExists()

    if (this.errors.length > 0) return

    // creating password hash
    const salt = bcryptjs.genSaltSync()
    this.body.password = bcryptjs.hashSync(this.body.password, salt)

    // user is no longer null
    // user is a key of Login's constructor and now it will have a value created by the LoginModel based on the params recieved while creating an instance of Login.
    // this means that if login is an instance of Login (on loginController) and it recieves req.body as param, this.user will be created based on the params recieved on the req.body 
    this.user = await LoginModel.create(this.body)
  }

  async userExists() {
    // checks if there's already an user on database with the same e-mail 
    this.user = await LoginModel.findOne({ email: this.body.email })
    if (this.user) this.errors.push('User already registered')
  }

  validates() {
    this.cleanUp()

    // validates email
    if (!validator.isEmail(this.body.email)) { this.errors.push('Email not valid') }

    // validates password
    if (this.body.password.length < 6 || this.body.password.length > 50) { this.errors.push('Password must be between 6 and 50 characters long') }
  }

  cleanUp() {
    // if there are any inputs that are not strings, they will return as empty strings
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = ''
      }
    }

    // body will no longer contain csrf token (only email and password), so it won't be saved on database
    // csrf will be useful only while validating tokens
    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login;
