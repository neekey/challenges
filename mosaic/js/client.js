(function(){

    function ready(fn) {
        if (document.readyState != 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function(){

        // ------- modules -------------
        // since I don't want to get loaders like webpack involved, so just do module the old way : )
        var ImageReader = window.ImageReader;
        var TileProcessor = window.TileProcessor;
        var TileRender = window.TileRender;

        // ------- elements ----------
        var renderOrderSelect = document.getElementById( 'render-order' );
        var tileWidthInput = document.getElementById( 'tile-width' );
        var tileHeightInput = document.getElementById( 'tile-height' );
        var maxWidthInput = document.getElementById( 'max-width' );
        var maxHeightInput = document.getElementById( 'max-height' );
        var uploaderInput = document.getElementById('uploader');
        var stage = document.getElementById('stage');

        var imageReader = new ImageReader( uploaderInput );
        var tileRender = new TileRender( stage );

        // ------- set default values -----------
        var defaultSize = ImageReader.getMaxSize();
        maxWidthInput.value = defaultSize.width;
        maxHeightInput.value = defaultSize.height;

        tileWidthInput.value = TILE_WIDTH;
        tileHeightInput.value = TILE_HEIGHT;

        // when images is uploaded
        imageReader.onRead(function( data ){

            var tileWidth = tileWidthInput.value;
            var tileHeight = tileHeightInput.value;

            // calculate task info
            var taskInfo = TileProcessor.getTaskInfo(
                // this value decide the render order, like "row by row" or "col by col"
                renderOrderSelect.value,
                data.imageData,
                { width: tileWidth, height: tileHeight }
            );

            // Update tile stage
            tileRender.setUpState( {
                width: data.imageData.width,
                height: data.imageData.height,
                tileWidth: tileWidth,
                tileHeight: tileHeight,
                rows: taskInfo.rows,
                cols: taskInfo.cols,
                url: data.url,
                taskId: taskInfo.taskId
            });

            // Start the tile computation.
            TileProcessor.startTask({
                imageData: data.imageData,
                tileWidth: tileWidth,
                tileHeight: tileHeight,
                rows: taskInfo.rows,
                cols: taskInfo.cols,
                // the "goups" includes the order of processing tiles, like "row by row" or "col by col"
                processGroups: taskInfo.groups,
                taskId: taskInfo.taskId
            });
        });

        // When a tile is finished.
        TileProcessor.onTileProcessed(function( tileProcessed ){
            tileRender.receiveTileData( tileProcessed );
        });

        // Update stage size.
        maxWidthInput.onchange = function(){
            ImageReader.setMaxWidth( maxWidthInput.value );
        };

        maxHeightInput.onchange = function(){
            ImageReader.setMaxHeight( maxHeightInput.value );
        };
    });

})();