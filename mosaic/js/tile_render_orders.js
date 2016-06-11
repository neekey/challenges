/**
 * predefined tile rendering orders
 *  the methods below will be called given the row amount and col amount,
 *  the returned groups will be used to decide the tile render & process order
 *  you should be easily to create your own render orders by adding new methods
 */
(function(){

    window.TileRenderOrders = {

        rowByRow: function( row, col ){
            var groups = [];
            var r;
            var c;
            var group;

            for( r = 0; r < row; r++ ){

                group = [];
                for( c = 0; c < col; c++ ){
                    group.push({
                        row: r,
                        col: c
                    });
                }

                groups.push( group );
            }

            return groups;
        },

        rowByRowReverse: function( row, col ){
            var groups = [];
            var r;
            var c;
            var group;

            for( r = row - 1; r >= 0; r-- ){

                group = [];
                for( c = 0; c < col; c++ ){
                    group.push({
                        row: r,
                        col: c
                    });
                }

                groups.push( group );
            }

            return groups;
        },

        colByColReverse: function( row, col ){
            var groups = [];
            var r;
            var c;
            var group;
            for( c = col - 1; c >= 0; c-- ){
                group = [];
                for( r = 0; r < row; r++ ){
                    group.push({
                        row: r,
                        col: c
                    });
                }

                groups.push( group );
            }

            return groups;
        },

        colByCol: function( row, col ){
            var groups = [];
            var r;
            var c;
            var group;
            for( c = 0; c < col; c++ ){
                group = [];
                for( r = 0; r < row; r++ ){
                    group.push({
                        row: r,
                        col: c
                    });
                }

                groups.push( group );
            }

            return groups;
        },

        rowSpread: function( row, col ){

            var groups = [];
            var r;
            var c;
            var groupUp;
            var groupDown;
            var rowMid = Math.floor( row / 2 );

            for( r = 0; r <= rowMid; r++ ){

                groupUp = [];
                groupDown = [];

                for( c = 0; c < col; c++ ){
                    if( rowMid + r < row ){

                        groupDown.push({
                            row: rowMid + r,
                            col: c
                        });
                    }

                    if( rowMid - r >= 0 ){
                        groupUp.push({
                            row: rowMid - r,
                            col: c
                        });
                    }

                }

                groups.push( groupUp );
                groups.push( groupDown );
            }

            return groups;
        },

        colSpread: function( row, col ){

            var groups = [];
            var r;
            var c;
            var groupLeft;
            var groupRight;
            var colMid = Math.floor( col / 2 );

            for( c = 0; c <= colMid; c++ ){

                groupLeft = [];
                groupRight = [];

                for( r = 0; r < row; r++ ){

                    if( colMid + c < col ){
                        groupRight.push({
                            row: r,
                            col: colMid + c
                        });
                    }

                    if( colMid - c >= 0 ){
                        groupLeft.push({
                            row: r,
                            col: colMid - c
                        });
                    }
                }

                groups.push( groupLeft );
                groups.push( groupRight );
            }

            return groups;
        }
    };
})();