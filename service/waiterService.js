function waiter(db){
    //Gets available waiters
    async function waiters(waiterName){
        //Add a waiter to the database
        try{
             await db.none('INSERT INTO scheduling.waiters (waiter_name) VALUES ($1)', [waiterName])
        
    }catch(error){
        console.error('Error getting waiters')
    }
    }

    //get the waiters  by each day 
    async function setAvailableDay(dayOfTheWeek){
        try{
            await db.none('UPDATE scheduling.day_of_the_week SET available = $1 WHERE day=$2', [true, dayOfTheWeek])
        }catch(error){
            console.error('Error updating schedule')
        }
    }

    async function getAvailableDays(){
        try{
            //get the days where the available is true
            let availableDay = await db.manyOrOne('SELECT day = $1 FROM scheduling.day_of_the_week WHERE available = $2', [true]);
            return availableDay;
        }catch(error){
            console.error('Error getting waiters')
        }
    
    }
    //getting available waiters on a day
    async function getWaiterSchedule(waiterName){
        try{
            //gets the names of waiters along with the days of the week, shows which days they are off and which days theur on duty
            let waiterSchedule = await db.manyOrOne(' SELECT scheduling.waiters.id, scheduling.waiters.waiter_name, scheduling.day_of_the_week.day, scheduling.day_of_the_week.available FROM scheduling.waiters JOIN scheduling.day_of_the_week ON scheduling.waiters.id = scheduling.day_of_the_week.waiter_id WHERE scheduling.waiters.waiter_name = $1', [waiterName])
            return waiterSchedule
        }
        catch(error){
            console.error('Error getting waiters')
        }
    }
   

    return{
        waiters,
        setAvailableDay,
        getAvailableDays,
        getWaiterNames,
        getWaiterSchedule
        
    }
}

export default waiter