import './ui.property.scss'
import deepEqual from 'deep-equal';

// Property class for a single property
export default class Property {
    constructor(
        // data
        {
            id,
            price,
            agency,
            mainImage,
            saved
        },
        // config
        {
            el,
            // onAdd and onRemove will together with "saved" to decide if display certain button
            // "add" button will show only saved=false and onAdd exists
            // "remove" button will show only save=true and onRemove exists
            onAdd,
            onRemove
        })
    {
        this.data = arguments[0];
        this.config = arguments[1];
        this.el = this.config.el;

        this._valid();
        this.render();
    }

    // verify if data is
    _valid() {
        if(typeof this.data.id === 'undefined'){
            throw new Error('id is missing');
        }

        if(!(this.config.el instanceof HTMLElement)){
            throw new Error('el must be a valid HTMLElement');
        }

        if(!this.data.agency){
            this.data.agency = { brandingColors: { primary: ''}};
        }
        else if(!this.data.agency.brandingColors){
            this.data.agency.brandingColors = { primary: ''};
        }
    }

    _clean(){
        this.el.innerHTML = '';
        this.removeEl = null;
        this.addEl = null;
    }

    el = null;

    // add button if exist, this is basically used for test.
    addEl = null;

    // remove button if exist, this is basically used for test.
    removeEl = null;

    getData() {
        return this.data;
    }

    render() {
        this._clean();

        this.el.innerHTML = `
            <div class="property">
                <div class="agency" style="background: ${this.data.agency.brandingColors.primary};">
                    <img class="logo" src="${this.data.agency.logo}" />
                </div>
                <div class="preview" style="background-image: url(${this.data.mainImage});"></div>
                <div class="price">${this.data.price}</div>
                <div class="action J_Action"></div>
            </div>
        `;

        // depends on "saved", onAdd and onRemove to decide what button to render.
        const actionEl = this.el.getElementsByClassName('J_Action')[0];

        // add a remove button
        if(this.data.saved && this.config.onRemove) {
            this.removeEl = document.createElement('div');
            this.removeEl.innerHTML = 'Remove Property';
            this.removeEl.className = 'remove';
            actionEl.appendChild(this.removeEl);
            this.removeEl.onclick = this.config.onRemove.bind(null, this.data.id);
        }

        // add a add button
        if(!this.data.saved && this.config.onAdd) {
            this.addEl = document.createElement('div');
            this.addEl.innerHTML = 'Add Property';
            this.addEl.className = 'add';
            actionEl.appendChild(this.addEl);
            this.addEl.onclick = this.config.onAdd.bind(null, this.data.id);
        }
    }

    // update data, re-render only data changes
    updateData({id, price, agency, mainImage}) {
        if (!deepEqual(arguments[0], this.data)) {
            this.data = arguments[0];
            this.render();
        }
    }

    remove(){
        this._clean();
        this.el.remove();
    }
}