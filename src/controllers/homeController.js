const Contact = require('../models/ContactModel')

exports.index = async (req, res) => {
  let contacts = await Contact.searchContacts()
  res.render('index', { contacts });
  return;
};

