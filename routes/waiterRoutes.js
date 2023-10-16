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
                    else if(count = 3 ){
                      allSchedules[day].status = "green";
                    }
                    else if(count > 3){
                      allSchedules[day].status = "yellow";
                    }
                  
                  }
                 
                  // pass allSchedules to the template
                  res.render('admin',{
                    allSchedules
                  })
   
              
            }
            catch (error) {
                req.flash('error', 'error showing schedules')
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
              
                if(waiterSchedule.length>=2){
                    
                    req.flash('success', `${waiterName}, Your Schedule Has Been Updated!`)
                }
                else {
                    req.flash('error', 'Please Select Atleast 2 Working Days.')
                }
                
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
                await waiterRoute.reset();
                req.flash('Success', 'Reset Successful!')
                res.redirect('/day')
              } catch (error) {
                console.error('Error resetting data', error);
                req.flash('error', 'Error clearing data')
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
