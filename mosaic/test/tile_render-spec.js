var Assert = chai.assert;
const TileRender = window.TileRender;
var TestUtils = window.TestUtils;

describe('TileRender test', () => {

    let tileRender;
    const stage = document.createElement( 'div' );
    const stageInfo = {
        width: 50,
        height: 50,
        tileWidth: 10,
        tileHeight: 10,
        rows: 5,
        cols: 5,
        url: '',
        taskId: 1
    };

    before(() => {
        document.body.appendChild( stage );
        tileRender = new TileRender( stage );
        tileRender.setUpState( stageInfo );
    });

    it( 'give tiles to tileRender and it should load images and render groups', done => {

        // assume we applied "rowByRow" order
        // we give tileRender tile every 10ms
        let row = 0;
        let col = 0;
        let timer = setInterval(() => {

            tileRender.receiveTileData({
                groupIndex: row,
                groupEnd: col == ( stageInfo.cols - 1 ),
                row: row,
                col: col,
                averageColor: TestUtils.getRandomColor().substring(1),
                taskId: stageInfo.taskId
            });

            col++;

            if( col > stageInfo.cols - 1 ){
                row++;
                col = 0;

                if( row > stageInfo.rows - 1 ){
                    clearInterval( timer );
                }
            }
        }, 10 );

        let tileLoaded = 0;
        let groupRenderedCount = 0;

        tileRender.onTileLoaded(() => {
            tileLoaded++;
        });

        tileRender.onGroupRendered( group => {

            Assert.equal( group.index, groupRenderedCount );
            groupRenderedCount++;

            if( groupRenderedCount == stageInfo.rows ){
                Assert.equal( tileLoaded, stageInfo.rows * stageInfo.cols );
                done();
            }
        });
    });
});