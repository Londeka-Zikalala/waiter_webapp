function waiter(db) {
    async function setWaiterName(waiterName) {
        //enter a waiter in the waiter table
        try {
            await db.none('INSERT INTO scheduling.waiters (waiter_name) VALUES ($1)', [waiterName]);
        }
        catch (error) {
            console.error(error.message)
        }
    }
    async function waiters(waiterName, dayOfTheWeek) {
        try {
            //get the waiter id
         

            //get all days for the waiter
            let allDays = await db.manyOrNone('SELECT day FROM scheduling.day_of_the_week WHERE waiter_name = $1',[waiterName]);

            //find the days to be deleted
            let daysToDelete = allDays.filter(day => !dayOfTheWeek.includes(day));
            
            //delete the unchecked days from the schedule
            for (let day of daysToDelete) {
                let dayId = await db.oneOrNone('SELECT id FROM scheduling.day_of_the_week WHERE day = $1', [day]);
            let waiterId = await db.oneOrNone('SELECT id FROM scheduling.day_of_the_week WHERE day = $1', [day]);
                await db.none('DELETE FROM scheduling.schedule WHERE waiter_id = $1 AND day_id = $2', [waiterId.id, dayId.id]);
            }

            //update availability for each checked day and insert waiter id and day id into scheduling table
            for (let day of dayOfTheWeek) {
                let dayId = await db.oneOrNone('SELECT id FROM scheduling.day_of_the_week WHERE day = $1', [day]);
                if (dayId === null) {
                    console.error('No day found with the name', day);
                    continue;  // Skip this iteration of the loop
                }
                let waiterId = await db.oneOrNone('SELECT id FROM scheduling.waiter_id WHERE day = $1', [waiterName]);

        await db.none('INSERT INTO scheduling.schedule (waiter_id,day_id, available) VALUES ($1,$2, $3) ON CONFLICT (waiter_id, day_id) DO NOTHING', [waiterId.id, dayId.id, true]);
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
            return waiterSchedule || [];
        }
        catch (error) {
            console.error(error.message)
        }
    }


    async function getAllSchedules() {
        try {
            let allWaiterSchedules = await db.manyOrNone('SELECT scheduling.waiters.waiter_name, scheduling.day_of_the_week.day FROM scheduling.waiters JOIN scheduling.schedule ON scheduling.waiters.id = scheduling.schedule.waiter_id JOIN scheduling.day_of_the_week ON scheduling.schedule.day_id = scheduling.day_of_the_week.id');
            return allWaiterSchedules;
        }
        catch (error) {
            console.error(error.message)
        }
    }

    async function countAvailableWaiters(dayOfTheWeek) {
        try {
            let waiterCount = await db.manyOrNone('SELECT COUNT(waiter_id) FROM scheduling.schedule WHERE day_id = $1', [dayOfTheWeek])
            return waiterCount
        } catch (error) {
            console.error(error.message)
        }
    }

    async function cancelAll(waiterName) {
        try {
            //get waiter id
            let waiterId = await db.oneOrNone('SELECT id FROM scheduling.waiters WHERE waiter_name = $1', [waiterName]);
            //delete all the available days from the schedule table
            await db.none('DELETE FROM scheduling.schedule WHERE waiter_id = $1', [waiterId.id]);
        }
        catch (error) {
            console.error(error.message)
        }
    }

    return {
        setWaiterName,
        waiters,
        getAllSchedules,
        getWaiterSchedule,
        countAvailableWaiters,
        cancelAll
    }
}
export default waiter
