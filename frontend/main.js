import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Login from './modules/Login'
import './assets/css/style.css';


const register = new Login('.form-register')
const login = new Login('.form-login')
login.init()
register.init()

// import './assets/css/style.css';

 