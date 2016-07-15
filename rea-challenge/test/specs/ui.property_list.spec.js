import { assert } from 'chai';
import PropertyList from '../../src/ui.property_list';
import Sinon from 'sinon';

describe('Property List', () => {

    const results = [{id:1},{id:2}];
    const saved = [{id:3, saved: true},{id:4, saved: true}];
    let el = null;

    beforeEach(() => {
        el = document.createElement('div');
    });

    describe('common', () => {

        it('initialize', () => {
            const propertyList = new PropertyList(results,{ el: el});
            assert.equal(propertyList.el, el);
            assert.lengthOf(Object.keys(propertyList.properties), results.length, 'should have enough properties');
            assert.lengthOf(propertyList.el.children, results.length, 'should have enough html children');
        });

        it('updateList()', () => {
            const propertyList = new PropertyList(results,{ el: el});
            const newList = results.concat(saved);
            propertyList.updateList(newList);
            assert.lengthOf(Object.keys(propertyList.properties), newList.length, 'should have enough properties');
            assert.lengthOf(propertyList.el.children, newList.length, 'should have enough html children');
        });
    });

    describe('results-list', () => {

        it('onAdd', () => {
            const onAdd = Sinon.spy();
            const propertyList = new PropertyList(results,{ el: el, onAdd});
            const firstProperty = propertyList.properties[results[0].id];
            firstProperty.addEl.click();
            assert.isTrue(onAdd.withArgs(results[0].id).called);
        });
    });

    describe('saved-list', () => {
        it('onRemove', () => {
            const onRemove = Sinon.spy();
            const propertyList = new PropertyList(saved,{ el: el, onRemove});
            const firstProperty = propertyList.properties[saved[0].id];
            firstProperty.removeEl.click();
            assert.isTrue(onRemove.withArgs(saved[0].id).called);
        });
    });
});