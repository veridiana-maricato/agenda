const Contact = require('../models/ContactModel')

exports.index = (req, res) => {
    res.render('contact', {
        contact: {}
    })
}

exports.register = async (req, res) => {
    try {
        const contact = new Contact(req.body)
        await contact.register()

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors)
            req.session.save(() => res.redirect('/contact/index'))
            return
        }

        req.flash('success', 'One more contatinho registered, nice.')
        req.session.save(() => res.redirect(`/`))
        return

    } catch (e) {
        console.log(e)
        return res.render('404')
    }
}

exports.editIndex = async (req, res) => {
    if (!req.params.id) return res.render('404')
    const contact =  await Contact.searchId(req.params.id)
    if (!contact) return res.render('404')
    res.render('contact', {
        contact
    })
}

exports.edit = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404')
        const contact = new Contact(req.body)
        await contact.edit(req.params.id)

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors)
            req.session.save(() => res.redirect('/contact/index'))
            return
        }

        req.flash('success', "You're little contact was edited")
        req.session.save(() => res.redirect(`/`))

        return
    } catch (e) {
        console.log(e)
        return res.render('404')
    }

}
exports.delete = async (req, res) => {
    if (!req.params.id) return res.render('404')

    const contact =  await Contact.delete(req.params.id)
    if (!contact) return res.render('404')

    req.flash('success', 'Little contact deleted (it was about time)')
    req.session.save(() => res.redirect(`/`))
    return
}