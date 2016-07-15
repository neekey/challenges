import Property from './ui.property';
import deepEqual from 'deep-equal';
import './ui.property_list.scss';

export default class PropertyList {
    constructor(
        // data
        list = [],
        // config
        {
            el,
            onAdd,
            onRemove
        }
    ) {
        this.data = list;
        this.config = arguments[1];
        this.el = this.config.el;
        this.render();
    }

    el = null;

    // all the property instances
    properties = {};

    _clean() {
        Object.keys(this.properties).forEach(id => {
            this.properties[id].remove();
        });
        this.properties = {};
        this.el.innerHTML = '';
    }

    render() {

        if( this.data.length ){

            // clear properties not in the new data list
            const remainIds = this.data.map(p => p.id);
            Object.keys(this.properties).forEach(id => {
                if(remainIds.indexOf(id) === -1){
                    this.properties[id].remove();
                    delete this.properties[id];
                }
            });

            // update existing properties
            // create new properties if not exist
            this.data.forEach(p => {

                if (p.id in this.properties){
                    this.properties[p.id].updateData(p);
                }
                else {
                    const el = document.createElement('div');
                    el.className = 'property-wrapper';
                    this.properties[ p.id ] = new Property(p, {
                        el: el,
                        onAdd: this.config.onAdd,
                        onRemove: this.config.onRemove
                    });

                    this.el.appendChild(el);
                }
            });
        }
        else {
            this._clean();
        }
    }

    updateList(list = []) {
        if (!deepEqual(list, this.data)) {
            this.data = list;
            this.render();
        }
    }
}