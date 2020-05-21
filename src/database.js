const mongoose = require('mongoose');


//mongoose.connect('mongodb://localhost/dh-app')
 // .then(db => console.log('db connected'))
 // .catch(err => console.log(err));


mongoose.connect(process.env.MONGODB_URI, {
       useNewUrlParser: true,
        useUnifiedTopology: true
})
.then(db => console.log("DB is connected "))
.catch(err => console.log(err));