function waiter(db){
    //function to get waiter names and the days they are available and insert into the schedule table 
    async function waiters(waiterName, dayOfTheWeek){
        //INSERT the inpuit waiterName to the waiters table
        try{  for(var i = 0; i<waiterName.length; i++){
            let waiterNames = waiterName[i]
            await db.none('INSERT INTO scheduling.waiters (waiter_name) VALUES ($1)', [waiterNames]);
            
    //Get the id of the waiter name 
         let waiterId =   await db.manyOrNone('SELECT id FROM scheduling.waiters WHERE waiter_name = $1', [waiterName]);
       
    
    
      for(var i = 0; i<dayOfTheWeek.length; i++){
        let anyDay = dayOfTheWeek[i]
        //set not  available to false
        await db.none('UPDATE scheduling.day_of_the_week SET available = $1 WHERE day =$2', [false, anyDay]);
        //get id for days selected as available
        let dayId = await db.manyOrNone('SELECT id FROM scheduling.day_of_the_week WHERE day = $1 AND available = $2', [anyDay,true])
   
    
     //INSERT Waiter name and day availability 
        await db.none('INSERT INTO scheduling.schedule (waiter_id,day_id) VALUES ($1,$2)',[waiterId.id, dayId.id])
        }
    }
        }
        catch(error){
            console.error(error.message)
        }

    }

 

    //get each waiter's  schedule 
    async function getWaiterSchedule(waiterName){
        try{
            let waiterSchedule = await db.many('SELECT scheduling.waiters.waiter_name, scheduling.day_of_the_week.day FROM scheduling.waiters JOIN scheduling.schedule ON scheduling.waiters.id = scheduling.schedule.waiter_id JOIN scheduling.day_of_the_week ON scheduling.schedule.day_id = scheduling.day_of_the_week.id WHERE scheduling.waiters.waiter_name = $1', [waiterName])
            return waiterSchedule
        }
        catch(error){
            console.error(error.message)
        }
    }

    //get all waiters schedule 
    async function getAllSchedules(){
        try{
            let allWaiterSchedules = await db.manyOrNone('');
            return allWaiterSchedules;
        }
        catch(error){
            console.error(error.message)
        }
    }

    //count the number of waiters per day 
    async function countAvailableWaiters(){

    }
    
    return{
        waiters,
        getAllSchedules,
        getWaiterSchedule,
        countAvailableWaiters,
    }
}

export default waiter