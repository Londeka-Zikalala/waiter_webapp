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
                const allSchedules = await waiterRoute.getScheduleByDay();

                //Condition for  colors
                
                for (const day in allSchedules) {
                    const { count } = allSchedules[day];
                    // add a staffingStatus property to each day object
                    if(count < 3){
                      allSchedules[day].status = "red";
                    }
                    else if(count >= 3 && count <= 5){
                      allSchedules[day].status = "green";
                    }
                    else if(count > 5 ){
                      allSchedules[day].status = "orange";
                    }
                  }
                  console.log(allSchedules); 
                  // pass allSchedules to the template
                  res.render('admin',{
                    allSchedules
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
