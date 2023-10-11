export default function waiterRoutes(waiterRoute){

        async function showIndex(req,res,next){
            try{
                res.render('index',{
                    messages:req.flash()
                })
         
        }catch (error) {
            next(error)
        }
    }
        async function showAllSchedules(req,res,next){
            try{
                //list all the schedules for the week to see available waiters
                const allSchedules = await waiterRoute.getScheduleByDay()
             console.log(allSchedules); 
                //list days and the number of available waiters 
                res.render('admin',{
                    allSchedules,
                })
            }
            catch (error) {
                req.flash('error', 'error showing schedukes')
                next(error)
            }

        }

        async function updateWaiterSchedule(req,res,next){
            try{
                const waiterName = req.params.username;
                const dayOfTheWeek = req.body.days
        // //check available days
        // var daysToInsert = [];
    
        // // Check which checkboxes are selected
        // for (var i = 0; i < dayOfTheWeek.length; i++) {
        //     if (dayOfTheWeek[i].checked) {
        //         // If checkbox is checked, push its id into daysToInsert
        //         daysToInsert.push(dayOfTheWeek[i].id);
        //     }
        // }
                //get the waiter name, and days and insert to the tables
                await waiterRoute.updateSchedule(waiterName, dayOfTheWeek) //call the function for updating the name and days
                // console.log(waiterName, dayOfTheWeek)
                res.redirect(`/waiters/${waiterName}/update`);
            }
            catch (error) {
                next(error)
            }
                   
        }

        async function getWaiterUpdatedSchedule(req,res,next){
            try {
                const waiterName = req.params.username;

                const waiterSchedule = await waiterRoute.getWaiterSchedule(waiterName)
                // console.log(waiterSchedule)
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
        async function resetSchedule(req,res,next){
            try {
                
                // get each waiter schedule 
                await waiterRoute.reset()
               res.redirect('/day')
                
            } catch (error) {
                next(error)
            }
        }
        return{
            showIndex,
            showAllSchedules,
            updateWaiterSchedule,
            getWaiterUpdatedSchedule,
            showWaiterSchedule,
            resetSchedule
        }
    }
