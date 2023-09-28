import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import db from './db.js';
import waiter from './service/waiterService.js';

const app = express();
const waiters = waiter(db)
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
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
//public static
app.use(express.static('public'));

//local host 
const PORT = process.env.PORT || 3000;
app.get('/', (req,res)=>{
    res.render('index')
});


app.get('/waiters', async (req, res)=>{
   //const waiterNames = await waiters.getWaiterNames();
    res.render('waiters');
})

app.post('/waiters', async (req, res)=>{
    const waiterAvailable = req.body.name;
    const day = req.body.dayOfTheWeek;
    console.log(waiterAvailable)
    console.log(day)
   // const waiterNames = await waiters.getWaiterNames();
    res.render('waiters');
})

/*app.post('/waiters/:name', async(req,res)=>{
    const waiterName = re;
    const days = req.body.days;
    await waiters.waiterAvailabileForShift(waiterName, days);
    res.redirect('/waiters');
})*/

/*app.get('/waiters/:name', async(req,res)=>{
    const waiterAvailable = req.body.name;

    const day = req.body.dayOfTheWeek;

    const available = await waiters.waiterAvailabileForShift(waiterAvailable, day)

    res.render('waiters', {
        available
    })


})*/


app.get('/on_duty', async (req,res)=>{
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const day = days[today.getDay()];
    
    const waitersByDay = await waiters.getWaitersByDay(day)
    console.log(waitersByDay)
    console.log(day)
    res.render('index', { 
        day, 
        waitersByDay,
       
    });
       
})
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});