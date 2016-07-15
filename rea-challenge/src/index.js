import MockData from './mock_results.json';
import Data from './data';
import PropertyList from './ui.property_list';
import './index.scss';

function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// initiate and render
ready(function(){

    // Get HTML containers
    const resultsContainer = document.getElementById('J_PropertyResults');
    const savedContainer = document.getElementById('J_PropertySaved');

    // Create components for both list
    const resultsPropertyList = new PropertyList([], {
        el: resultsContainer,
        onAdd: onAddSaved
    });
    const savedPropertyList = new PropertyList([], {
        el: savedContainer,
        onRemove: onRemoveSaved
    });

    // "add" handler
    function onAddSaved(id){
        Data.addSaved(id);
        render();
    }

    // "remove" handler
    function onRemoveSaved(id){
        Data.removeSaved(id);
        render();
    }

    // update list
    function render(){
        resultsPropertyList.updateList(Data.getResults());
        savedPropertyList.updateList(Data.getSaved());
    }

    Data.setUp(MockData);
    render();
});

