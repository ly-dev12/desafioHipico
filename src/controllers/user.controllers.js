const usercontroler = {};


// traer db
const User = require('../models/User');
const Fullprofile = require('../models/Fullprofile');

// requires
const nodemailer = require('nodemailer');
const randomString = require('randomstring');
const passport = require('passport');


// render register form
usercontroler.rendersignunform = (req, res) => {
    res.render('auth/signup');
}

usercontroler.processDataRegister = async(req, res) => {
    let errors = [];
    const {name, apellido, username, email, password, confirm_password, extension, phone} = req.body;
    if(password != confirm_password){
        errors.push({ text: 'Las contraseñas no coinciden' });
    }

    if(password.length < 6){
        errors.push({ text: "La contraseña debe ser mayor a 6 caracteres" });
    }

    if(errors.length > 0){
        res.render('auth/signup', {
            errors,
            name,
            apellido,
            username,
            email,
            password,
            confirm_password,
            extension,
            phone
        });
    }else{
        const emailuser = await User.findOne({email: email});
        if(emailuser){
            req.flash("error_msg", "Este correo ya esta en uso.");
            res.redirect('/signup');
        }else{
            const usernameexist = await User.findOne({username: username});
            if(usernameexist){
                req.flash("error_msg", "Este nombre de usuario introducido ya esta en uso");
                res.redirect('/signup');
            }else{
                const phoneexist = await User.findOne({phone: phone});
                if(phoneexist){
                    req.flash("error_msg", "El numero de telefono que ha introducido ya esta en uso.");
                    res.redirect('/signup');    
                }else{

                    const code = randomString.generate({
                        length: 6,
                        charset: 'alphanumeric'
                    });

                    const codeUPPER = code.toUpperCase();
                    
                    const userNew = new User({name, apellido, username, email, password, extension, phone: extension + phone, key: codeUPPER});
                    userNew.password = await userNew.encryptPassword(password);
                    await userNew.save();
                    // async..await is not allowed in global scope, must use a wrapper
            async function main() {
                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                let testAccount = await nodemailer.createTestAccount();

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'desafiohipicoapp@gmail.com', // generated ethereal user
                        pass: 'hipismo2020$#' // generated ethereal password
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                // send mail with defined transport object
                    let info = await transporter.sendMail({
                        from: '"Desafío Hípico" <desafiohipico@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: "Bienvenido a Desafío Hípico", // Subject line
                        text: "Hello world?", // plain text body
                        html: `<h2>Hola ${userNew.name}, Gracias por Registrarte en Desafío Hípico</h2>
                        <h3>Tu codigo de Validación es: ${codeUPPER}</h3>
                        <h2>Confirma tu Cuenta aquí:</h2> <a href="https://localhost:3000/account/confirm/${userNew._id}">https://localhost:3000/account/confirm/${userNew._id}</a>
                        ` // html body
                    });

                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    }

                    main().catch(console.error);
                    req.flash("success_msg", "Por favor verifica tu cuenta, Revisa tu Email");
                    res.redirect('/signin');           

                } 
            }
        }
    }
}

usercontroler.renderConfirmForm = async(req, res) => {
    const id = req.params.id;
    const userNew = await User.findOne({_id: id});
    res.render('auth/confirm', {userNew});
}

usercontroler.confirmaccountprocess = async(req, res) => {
    let errors = [];
    const { code } = req.body;
    const id = req.params.id; 
    const userNew = await User.findOne({_id: id});

    if(userNew.key != code){
        errors.push({ text: 'Error en Codigo, Inserte un codigo valido.'});
        if(errors.length > 0){
            res.render('auth/confirm', {userNew, errors});
        }
        
    }else{
        const usefind = await User.findByIdAndUpdate(userNew, {active: true});
        req.flash("success_msg", "Su cuenta ah sido confirmada correctamente.");
        res.redirect('/signin');
    }
             

}

usercontroler.signinForm = (req, res) => {
    res.render('auth/signin');
}

//signin
usercontroler.processsiginform = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true
});

//logout
usercontroler.logout = async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, {status: false});
    req.logout();
    req.flash("success_msg", "Has cerrado session");
    res.redirect('/signin');
}

// restablecer contraseña
usercontroler.renderformrestpassword = (req, res) => {
    res.render('security/bored');
}

