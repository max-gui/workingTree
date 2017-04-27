/**
 * Created by zzj on 2016/08/09.
 */
var login = require('../controllers/loginController');
var cmsHome = require('../controllers/cms/cmsHome');

module.exports = function (app) {
	/** Login STA */
	app.get('/', login.showPage);
	app.post('/doLogin',login.doLogin);
	app.get('/logout',login.logout);
	/** Login END */
	app.get('/home', cmsHome.showPage);

}