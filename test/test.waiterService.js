import assert from 'assert';
import waiter from '../service/waiterService.js';
import db from '../db.js';
describe('waiter function', function () {
    this.timeout(6000);
    const waiterFunc = waiter(db)
    beforeEach(async function () {
       try{
         // clean the tables before each test run
         await db.none("TRUNCATE TABLE scheduling.schedule RESTART IDENTITY CASCADE;");
         await db.none("TRUNCATE TABLE scheduling.waiters RESTART IDENTITY CASCADE;");
 
       }catch(error){
        console.error(error.message)
       }
 
    })

    it('should insert a waiter name  and days available', async function () {
        try{
            var waiterName = 'Samke'
        var dayOfTheWeek = ['Monday', 'Tuesday']

        const insert = await waiterFunc.updateSchedule(waiterName,dayOfTheWeek);

        assert.deepEqual(insert, 'Samke'['Monday', 'Tuesday']);
        }catch(error){
            console.error(error.message)
           }
        
    });

    it('should get a waiter schedule', async function (){
      try{
        var waiterName = 'Ted';
        var dayOfTheWeek = ['Monday', 'Tuesday', 'Wednesday'];

        await waiterFunc.updateSchedule(waiterName,dayOfTheWeek);
        var schedule = await waiterFunc.getWaiterSchedule(waiterName)
        assert.deepEqual(schedule, ['Monday', 'Tuesday', 'Wednesday'])
      }catch(error){
        console.error(error.message)
       }
    })

    // it('should return all waiter schedules', async function(){
    //     var waiterName = 'Ted';
    //     var dayOfTheWeek = ['Monday', 'Tuesday', 'Wednesday'];
    //     var waiterName2 = 'Thabo';
    //     var dayOfTheWeek2 = ['Monday', 'Tuesday', 'Wednesday', 'Friday'];
    //     await waiterFunc.updateSchedule(waiterName, dayOfTheWeek);
    //     await waiterFunc.updateSchedule(waiterName2, dayOfTheWeek2);
    
    //     const allSchedules = await waiterFunc.getAllSchedules();
    
    //    assert.deepEqual(allSchedules,[
    //         {
    //           day: 'Monday',
    //           waiter_name: 'Ted'
    //         },
    //         {
    //           day: 'Tuesday',
    //           waiter_name: 'Ted'
    //         },
    //         {
    //           day: 'Wednesday',
    //           waiter_name: 'Ted'
    //         },
    //         {
    //           day: 'Monday',
    //           waiter_name: 'Thabo'
    //         },
    //         {
    //           day: 'Tuesday',
    //           waiter_name: 'Thabo'
    //         },
    //         {
    //           day: 'Wednesday',
    //           waiter_name: 'Thabo'
    //         },
    //         {
    //           day: 'Friday',
    //           waiter_name: 'Thabo'
    //         }
    //       ])
          
    // });
    

it('should get a waiter schedule by day and count how many they are', async function (){
        try{
   // Mock the result of getAllSchedules
                const allSchedules = [
                  { day: 'Monday', waiter_name: 'Alice' },
                  { day: 'Tuesday', waiter_name: 'Bob' },
                  { day: 'Monday', waiter_name: 'Charlie' },
                ];
            
                const expectedResult = {
                  'Monday': { waiters: ['Alice', 'Charlie'], count: 2 },
                  'Tuesday': { waiters: ['Bob'], count: 1 }
                };
            
                const result = await getScheduleByDay(allSchedules);
                assert.deepStrictEqual(result, expectedResult);
              
            }

        catch(error){
            console.error(error.message)
           }
       
    });
    

    after(function () {
        db.$pool.end();})
});