usercontroler.restoreFormProcess = async(req, res) => {
    const { email } = req.body;

    if(!email.trim()){
        req.flash("error_msg", "Por favor ingrese un correo valido");
        res.redirect('/restore-password');
    }

    const emailnew = await User.findOne({email: email});

    if(!emailnew){
        req.flash("error_msg", "No existe el email ingresado");
        res.redirect('/restore-password');
    }else{

        const acxt = await User.findById(emailnew._id);

        if(acxt.active == false){
            req.flash("error_msg", "Antes de reestablecer contraseña verifique su cuenta.");
            res.redirect('/restore-password');
        }else{
            const restorecode = randomString.generate({
                length: 6,
                charset: 'alphanumeric'
            });
    
            const restorecodeUPPER = restorecode.toLocaleUpperCase();
    
            const restoreupdate = await User.findByIdAndUpdate(emailnew._id, {restore: restorecodeUPPER});
    
            // async..await is not allowed in global scope, must use a wrapper
            async function main() {
                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                let testAccount = await nodemailer.createTestAccount();
    
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'desafiohipicoapp@gmail.com', // generated ethereal user
                        pass: 'hipismo2020$#' // generated ethereal password
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
    
                // send mail with defined transport object
                    let info = await transporter.sendMail({
                        from: '"Desafío Hípico" <desafiohipicoapp@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: "Restablecer Contraseña", // Subject line
                        text: "Hello world?", // plain text body
                        html: `<h2>Hola ${emailnew.name}, Usa el siuiente codigo para restablecer tu Contraseña</h2>
                        <h3>Tú codigo es: ${restorecodeUPPER}</h3>
                        <h2>Ressblece tu contraseña aquí:</h2> <a href="https://localhost:3000/code-restore/confirm/${acxt._id}">https://localhost:3000/code-restore/confirm/${acxt._id}</a>

                        <h2>Restablece tu Contraseña</h2>
                        ` // html body
                    });
    
                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    }
    
                    main().catch(console.error);
                    req.flash("success_msg", "Por favor revisa tu email");
                    res.redirect('/signin'); 
        }

    }
}

usercontroler.renderrestorecode = async(req, res) => {
    const id = req.params.id;
    const restorepass = await User.findOne({_id: id});
    res.render('security/verify', {restorepass});
}

usercontroler.formRestoreProccess = async(req, res) => {
    const {coderest} = req.body;
    const id = req.params.id;

    const userpasrest = await User.findOne({_id: id});

    if(!coderest.trim()){
        req.flash("error_msg", "Por favor ingrese un codigo válido");
        res.redirect(`/code-restore/confirm/${userpasrest._id}`);
    }
    

    if(userpasrest.restore == coderest){
        req.flash("success_msg", "Restablezca la contraseña");
        res.render('security/restore', {userpasrest}); 
    }else{
        req.flash("error_msg", "Por favor ingrese un codigo válido");
        res.redirect(`/code-restore/confirm/${userpasrest._id}`);
    }
}

usercontroler.restoreRenderForm = (req, res) => {
    res.render('security/restore');
}

usercontroler.procesdatarestore = async(req, res) =>{
    const { newpass, conf_newpass} = req.body;
    const id = req.params.id;
    console.log(id);
    const foundid = await User.findOne({_id: id});

    if(newpass != conf_newpass){
        req.flash("error_msg", "Las contraseñas no coinciden.");
        res.redirect('/restore/password/rest');
    }

    if(!newpass.trim() || !conf_newpass.trim()){
        req.flash("error_msg", "Por favor introduzca una contraseña valida");
        res.redirect('/restore/password/rest');
    }

    if(newpass < 6 || conf_newpass < 6){
        req.flash("error_msg", "Por favor introduzca una contraseña con mas de 6 caracteres");
        res.redirect('/restore/password/rest');
    }
    

    if(foundid){
        //userNew.password = await userNew.encryptPassword(password);
        //const password = await foundid.password;
        //const d = await updatepass.encryptPassword(password);

        foundid.password = await foundid.encryptPassword(newpass);
        const f = await User.findByIdAndUpdate(foundid._id, {password: foundid.password});
        req.flash("success_msg", "Su contraseña se ha restablecido");
        res.redirect('/signin'); 
    }
}


