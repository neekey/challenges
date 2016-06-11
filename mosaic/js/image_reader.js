/**
 * ImageReader: uploading image & extracting image data.
 */

(function(){

    /**
     * Default maximum size for image to be rendered in the stage
     */
    var MAX_HEIGHT = MAX_CANVAS_HEIGHT;
    var MAX_WIDTH = MAX_CANVAS_WIDTH;
    var WIDTH_HEIGHT_RATE = MAX_WIDTH / MAX_HEIGHT;

    /**
     * scale real image size into suited size
     * @param imgWidth
     * @param imgHeight
     * @returns {*}
     */
    function getSuitSize( imgWidth, imgHeight ){

        if( imgWidth <= MAX_WIDTH && imgHeight <= MAX_HEIGHT ){
            return {
                width: imgWidth,
                height: imgHeight
            };
        }
        else {

            var rate = imgWidth / imgHeight;

            if( rate > WIDTH_HEIGHT_RATE ){
                return {
                    width: MAX_WIDTH,
                    height: imgHeight * ( MAX_WIDTH / imgWidth )
                };
            }
            else {
                return {
                    height: MAX_HEIGHT,
                    width: imgWidth * ( MAX_HEIGHT / imgHeight )
                };
            }
        }
    }

    /**
     * Get image data from a img element.
     * @param imgEl
     * @returns {{imageData: ImageData, url: string}}
     */
    function getImageData( imgEl ){

        var imgWidth = imgEl.width;
        var imgHeight = imgEl.height;

        // scale
        var suiteSize = getSuitSize( imgWidth, imgHeight );

        var canvas = document.createElement('canvas');
        var context = canvas.getContext && canvas.getContext('2d');
        canvas.height = suiteSize.height;
        canvas.width = suiteSize.width;
        context.drawImage(imgEl, 0, 0, suiteSize.width, suiteSize.height );

        return {
            imageData: context.getImageData(0, 0, canvas.width, canvas.height),
            url: canvas.toDataURL()
        };
    }

    /**
     * ImageReader
     * @param {Element} input, used to upload image
     * @constructor
     */
    function ImageReader( input ){

        var self = this;

        // Get imageData form the selected image and invoke callback.
        input.addEventListener( 'change', function(){
            var file = this.files[0];
            var imageType = /^image\//;

            if( file ){
                if (!imageType.test(file.type)) {
                    return alert( 'Not a valid image file.');
                }

                var img = new Image();
                img.onload = function(){

                    var result = getImageData( img );

                    self._onloadCallback( {
                        imageData: result.imageData,
                        // note since the image is scaled to fit the stage size,
                        // a new url is generated to replace the origin one.
                        url: result.url
                    });

                    img = null;
                };

                var reader = new FileReader();
                reader.onload = function( e ) {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    /**
     * @param callback ( { imageData: { data, width, height }, url } )
     */
    ImageReader.prototype.onRead = function( callback ){
        this._onloadCallback = callback;
    };

    /**
     * @static
     * @returns {{width, height}}
     */
    ImageReader.getMaxSize = function(){
        return {
            width: MAX_WIDTH,
            height: MAX_HEIGHT
        };
    };

    ImageReader.setMaxWidth = function( width ){
        MAX_WIDTH = width;
    };

    ImageReader.setMaxHeight = function( height ){
        MAX_HEIGHT = height;
    };

    ImageReader.getSuitSize = getSuitSize;

    window.ImageReader = ImageReader;
})();


