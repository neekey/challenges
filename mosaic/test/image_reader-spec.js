/* global beforeEach describe it chai inject */
var Assert = chai.assert;
const ImageReader = window.ImageReader;

describe('utils provided by ImageReader', () => {

    describe('getSuitSize()', () => {

        before(() => {
            ImageReader.setMaxWidth( 400 );
            ImageReader.setMaxHeight( 400 );
        });

        it('If image size is small than stage', () => {
            var suitSize = ImageReader.getSuitSize( 200, 300 );
            Assert.equal( suitSize.width, 200 );
            Assert.equal( suitSize.height, 300 );
        });

        it( 'If image width is bigger than height', () => {
            var suitSize = ImageReader.getSuitSize( 800, 500 );
            Assert.equal( suitSize.width, 400 );
            Assert.equal( suitSize.height, 250 );
        });

        it( 'If image HEIGHT is bigger than width', () => {
            var suitSize = ImageReader.getSuitSize( 500, 800 );
            Assert.equal( suitSize.width, 250 );
            Assert.equal( suitSize.height, 400 );
        });
    });
});
