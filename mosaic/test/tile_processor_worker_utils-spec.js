/* global beforeEach describe it chai inject */
var Assert = chai.assert;
const TileProcessorUtils = window.TileProcessorUtils;
var TestUtils = window.TestUtils;

describe('utils provided by tile processor worker', () => {


    it('getTileColor()', () => { // well, this is not a good way to test...LOL

        const width = 100;
        const height = 100;
        const pixels = TestUtils.generateImagePixels( width, height );
        const imageData = {
            width: width,
            height: height,
            data: TestUtils.transformPixelIntoImageData( pixels, width, height )
        };

        const tileSize = {
            width: 16,
            height: 16
        };

        const tileCoordinate = {
            col: 4,
            row: 2
        };
        let totalPixels = 0;
        const colorSum = {
            r: 0,
            g: 0,
            b: 0
        };

        for( let y = 0, pixel = null; y < tileSize.height; y++ ){
            for( let x = 0; x < tileSize.width; x++ ){
                pixel = pixels[ tileCoordinate.col * tileSize.width + x ][ tileCoordinate.row * tileSize.height + y ];
                colorSum.r += pixel.r;
                colorSum.g += pixel.g;
                colorSum.b += pixel.b;
                totalPixels++;
            }
        }
        const averageColor = TileProcessorUtils.convertRGBToHex(
            Math.floor( colorSum.r / totalPixels ),
            Math.floor( colorSum.g / totalPixels ),
            Math.floor( colorSum.b / totalPixels )
        );
        Assert.equal( averageColor, TileProcessorUtils.getTileColor( imageData, tileSize, tileCoordinate ) );
    });

    it('tileToPixelCoordinate()', () => {
        const tileSize = {
            width: 16,
            height: 32
        };

        const coordinate = {
            col: 10,
            row: 20
        };

        const pixelCoordinate = TileProcessorUtils.tileToPixelCoordinate(
            coordinate.col,
            coordinate.row,
            tileSize.width,
            tileSize.height
        );

        Assert.equal( pixelCoordinate.x, 160 );
        Assert.equal( pixelCoordinate.y, 640 );
    });

    it('pixelCoordinateToImageDataIndex()', () => {
        const pixelCoor = {
            x: 10,
            y: 20
        };

        const imgWidth = 200;
        const imageDataIndex = TileProcessorUtils.pixelCoordinateToImageDataIndex( pixelCoor.x, pixelCoor.y, imgWidth );
        Assert.equal( imageDataIndex, 16040 );

    });

    it('convertIntToHexString()', () => {
        Assert.equal( TileProcessorUtils.convertIntToHexString( 9 ), '09' );
        Assert.equal( TileProcessorUtils.convertIntToHexString( 10 ), '0a' );
        Assert.equal( TileProcessorUtils.convertIntToHexString( 17 ), '11' );
    });

    it('convertRGBToHex()', () => {
        Assert.equal( TileProcessorUtils.convertRGBToHex( 9, 240, 10 ), '09f00a' );
    });
});
