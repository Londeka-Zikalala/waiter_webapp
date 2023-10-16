import express from 'express';
import exphbs from 'express-handlebars';
import {engine} from 'express-handlebars'
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import waiterRoutes from './routes/waiterRoutes.js';
import waiter from './service/waiterService.js';
import db from './db.js';

const app = express();
const hbs = exphbs.create();
const waiterdb = waiter(db);
const waiterRoute = waiterRoutes(waiterdb)
//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'edeea0c7-8aed-40c3-afab-48a3c5cdd878',
    resave: false,
    saveUninitialized: true
  }));
app.use(flash());
//handlebars engine

hbs.handlebars.registerHelper('includes', function(arr, item) {
  // Map the array of objects to an array of days
  const days = arr.map(a => a.day);
  // Check if the item is included in the array of days
  return days.includes(item);
});


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
//public static
app.use(express.static('public'));

app.get('/', waiterRoute.showIndex)
app.get('/days', waiterRoute.showAllSchedules)
app.post('/waiters/:username/update', waiterRoute.updateWaiterSchedule)
app.get('/waiters/:username/update', waiterRoute.getWaiterUpdatedSchedule)
app.get('/waiters/:username', waiterRoute.showWaiterSchedule )
app.post('/reset', waiterRoute.resetSchedule)



//local host 
const PORT = process.env.PORT || 3011

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});