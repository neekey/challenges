import { assert } from 'chai';
import Property from '../../src/ui.property';
import Sinon from 'sinon';

describe('Property', () => {

    const data = {
        id: 1,
        price: '$100',
        agency: {
            brandingColors: {
                primary: 'blue'
            }
        },
        mainImage: 'http://dummyimage.com/600x400/000/fff'
    };
    let el = null;

    beforeEach(() => {
        el = document.createElement('div');
    });

    it('initialize', () => {
        const property = new Property(data, { el: el });
        assert.equal( property.el, el );
        assert.deepEqual( property.getData(), data );
        assert.isNull(property.addEl, 'no onAdd provided, so addEl will be null');
        assert.isNull(property.removeEl, 'default saved is false, removeEl will be null');
    });

    it('updateData()', () => {
        const newData = {
            ...data,
            id: 2
        };

        const property = new Property(data, { el: el });
        property.updateData(newData);
        assert.deepEqual( property.getData(), newData );
    });

    it('onAdd()', () => {
        const onAdd = Sinon.spy();
        const property = new Property({
            ...data,
            saved: false
        }, { el: el, onAdd });

        assert.isNotNull(property.addEl, 'since "saved" is false, there should be a add btn');
        assert.isNull(property.removeEl, 'since "saved" is false, there shouldn\'t be a remove btn');
        property.addEl.click();
        assert.isTrue(onAdd.withArgs(data.id).called);
    });

    it('onRemove()', () => {
        const onRemove = Sinon.spy();
        const property = new Property({
            ...data,
            saved: true
        }, { el: el, onRemove });

        assert.isNotNull(property.removeEl);
        assert.isNull(property.addEl);
        property.removeEl.click();
        assert.isTrue(onRemove.withArgs(data.id).called);
    });

});