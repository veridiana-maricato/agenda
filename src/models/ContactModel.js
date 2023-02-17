const mongoose = require('mongoose');
const validator = require('validator')


const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: false, default: '' },
  number: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const ContactModel = mongoose.model('Contact', ContactSchema);

class Contact {
  constructor(body) {
    this.body = body
    this.errors = []
    this.contact = null
  }

  cleanUp() {
    // if there are any inputs that are not strings, they will return as empty strings
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = ''
      }
    }
  }

  validates() {
    this.cleanUp()

    // validates email
    if (this.body.email && !validator.isEmail(this.body.email)) { this.errors.push('Email not valid') }

    // validates password
    if (!this.body.name) { this.errors.push('At least try to remember their name') }

    // number || email required
    if (!this.body.number && !this.body.email) { this.errors.push('Excuse me, how are you gonna contact them? Put at least one form of contact') }

  }

  async register() {
    this.validates()
    if (this.errors.length > 0) return
    this.contact = await ContactModel.create(this.body)
  }

  async edit(id) {
    if(typeof id !== 'string') return
    this.validates()
    if(this.errors.length > 0) return
    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true})
  }

  static async searchId(id){
    if(typeof id !== 'string') return
    const contact = await ContactModel.findById(id)
    return contact
  } 

  static async searchContacts(){   
    const contacts = await ContactModel.find()
    .sort({createdAt: -1})
    return contacts
  } 

  static async delete(id){   
    if(typeof id !== 'string') return
    const contact = await ContactModel.findByIdAndDelete(id)
    return contact
  } 
}


module.exports = Contact;


