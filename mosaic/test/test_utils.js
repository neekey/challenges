window.TestUtils = {
    // build a pixel two dimension array, so that you can access a pixel by pixels[x][y]
    generateImagePixels( width, height ){
        const pixels = [];

        for( let x = 0, col = []; x < width; x++ ){

            for( let y = 0; y < height; y++ ){

                col.push({
                    r: Math.floor( Math.random() * 255 ),
                    g: Math.floor( Math.random() * 255 ),
                    b: Math.floor( Math.random() * 255 )
                });
            }

            pixels.push( col );
        }

        return pixels;
    },

    transformPixelIntoImageData( pixels, width, height ){
        const data = [];

        for( let y = 0, pixel = null; y < height; y++ ){

            for( let x = 0; x < width; x++ ){
                pixel = pixels[ x ][ y ];
                data.push( pixel.r );
                data.push( pixel.g );
                data.push( pixel.b );
                data.push( 1 );
            }
        }

        return data;
    },

    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
};