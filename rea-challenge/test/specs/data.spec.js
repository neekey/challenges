import { assert } from 'chai';
import Data from '../../src/data';

// "Data" does not know much about the structure of each property, only a id is required.
const RESULTS = [{id:1}, {id:2}, {id:3}];
const SAVED = [{id:4},{id:5}];

describe('Data', () => {

    beforeEach(() => {
        Data.setUp({
            results: RESULTS,
            saved: SAVED
        });
    });

    it('getResults()', () => {
        const results = Data.getResults();
        assert.equal(results.length, RESULTS.length);
        results.forEach((result, index) => {
            assert.equal(result.id, RESULTS[index].id);
            assert.equal(result.saved, false);
        });
    });

    it('getSaved()', () => {
        const results = Data.getSaved();
        assert.equal(results.length, SAVED.length);
        results.forEach((result, index) => {
            assert.equal(result.id, SAVED[index].id);
            assert.equal(result.saved, true);
        });
    });

    it('addSaved()', () => {
        const savedId = 1;
        Data.addSaved(savedId);

        const results = Data.getResults();
        assert.equal(results.length, RESULTS.length);
        results.forEach((result, index) => {
            assert.equal(result.id, RESULTS[index].id, 'result item should have equal id');
            assert.equal(result.saved, result.id === savedId, 'the new saved item should have a true "saved"');
        });

        const saved = Data.getSaved();
        assert.equal(saved.length, SAVED.length + 1);
        saved.forEach((save, index) => {
            if( SAVED[index] ){
                assert.equal(save.id, SAVED[index].id, 'saved item should have equal id');
            }
            else {
                assert.equal(save.id, savedId);
            }
            assert.equal(save.saved, true, 'result item should all have a true "saved"');
        });
    });

    it('removeSaved()', () => {
        const savedId = 4;
        Data.removeSaved(savedId);

        const results = Data.getResults();
        assert.equal(results.length, RESULTS.length);
        results.forEach((result, index) => {
            assert.equal(result.id, RESULTS[index].id);
            assert.equal(result.saved, false);
        });

        const saved = Data.getSaved();
        assert.equal(saved.length, SAVED.length - 1);
    });
});