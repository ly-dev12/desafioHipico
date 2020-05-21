const express = require('express');
const router = express.Router();

// create secuirty code
const randomString = require('randomstring');

const secury = randomString.generate({
    length: 24,
    charset: 'alphanumeric'
})

const protect = randomString.generate({
    length: 24,
    charset: 'alphanumeric'
})

//controller req
const { 
    rendersignunform,
     processDataRegister, 
     signinForm, 
     renderConfirmForm, 
     confirmaccountprocess, 
     processsiginform, 
     logout, 
     renderformrestpassword, 
     restoreFormProcess, 
     renderrestorecode, 
     formRestoreProccess, 
     restoreRenderForm, 
     procesdatarestore, 
     renderprofileform, 
     renderusers,
     proccesdataprolife,
     getothers
    } = require('../controllers/user.controllers');

// register form route
router.get('/signup', rendersignunform);

router.post('/register-new-account', processDataRegister);

//confirm acc
router.get('/account/confirm/:id', renderConfirmForm);

router.put('/confirm-account/verification/:id', confirmaccountprocess);

// signin form
router.get('/signin', signinForm);

router.post('/signin/authentication', processsiginform);

// logout
router.get('/logout/:id', logout);

// olvido la contraseña
router.get('/restore-password', renderformrestpassword);

router.post('/restore-password/restore/email', restoreFormProcess);

// codigo de restore
router.get('/code-restore/confirm/:id', renderrestorecode);

router.post('/restore-password/code/verify/:id', formRestoreProccess);

//restore
router.get('/restore/password/rest', restoreRenderForm);

router.put('/restore/password/desafiohipico/:id', procesdatarestore);

// Profile form route
router.get('/profile/4cdet34fdm8h1ec4badegh3hsf/:id/4AdetQ4fdm8g1Vge4Bbadekg3hsf', renderprofileform);

router.put('/profile/update/:id', proccesdataprolife);

// users
router.get('/users', renderusers);

// get profile
router.get('/profile/vivists/:username', getothers);


module.exports = router;


//Bien pensado woody, vamos al profile