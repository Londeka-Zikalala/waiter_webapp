import express from 'express';
import db from '../db.js';
import waiter from '../service/waiterService.js';

const router = express.Router();
const waiterRoute = waiter(db);

router.get('/',  (req,res)=>{
    res.render('index')
})

router.get('/day', async(req,res)=>{
    try{
        //list all the schedules for the week to see available waiters
        const allSchedules = await waiterRoute.getScheduleByDay()
        console.log(allSchedules); 
        //list days and the number of available waiters 
        res.render('admin',{
            allSchedules
        })
    }
    catch(error){
        console.error('Failure to get schedules')
    }

})

router.post('/waiters/:username/update', async (req,res)=>{
    try{
        const waiterName = req.params.username;
        const dayOfTheWeek = req.body.days

        //get the waiter name, and days and insert to the tables
        // await waiterRoute.setWaiterName(waiterName)
        await waiterRoute.waiters(waiterName, dayOfTheWeek) //call the function for updating the name and days
        console.log(waiterName, dayOfTheWeek)
        res.redirect(`/waiters/${waiterName}/update`);
    }
    catch(error){
        console.error('Failure to post schedules')
    }
})

router.get('/waiters/:username/update', async (req, res) => {
    try {
        const waiterName = req.params.username;
        const dayOfTheWeek = req.body.days

        // get each waiter schedule 
        await waiterRoute.waiters(waiterName, dayOfTheWeek)
        const waiterSchedule = await waiterRoute.getWaiterSchedule(waiterName)
        res.render('waiters', { // render the update view
            waiterSchedule,
            username: waiterName
        });
    } catch (error) {
        console.error('Failure to get schedules');
    }
});


router.get('/waiters/:username', async (req, res) => {
    try {
        const waiterName = req.params.username;
        // get each waiter schedule 
        const waiterSchedule = await waiterRoute.getWaiterSchedule(waiterName)
        res.render('waiters', { // render the update view
            waiterSchedule,
            username: waiterName
        });
    } catch (error) {
        console.error('Failure to get schedules');
    }
});


export default router;
