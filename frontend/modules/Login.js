import validator from 'validator'

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass)
    }

    init() {
        this.events()
    }

    events() {
        if (!this.form) return
        this.form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.validate(e)
        })
    }

    validate(e) {
        const el = e.target
        const emailInput = el.querySelector('input[name="email"]')
        const passwordInput = el.querySelector('input[name="password"]')
        let error = false
        if(!validator.isEmail(emailInput.value)){
            alert('Invalid email')
            error = true
        }
        if(passwordInput.value.length < 6){
            alert('Are you TRYING to be hacked? You can remember a password longer than 5 characters.')
            error = true
        }
        if(passwordInput.value.length > 25){
            alert("You defnetly don't need this much security, this is just a regular app, not you bank account.")
            error = true
        }

        if(!error) el.submit()

    }
}