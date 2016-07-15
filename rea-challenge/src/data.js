// array of result property id
let RESULTS = [];
// array of saved property id
let SAVED = [];
// hash map for all the properties used
let PROPERTIES = {};

export default {

    _validatePropertyId(id) {
        if (id in PROPERTIES){
            return true;
        }
        else {
            throw new Error(`Failed to add a non-existent property by id ${id}`);
        }
    },

    // build property list from id list
    // will add additional field "saved" to each property
    _propagateProperties(ids = []) {
        return ids.reduce((list, id) => {
            const property = PROPERTIES[id];
            if( property ){
                // get a copy and add additional field
                // a better implement of this may use a immutable lib like immutable.js
                list.push({
                    ...property,
                    saved: SAVED.indexOf(id) > -1
                });
            }
            return list;
        }, []);
    },

    setUp: function({results, saved}){
        RESULTS = results.map(p => p.id);
        SAVED = saved.map(p => p.id);
        PROPERTIES = results.concat(saved).reduce((hash, p) => {
            hash[p.id] = p;
            return hash;
        },{});
    },

    getResults() {
        return this._propagateProperties(RESULTS);
    },

    getSaved() {
        return this._propagateProperties(SAVED);
    },

    addSaved(id) {
        this._validatePropertyId(id);

        if (SAVED.indexOf(id) === -1){
            SAVED.push(id);
        }
        else {
            throw new Error(`Property with a id=${id} is already saved.`);
        }
    },

    removeSaved(id) {
        this._validatePropertyId(id);
        let index = SAVED.indexOf(id);

        if (index > -1){
            SAVED.splice(index, 1);
        }
        else {
            throw new Error(`Property with a id=${id} is already saved.`);
        }
    }
};