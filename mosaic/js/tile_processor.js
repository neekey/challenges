/**
 * TileProcessor
 * - Computing tile average color
 * - Calculate stage info
 */
(function(){

    var TileRenderOrders = window.TileRenderOrders;
    var worker = null;

    /**
     * this is a unique id used to identify different task ( the computation for each image is a task )
     */
    var taskId = 0;

    /**
     * Called when each tile average color computation is finished.
     */
    var tileProcessedCallback = function(){};

    /**
     * Initiate web worker
     * @param callback
     */
    function initWorker( callback ){
        if( worker ){
            callback( worker );
        }
        else {
            var myWorker = new Worker("./js/tile_processor_worker.js");

            myWorker.onmessage = function( e ){
                var data = e.data;
                switch ( data.type ) {

                    case 'initialized':
                        worker = myWorker;
                        callback( worker );
                        break;

                    // fire after each tile average color is computed
                    case 'tileProcessed':
                        tileProcessedCallback( data.data );
                        break;
                    default:
                        break;
                }
            };

            // error handle for worker
            myWorker.onerror = function( e ){
                console.error( 'Worker is down:', e );
                myWorker.terminate();

                setTimeout(function(){
                    console.info( 'Try to restart the task' );
                    var taskData = myWorker.taskData;
                    worker = null;
                    myWorker = null;
                    sendMessage( 'start', taskData );
                });
            }
        }
    }

    /**
     * send message to worker
     * @param type
     * @param data
     */
    function sendMessage( type, data ){
        initWorker(function( worker ){
            // save task data, so that we can restart the task if the worker is down
            worker.taskData = data;
            worker.postMessage({
                type: type,
                data: data
            });
        });
    }

    window.TileProcessor = {

        /**
         * Get task info, which includes:
         *  - row amount for tiles
         *  - col amount for tiles
         *  - groups:
         *      - a array for tile group, a tile group is a group that is going to be rendered as a whole.
         *      - the order of all the tiles is rendered group by group
         *
         * @param {String} renderOrder
         * @param {Object} imageData
         * @param {Number} imageData.width
         * @param {Number} imageData.height
         * @param {Object} tileSize
         * @param {Number} tileSize.width
         * @param {Number} tileSize.height
         */
        getTaskInfo: function( renderOrder, imageData, tileSize ){
            var rows = Math.ceil( imageData.height / tileSize.height );
            var cols = Math.ceil( imageData.width / tileSize.width );
            var groups = this.getTileRenderOrder( renderOrder, rows, cols );
            return {
                rows: rows,
                cols: cols,
                groups: groups,
                taskId: taskId++
            };
        },

        /**
         * Get a specific groups for tile render order
         * @param processType
         * @param row
         * @param col
         * @returns {*}
         */
        getTileRenderOrder: function( processType, row, col ){
            return TileRenderOrders[ processType ]( row, col );
        },

        /**
         * start the process
         * @param info
         * @param {Object} info.imageData
         * @param {Array} info.imageData.data
         * @param {Number} info.imageData.width
         * @param {Number} info.imageData.height
         * @param info.processGroups
         * @param info.rows
         * @param info.cols
         * @param info.tileWidth
         * @param info.tileHeight
         */
        startTask: function( info ){
            sendMessage( 'start', info );
        },

        onTileProcessed: function( callback ){
            if( typeof callback == 'function' ){
                tileProcessedCallback = callback;
            }
        }
    };

})();