usercontroler.renderprofileform = async(req, res) => {
    const id = req.params.id;
    const useras = await User.findOne({_id: id});
    res.render('auth/profile', {useras});
}
 
usercontroler.proccesdataprolife = async(req, res) => {
    const id = req.params.id;
    const {password, fecha, sexo, dni, direccion, extension, phone} = req.body;
    const useras = await User.findOne({_id: id});


        if(password < 6){
            req.flash("error_msg", "Por favor introduzca una contraseña con mas de 6 caracteres");
            res.redirect(`/profile/4cdet34fdm8h1ec4badegh3hsf/${id}/4AdetQ4fdm8g1Vge4Bbadekg3hsf`);
        }else{
            if(!fecha){
                req.flash("error_msg", "Por favor introduzca una fecha valida");
                res.redirect(`/profile/4cdet34fdm8h1ec4badegh3hsf/${id}/4AdetQ4fdm8g1Vge4Bbadekg3hsf`);
            }else{
                if(!sexo){
                    req.flash("error_msg", "Por favor introduzca su sexo");
                    res.redirect(`/profile/4cdet34fdm8h1ec4badegh3hsf/${id}/4AdetQ4fdm8g1Vge4Bbadekg3hsf`);
                }else{
                    if(!dni || !dni.trim()){
                        req.flash("error_msg", "Por favor introduzca un dni correcto");
                        res.redirect(`/profile/4cdet34fdm8h1ec4badegh3hsf/${id}/4AdetQ4fdm8g1Vge4Bbadekg3hsf`);
                    }else{
                        if(!direccion.trim()){
                            req.flash("error_msg", "Por favor introduzca una direccion correcta");
                            res.redirect(`/profile/4cdet34fdm8h1ec4badegh3hsf/${id}/4AdetQ4fdm8g1Vge4Bbadekg3hsf`);;
                        }else{
                            if(!phone.trim()){
                                req.flash("error_msg", "Por favor introduzca un numero de telefono correcto");
                                res.redirect(`/profile/4cdet34fdm8h1ec4badegh3hsf/${id}/4AdetQ4fdm8g1Vge4Bbadekg3hsf`);
                            }else{
                                const userverify = await Fullprofile.findOne({username: useras.username});

                                if(userverify){
                                    useras.password = await useras.encryptPassword(password);
                                    const d = await User.findByIdAndUpdate(useras._id, {password: useras.password}); 
                                    
                                    const dextension = await User.findByIdAndUpdate(useras._id, {extension: extension});

                                    const dphone = await User.findByIdAndUpdate(useras._id, {phone: extension + phone});

                                    const calculate = new Date(fecha) - 2020

                                    const userup = await Fullprofile.findOneAndUpdate(userverify.username, {birthday: fecha, sexo, cedula: dni, direccion, edad: calculate});
                                    req.flash("success_msg", "Se ah actualizado su perfil");
                                    res.redirect(`/profile/4cdet34fdm8h1ec4badegh3hsf/${id}/4AdetQ4fdm8g1Vge4Bbadekg3hsf`);
                                }else{
                                     // update password
                                useras.password = await useras.encryptPassword(password);
                                const d = await User.findByIdAndUpdate(useras._id, {password: useras.password});

                                const dextension = await User.findByIdAndUpdate(useras._id, {extension: extension});

                                const dphone = await User.findByIdAndUpdate(useras._id, {phone: extension + phone});

                                const calculate = new Date(fecha) - 2020

                                const newprofile = new Fullprofile({username: useras.username, birthday: fecha, sexo, cedula: dni, direccion, edad: calculate});
                                await newprofile.save();

                                req.flash("success_msg", "Se ah actualizado su perfil");
                                res.redirect(`/profile/4cdet34fdm8h1ec4badegh3hsf/${id}/4AdetQ4fdm8g1Vge4Bbadekg3hsf`);
                                }  
                                 
                            }
                        }
                    }
                }
            }
        }
    
}  
    


usercontroler.renderusers = async(req, res) => {
    const returnusers = await User.find();

    res.render('auth/user', {returnusers});
}


usercontroler.getothers = async(req, res) => {
    const username = req.params.username;
    const view = await User.findOne({username: username});

    res.render('auth/profile', {view});
   
}

// los coloco para ir revisando si esta todo ok, si por ahí tenemos varias, jajaaaja dale
module.exports = usercontroler;