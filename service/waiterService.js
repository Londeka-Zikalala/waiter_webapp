function waiter(db) {
 
// Function to update waiter's schedule
async function updateSchedule(waiterName, dayOfTheWeek) {
    // console.log(waiterName, dayOfTheWeek)
    try {
        
                // Insert waiter name only if it doesn't already exist
        await db.none('INSERT INTO scheduling.waiters (waiter_name) VALUES ($1) ON CONFLICT (waiter_name) DO NOTHING', [waiterName]);

        // Get waiter id
       
            const waiterId = await db.oneOrNone('SELECT id FROM scheduling.waiters WHERE waiter_name = $1', [waiterName]);
        
        //get the schedule
        var available = await db.manyOrNone('SELECT day_id FROM scheduling.schedule WHERE waiter_id = $1', [waiterId.id])

        //delete existing schedule
        if(available){
            await db.none('DELETE FROM scheduling.schedule WHERE waiter_id = $1', [waiterId.id])

        }
//Insert a new schedule
        for(var i = 0; i<dayOfTheWeek.length; i++){
            if(dayOfTheWeek.length < 2){
                throw new Error('Please select atleast 2 days to work for the week')
            }

            let anyDay = dayOfTheWeek[i]

            //get id for days selected as available
            let dayId = await db.one('SELECT id FROM scheduling.day_of_the_week WHERE day = $1', [anyDay])

                  //INSERT Waiter name and day availability 
            await db.none('INSERT INTO scheduling.schedule (waiter_id,day_id) VALUES ($1,$2)',[waiterId.id, dayId.id])
            
       
        }
    }
        catch (error) {
            console.error(error.message)
        }

    }

    

    async function getWaiterSchedule(waiterName) {
        try {
            //join the three tables to get all inserted values
            let waiterSchedule = await db.manyOrNone('SELECT scheduling.waiters.waiter_name, scheduling.day_of_the_week.day FROM scheduling.waiters JOIN scheduling.schedule ON scheduling.waiters.id = scheduling.schedule.waiter_id JOIN scheduling.day_of_the_week ON scheduling.schedule.day_id = scheduling.day_of_the_week.id WHERE scheduling.waiters.waiter_name = $1', [waiterName])
            return waiterSchedule
            
        }

        catch (error) {
            console.error(error.message)
        }
    }


    async function getAllSchedules() {
        //join all the tables to return all the schedules
        try {
            let allWaiterSchedules = await db.manyOrNone('SELECT scheduling.waiters.waiter_name, scheduling.day_of_the_week.day FROM scheduling.waiters JOIN scheduling.schedule ON scheduling.waiters.id = scheduling.schedule.waiter_id JOIN scheduling.day_of_the_week ON scheduling.schedule.day_id = scheduling.day_of_the_week.id');
            return allWaiterSchedules;
        }
        catch (error) {
            console.error(error.message)
        }
    }

    async function getScheduleByDay() {
        //fetch the schedules from the database
        const allSchedules = await getAllSchedules();
        const scheduleByDay = {};
       
        for (const schedule of allSchedules) {
            //assign the day and waiter_name as the object keys for the schedule.
            const { day, waiter_name } = schedule;
    
            if (!scheduleByDay[day]) {
                scheduleByDay[day] = {waiters: [], count: 0};
            }
    
            const waiterExists = scheduleByDay[day].waiters.includes(waiter_name);
    
            if(!waiterExists){
                scheduleByDay[day].waiters.push(waiter_name);
                scheduleByDay[day].count++;
            }
        }
    
        for (const day in scheduleByDay) {
            console.log(`Day: ${day}, Number of Waiters: ${scheduleByDay[day].count}`);
        }
    
        return scheduleByDay;
    }
    
    
  
    async function reset() {
        try {
            // Delete all schedules
            await db.none('DELETE FROM scheduling.schedule');
    
            // Delete all waiters
            await db.none('DELETE FROM scheduling.waiters');
        } catch (error) {
            console.error(error.message);
        }
    }
  

    return {
        updateSchedule,
        getAllSchedules,
        getScheduleByDay,
        getWaiterSchedule,
        reset
    }
}
export default waiter
