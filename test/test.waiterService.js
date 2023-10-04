    import assert from 'assert';
 import waiter from '../service/waiterService.js';
import db from '../db.js';
describe('waiter function', function() {
  
        it('should set a waiter name', async function() {
            await waiter(db).setWaiterName('John');
            const result = await waiter(db).getWaiterSchedule('John');
            assert.strictEqual(result[0].waiter_name, 'John');
        });
});
