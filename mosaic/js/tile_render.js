/**
 * TileRender
 */
(function(){

    // check if we have a high resolution.
    var IS_RETINA = (function () {
        var isRetina = false;
        var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';

        if (window.devicePixelRatio > 1) {
            isRetina = true;
        }

        if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
            isRetina = true;
        }

        return isRetina;
    })();

    // for canvas rendering, for a high resolution screen, make sure using double canvas pixel to css pixel
    var PIXEL_RATIO = IS_RETINA ? 2 : 1;

    /**
     * @param {Element} stage, the container for the whole rendering stage.
     * @constructor
     */
    function TileRender( stage ){
        this.stage = stage;
        this.stage.style.position = 'relative';

        this._setUpCanvas();
        this._startLoop();
    }

    TileRender.prototype = {

        /**
         * create canvases for tile rendering
         * @private
         */
        _setUpCanvas: function(){

            this._canvas = document.createElement( 'canvas' );
            this._canvasCtx = this._canvas.getContext( '2d' );
            this.stage.appendChild( this._canvas );

            // just keep this in memory
            this._offscreenCanvas = document.createElement( 'canvas' );
            this._offscreenCanvasCtx = this._offscreenCanvas.getContext( '2d' );
        },

        _startLoop: function(){
            this._loop();
        },


        _loop: function(){

            var self = this;
            this._loopTimer = requestAnimationFrame(function(){

                // loading next resource
                self._loadNextTile();

                // render next group
                self._renderNextGroup();

                self._loop();
            });
        },

        _loopTimer: null,

        // the max concurrency amount tile image loadings can be
        _maxLoadingConcurrency: 5,

        // tile groups need to be rendered
        _tilesGroups: {},

        // current rendering tile group index
        _currentGroupIndex: 0,

        _renderedGroups: [],

        _tileLoadingQueue: [],

        _loadedTiles: [],

        _currentLoadingTileCount: 0,

        _onTileLoaded: null,

        _onGroupRendered: null,

        stageInfo: null,

        getLoadedTiles: function(){
            return this._loadedTiles;
        },

        getRenderedGroups: function(){
            return this._renderedGroups;
        },

        // reset all the process ( rendering & loading )
        clean: function(){
            this._tilesGroups = {};
            this._currentGroupIndex = 0;
            this._tileLoadingQueue = [];
            this._loadedTiles = [];
            this._renderedGroups = [];
            this.stageInfo = null;
            this.taskId = null;

            // note currentLoadingTileCount is not reset to zero, because image loading can not be canceled
            // we keep currentLoadingTileCount as it is, which just reflects what is happening.
        },

        /**
         * receive new tile data
         * @param {Object} tileProcessed
         * @param {Object} tileProcessed.groupIndex
         * @param {Object} tileProcessed.groupEnd
         * @param {Object} tileProcessed.row
         * @param {Object} tileProcessed.col
         * @param {Object} tileProcessed.averageColor
         * @param {Object} tileProcessed.taskId
         */
        receiveTileData: function( tileProcessed ){

            if( tileProcessed.taskId == this.taskId ){
                var groupIndex = tileProcessed.groupIndex;
                var group = this._tilesGroups[ groupIndex ] =
                    this._tilesGroups[ groupIndex ] || { tiles: [], groupEnd: false, tileLoaded: false, index: groupIndex };

                group.tiles.push( tileProcessed );

                if( tileProcessed.groupEnd ){
                    group.groupEnd = true;
                }

                this._addTileToLoadQueue( tileProcessed );
            }
        },

        _addTileToLoadQueue: function( tile ){
            this._tileLoadingQueue.push( tile );
        },

        _loadNextTile: function(){

            var self = this;
            if( this._currentLoadingTileCount < this._maxLoadingConcurrency ){
                var nextTile = this._tileLoadingQueue.shift();

                if( nextTile ){
                    this._currentLoadingTileCount++;
                    this._loadTile( nextTile, function(){
                        self._currentLoadingTileCount--;
                        self._loadedTiles.push( nextTile );
                        self._onTileLoaded && self._onTileLoaded( nextTile );
                        self._loadNextTile();
                    });
                }
            }
        },

        /**
         * load a single tile image
         * @param tile
         * @param callback
         * @private
         */
        _loadTile: function( tile, callback ){

            var img = new Image();
            var src = '/color/' + tile.averageColor + '/' + this.stageInfo.tileWidth + 'x' + this.stageInfo.tileHeight;
            tile.img = img;

            // in case network timeout..
            var timeout = false;
            var timer = setTimeout(function(){
                timeout = true;
                tile.loaded = true;
                tile.timeout = true;
                callback();
            }, 2000 );

            img.onload = function(){
                if( !timeout ){
                    clearTimeout( timer );
                    tile.loaded = true;
                    callback();
                }
            };

            img.src = src;
        },

        /**
         * try to render next available tile group ( all tile color are computed and images are loaded )
         */
        _renderNextGroup: function(){

            var group = this._tilesGroups[ this._currentGroupIndex ];

            // check if all tiles are computed
            if( group && group.groupEnd ){

                var loaded = true;

                // check if all tile image are loaded.
                group.tiles.forEach(function( tile ){
                    if( !tile.loaded ){
                        loaded = false;
                    }
                });

                if( loaded ){
                    group.loaded = true;
                    this._renderGroup( group );
                    this._currentGroupIndex++;
                }
            }
        },

        /**
         * render a specific group, using Canvas because:
         *  - 1, avoid blink sometime by individual image rendering ( even the image is already loaded )
         *  - 2, save a lot memory
         *  - 3, higher performance
         * @param group
         * @private
         */
        _renderGroup: function( group ){

            var self = this;
            var tileWidth = this.stageInfo.tileWidth;
            var tileHeight = this.stageInfo.tileHeight;
            this._offscreenCanvasCtx.clearRect( 0, 0, this._offscreenCanvas.width, this._offscreenCanvas.height );

            group.tiles.forEach(function( tile ){
                var img = tile.img;

                // white bg
                self._offscreenCanvasCtx.fillStyle = 'white';
                self._offscreenCanvasCtx.fillRect(
                    tile.col * tileWidth * PIXEL_RATIO,
                    tile.row * tileHeight * PIXEL_RATIO,
                    tileWidth * PIXEL_RATIO,
                    tileHeight * PIXEL_RATIO
                );
                // draw tile
                self._offscreenCanvasCtx.drawImage( img,
                    tile.col * tileWidth * PIXEL_RATIO,
                    tile.row * tileHeight * PIXEL_RATIO,
                    tileWidth * PIXEL_RATIO,
                    tileHeight * PIXEL_RATIO
                );

                // for GC
                tile.img = null;
            });

            this._canvasCtx.drawImage( this._offscreenCanvas, 0, 0 );
            this._renderedGroups.push( group );
            this._onGroupRendered && this._onGroupRendered( group );
        },

        /**
         * set up the stage with the given tiles info
         * @param stageInfo
         * @param stageInfo.url
         * @param stageInfo.width
         * @param stageInfo.height
         * @param stageInfo.rows
         * @param stageInfo.cols
         * @param stageInfo.tileWidth
         * @param stageInfo.tileHeight
         * @param stageInfo.taskId
         */
        setUpState: function( stageInfo ){
            this.clean();
            
            var stageWidth = stageInfo.cols * stageInfo.tileWidth;
            var stageHeight = stageInfo.rows * stageInfo.tileHeight;
            
            this.stageInfo = stageInfo;

            this.stage.style.width = stageWidth + 'px';
            this.stage.style.height = stageHeight + 'px';

            // set origin image as bg
            this.stage.style.background = 'url(' + stageInfo.url + ') no-repeat';
            this.taskId = stageInfo.taskId;

            // set up canvas size.
            this._canvas.width = this._offscreenCanvas.width = stageWidth * PIXEL_RATIO;
            this._canvas.height = this._offscreenCanvas.height = stageHeight * PIXEL_RATIO;
            this._canvas.style.width = this._offscreenCanvas.style.width = stageWidth + 'px';
            this._canvas.style.height = this._offscreenCanvas.style.height = stageHeight + 'px';
        },

        onTileLoaded: function( callback ){
            if( typeof callback == 'function' ){
                this._onTileLoaded = callback;
            }
        },

        onGroupRendered: function( callback ){
            if( typeof callback == 'function' ){
                this._onGroupRendered = callback;
            }
        }
    };

    window.TileRender = TileRender;
})();
