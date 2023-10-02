function waiter(db){
    //function to get waiter names and the days they are available and insert into the schedule table 
    // Function to insert waiter names and the days they are available into the schedule table 
   
    async function waiters(waiterName, dayOfTheWeek){
        try{
            await db.none('INSERT INTO scheduling.waiters (waiter_name) VALUES ($1)', [waiterName]);
            let waiterId = await db.oneOrNone('SELECT id FROM scheduling.waiters WHERE waiter_name = $1', [waiterName]);
    
            for(let day of dayOfTheWeek){
                let dayId = await db.oneOrNone('SELECT id FROM scheduling.day_of_the_week WHERE day = $1', [day]);
                await db.none('INSERT INTO scheduling.schedule (waiter_id,day_id, available) VALUES ($1,$2, $3)',[waiterId.id, dayId.id, true]);
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
    async function cancel(waiterName, day){
        try{
            let waiterId = await db.oneOrNone('SELECT id FROM scheduling.waiters WHERE waiter_name = $1', [waiterName]);
            let dayId = await db.oneOrNone('SELECT id FROM scheduling.day_of_the_week WHERE day = $1', [day]);
            await db.none('DELETE FROM scheduling.schedule WHERE waiter_id = $1 AND day_id = $2', [waiterId.id, dayId.id]);
        }
        catch(error){
            console.error(error.message)
        }
    }
    
    return{
        waiters,
        getAllSchedules,
        getWaiterSchedule,
        countAvailableWaiters,
        cancel
    }
}

export default waiter