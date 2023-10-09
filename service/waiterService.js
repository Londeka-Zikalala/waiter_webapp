function waiter(db) {
 

    async function waiters(waiterName, dayOfTheWeek) {
        try {
            // Get all days from the database
            const allDays = await db.manyOrNone('SELECT id, day FROM scheduling.day_of_the_week');
            //get waiter name
            await db.none('INSERT INTO scheduling.waiters (waiter_name) VALUES ($1)', [waiterName]);
            // Get waiter id
            const waiterId = await db.oneOrNone('SELECT id FROM scheduling.waiters WHERE waiter_name = $1', [waiterName]);
            
            const daysToInsert = [];
    
            for (const day of allDays) {
                if (dayOfTheWeek.includes(day.day)) {
                    daysToInsert.push(day.id);
                }
            }
    
            // Delete all days for this waiter from the schedule
            await db.none('DELETE FROM scheduling.schedule WHERE waiter_id = $1', [waiterId.id]);
    
            // Insert availability for checked days
            for (const dayId of daysToInsert) {
                await db.none('INSERT INTO scheduling.schedule (waiter_id,day_id, available) VALUES ($1,$2, $3)', [waiterId.id, dayId, true]);
            }
        } catch (error) {
            console.error(error.message);
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
                scheduleByDay[day] = [];
            }
    
            scheduleByDay[day].push(waiter_name);
        }
    
        return scheduleByDay;
    }

    async function countAvailableWaiters(dayOfTheWeek) {
        //count the name rows with a spoecific waiter_id
        try {
            let waiterCount = await db.manyOrNone('SELECT COUNT(waiter_id) FROM scheduling.schedule WHERE day_id = $1', [dayOfTheWeek])
            return waiterCount
        } catch (error) {
            console.error(error.message)
        }
    }

    // async function cancelAll(waiterName) {
    //     try {
    //         //get waiter id
    //         let waiterId = await db.oneOrNone('SELECT id FROM scheduling.waiters WHERE waiter_name = $1', [waiterName]);
    //         //delete all the available days from the schedule table
    //         await db.none('DELETE FROM scheduling.schedule WHERE waiter_id = $1', [waiterId.id]);
    //     }
    //     catch (error) {
    //         console.error(error.message)
    //     }
    // }

    return {
        waiters,
        getAllSchedules,
        getScheduleByDay,
        getWaiterSchedule,
        countAvailableWaiters,
        // cancelAll
    }
}
export default waiter
