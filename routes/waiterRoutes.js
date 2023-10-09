export default function waiterRoutes(waiterRoute){

        async function showIndex(req,res,next){
            try{
                res.render('index')
         
        }catch (error) {
            next(error)
        }
    }
        async function showAllSchedules(req,res,next){
            try{
                const days = req.body.days
                //list all the schedules for the week to see available waiters
                const allSchedules = await waiterRoute.getScheduleByDay()
                const numberOfWaiters = await waiterRoute.countAvailableWaiters(days)
                console.log(allSchedules); 
                //list days and the number of available waiters 
                res.render('admin',{
                    allSchedules,
                    numberOfWaiters
                })
            }
            catch (error) {
                next(error)
            }

        }

        async function updateWaiterSchedule(req,res,next){
            try{
                const waiterName = req.params.username;
                const dayOfTheWeek = req.body.days
        
                //get the waiter name, and days and insert to the tables
                // await waiterRoute.setWaiterName(waiterName)
                await waiterRoute.waiters(waiterName, dayOfTheWeek) //call the function for updating the name and days
                console.log(waiterName, dayOfTheWeek)
                res.redirect(`/waiters/${waiterName}/update`);
            }
            catch (error) {
                next(error)
            }
                   
        }
        async function getWaiterUpdatedSchedule(req,res,next){
            try {
                const waiterName = req.params.username;
                const dayOfTheWeek = req.body.days
        
                // get each waiter schedule 
                await waiterRoute.waiters(waiterName, dayOfTheWeek)
                const waiterSchedule = await waiterRoute.getWaiterSchedule(waiterName)
                console.log(waiterSchedule)
                res.render('waiters', { // render the update view
                    waiterSchedule,
                    username: waiterName
                });
            } catch (error) {
                next(error)
            }
         
        }
        async function showWaiterSchedule(req,res,next){
            try {
                const waiterName = req.params.username;
                // get each waiter schedule 
                const waiterSchedule = await waiterRoute.getWaiterSchedule(waiterName)
                res.render('waiters', { // render the update view
                    waiterSchedule,
                    username: waiterName
                });
            } catch (error) {
                next(error)
            }

        }
        return{
            showIndex,
            showAllSchedules,
            updateWaiterSchedule,
            getWaiterUpdatedSchedule,
            showWaiterSchedule
        }
    }
