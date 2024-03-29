(function( host ){
    var taskInfo = null;
    var loopTimer = null;
    // track all the task duration.
    var durations = {};

    /**
     * start a new Task
     * @param data
     */
    function start( data ){

        clearTimeout( loopTimer );

        taskInfo = {
            imageData: data.imageData,
            processGroups: data.processGroups,
            rows: data.rows,
            cols: data.cols,
            tileWidth: data.tileWidth,
            tileHeight: data.tileHeight,
            currentGroupIndex: 0,
            currentTileIndex: 0,
            taskId: data.taskId
        };

        console.log( '[worker] start new task, id: %d', data.taskId );

        durations[ data.taskId ] = { start: Date.now() };

        loop();
    }

    /**
     * process loop
     */
    function loop(){

        var max = 20000;
        var count = 0;
        // track loop time, kind of need to make sure this worker is fast but also responsive.
        var loopStart = Date.now();

        loopTimer = setTimeout(function(){

            while ( count < max ){
                count++;

                var result = processTask();

                if( result.result ){
                    response( 'tileProcessed', result.result );
                }

                if( result.finished ){
                    break;
                }
            }

            console.info( '[worker] A loop finished, duration: %d ms', Date.now() - loopStart );

            if( result.finished ){
                var duration = durations[ result.taskId ];
                duration.end = Date.now();
                duration.duration = ( duration.end - duration.start );
                console.info( '[worker] Task %d Finished, duration: %d ms', result.taskId, duration.duration );
            }
            else {
                loop();
            }

        }, 0);
    }

    /**
     * Get next tile to process, if return none, than means all the tiles are processed.
     * @returns {{ tile, groundEnd, groupIndex, tileIndex }}
     */
    function getNextTile(){

        var currentGroupIndex = taskInfo.currentGroupIndex;
        var currentGroup = taskInfo.processGroups[ currentGroupIndex ];

        if( currentGroup ){
            var currentTile = currentGroup[ taskInfo.currentTileIndex ];
            if( currentTile ){

                var groupEnd = taskInfo.currentTileIndex === currentGroup.length - 1;
                var result = {
                    tile: currentTile,
                    groupEnd: groupEnd,
                    groupIndex: currentGroupIndex,
                    tileIndex: taskInfo.currentTileIndex,
                    taskId: taskInfo.taskId
                };

                // move index to the next..
                taskInfo.currentTileIndex++;

                return result;
            }
            else {
                // if no tile, move to next group
                taskInfo.currentTileIndex = 0;
                taskInfo.currentGroupIndex++;
                return getNextTile();
            }
        }
        else {
            return null;
        }
    }

    /**
     * process next tile return result.
     * @returns { result: { groupEnd, averageColor, groupIndex, tileIndex, row, col }, finished: false }
     */
    function processTask(){

        var tile = getNextTile();

        if( tile ){

            var averageColor = getTileColor( taskInfo.imageData, {
                width: taskInfo.tileWidth,
                height: taskInfo.tileHeight
            }, tile.tile );

            return  {
                result: {
                    groupEnd: tile.groupEnd,
                    averageColor: averageColor,
                    groupIndex: tile.groupIndex,
                    tileIndex: tile.tileIndex,
                    row: tile.tile.row,
                    col: tile.tile.col,
                    taskId: tile.taskId
                },
                taskId: tile.taskId,
                finished: false
            };
        }
        else {
            return {
                taskId: taskInfo.taskId,
                finished: true
            };
        }
    }

    /**
     * Get tile average color ( hex )
     * @param {Object} imageData
     * @param {Array} imageData.data
     * @param {Number} imageData.width
     * @param {Number} imageData.height
     * @param tileSize
     * @param tileCoordinate
     */
    function getTileColor( imageData, tileSize, tileCoordinate ){

        var tileWidth = tileSize.width;
        var tileHeight = tileSize.height;
        var x;
        var y;
        var colorSum = {
            r: 0,
            g: 0,
            b: 0
        };

        // Get the left-top pixel coordinate from a tile coordinate
        var startPixel = tileToPixelCoordinate( tileCoordinate.col, tileCoordinate.row, tileWidth, tileHeight );
        var imageDataIndex;
        var totalPixel = 0;
        var pixel = null;

        // Go through all the pixel within the tile
        for( y = 0; y < tileHeight; y++ ){
            for( x = 0; x < tileWidth; x++ ){
                pixel = {
                    x: startPixel.x + x,
                    y: startPixel.y + y
                };

                // Some tile does not have a complete standard tile size
                if( pixel.x + 1 > imageData.width || pixel.y + 1 > imageData.height ){
                    continue;
                }

                totalPixel++;

                // get image data array index from pixel coordinate
                imageDataIndex = pixelCoordinateToImageDataIndex( startPixel.x + x, startPixel.y + y, imageData.width );

                colorSum.r += imageData.data[ imageDataIndex ] || 0;
                colorSum.g += imageData.data[ imageDataIndex + 1 ] || 0;
                colorSum.b += imageData.data[ imageDataIndex + 2 ] || 0;
            }
        }

        return convertRGBToHex(
            Math.floor( colorSum.r / totalPixel ),
            Math.floor( colorSum.g / totalPixel ),
            Math.floor( colorSum.b / totalPixel ));
    }


    function convertIntToHexString( integer ){
        var str = Number(integer).toString(16);
        return str.length == 1 ? '0' + str : str;
    }

    function convertRGBToHex( r, g, b ){
        return convertIntToHexString( r ) + convertIntToHexString( g ) + convertIntToHexString( b );
    }

    /**
     * transform pixel coordinate to image data array index
     * @param x
     * @param y
     * @param imgWidth
     * @returns {number}
     */
    function pixelCoordinateToImageDataIndex( x, y, imgWidth ){
        return ( y * imgWidth + x ) * 4;
    }

    /**
     * transform coordinate of tile to coordinate of pixel
     * @param col
     * @param row
     * @param tileWidth
     * @param tileHeight
     */
    function tileToPixelCoordinate( col, row, tileWidth, tileHeight ){

        return {
            x: col * tileWidth,
            y: row * tileHeight
        };
    }

    function response( type, data ){
        postMessage( {
            type: type,
            data: data
        });
    }

    if( host.document === undefined ){
        onmessage = function( event ){

            var data = event.data;

            switch ( data.type ){

            /**
             * data:
             *  imageData: [],
             *  processGroups: [],
             *  rows: 0,
             *  cols: 0,
             *  tileWidth: 0,
             *  tileHeight: 0
             */
                case 'start':
                    start( data.data );
                    break;
                case 'stop':
                    break;
                case 'pause':
                    break;
            }
        };

        postMessage({
            type: 'initialized'
        });
    }
    else {
        // expose this methods
        host.TileProcessorUtils = {
            getTileColor: getTileColor,
            tileToPixelCoordinate: tileToPixelCoordinate,
            pixelCoordinateToImageDataIndex: pixelCoordinateToImageDataIndex,
            convertIntToHexString: convertIntToHexString,
            convertRGBToHex: convertRGBToHex
        };
    }

})( this );

