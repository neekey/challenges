/* global beforeEach describe it chai inject */
var Assert = chai.assert;
const TileProcessor = window.TileProcessor;
var TestUtils = window.TestUtils;

describe('TileProcessor', () => {

    describe('methods provided by TileProcessor', () => {

        it( 'getTileRenderOrder()', () => {

            /* just this test simple enough .. different test can be added to different render type */
            var groups = TileProcessor.getTileRenderOrder( 'rowByRow', 5, 5 );
            Assert.equal( groups.length, 5 );
            groups.forEach( tiles => {
                Assert.equal( tiles.length, 5 );
            });
        });

        it('getTaskInfo()', () => {

            const imageData = {
                width: 100,
                height: 100
            };
            const tileSize = {
                width: 10,
                height: 10
            };
            const info = TileProcessor.getTaskInfo( 'rowByRow', imageData, tileSize );
            Assert.equal( info.rows, 10 );
            Assert.equal( info.cols, 10 );
            Assert.equal( info.groups.length, 10 );
        });
    });

    describe('tile computation process', () => {

        let imageData = null;

        before( () => {
            const width = 100;
            const height = 100;
            const pixels = TestUtils.generateImagePixels( width, height );
            imageData = {
                width: width,
                height: height,
                data: TestUtils.transformPixelIntoImageData( pixels, width, height )
            };
        });

        it('tiles should be processed by order', done => {
            var tileSize = {
                width: 10,
                height: 10
            };
            var taskInfo = TileProcessor.getTaskInfo( 'rowByRow', imageData, tileSize );
            var groupCount = 0;
            var tileIndex = 0;

            TileProcessor.onTileProcessed(function( tile ){

                Assert.equal( tile.groupIndex, groupCount );
                Assert.equal( tile.tileIndex, tileIndex );
                Assert.equal( tile.taskId, taskInfo.taskId );

                if( tile.groupEnd ){
                    groupCount++;
                    tileIndex = 0;

                    if( groupCount == taskInfo.groups.length ){
                        done();
                    }
                    else if( groupCount > taskInfo.groups.length ){
                        throw new Error( 'No more tile should be processed' );
                    }
                }
                else {
                    tileIndex++;
                }
            });

            TileProcessor.startTask( {
                imageData: imageData,
                processGroups: taskInfo.groups,
                rows: taskInfo.rows,
                cols: taskInfo.cols,
                tileWidth: tileSize.width,
                tileHeight: tileSize.height,
                taskId: taskInfo.taskId
            });
        });

    });
});
