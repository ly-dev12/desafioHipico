require('dotenv').config();
const app = require('./server');
require('./database');

app.listen(app.get('port'), () => {
    console.log('Listening in port:', app.get('port'))
});