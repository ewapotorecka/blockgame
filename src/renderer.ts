import { Scene } from './scene';

export class Renderer {
    private _ctx: CanvasRenderingContext2D;
    private _scene: Scene;
    private _tileSize!: number;

    constructor( ctx: CanvasRenderingContext2D, scene: Scene ) {
        this._ctx = ctx;
        this._scene = scene;
    }

    renderBoard() {
        this._clearCanvas();
        this._drawBoard();
        this._drawBlocks();
        this._drawPlayer();
        this._drawExit();
    }

    resizeBoard() {
        if ( window.innerHeight / this._scene.board.height < ( window.innerWidth - 400 ) / this._scene.board.width ) {
            this._tileSize = window.innerHeight / this._scene.board.height;
        } else {
            this._tileSize = ( window.innerWidth - 400 ) / this._scene.board.width;
        }

        this._ctx.canvas.height = this._scene.board.height * this._tileSize;
        this._ctx.canvas.width = this._scene.board.width * this._tileSize;
    }

    _clearCanvas() {
        this._ctx.clearRect( 0, 0, this._ctx.canvas.width, this._ctx.canvas.height );
    }

    _drawBoard() {
        const board = this._scene.board;

        this._ctx.strokeRect(
            0, 0, board.width * this._tileSize, board.height * this._tileSize
        );
    }

    _drawBlocks() {
        const colorAdd = 255 / this._scene.blocks.length;
        let colorNum = 0;
        for ( const block of this._scene.blocks ) {
            const color = `rgb( ${ colorNum }, ${ colorNum }, ${ colorNum } )`;

            block.draw( this._ctx, color, this._tileSize );
            colorNum = colorNum + colorAdd;
        }
    }

    _drawPlayer() {
        const player = this._scene.playerPosition;
        this._ctx.fillStyle = '#FFD400';
        this._ctx.beginPath();
        this._ctx.arc(
            player.x * this._tileSize + this._tileSize / 2,
            player.y * this._tileSize + this._tileSize / 2,
            this._tileSize / 2, 0, 2 * Math.PI
        );
        this._ctx.fill();
    }

    _drawExit() {
        const exit = this._scene.exit;
        this._ctx.fillStyle = '#D90368';
        this._ctx.fillRect( exit.x * this._tileSize, exit.y * this._tileSize, this._tileSize, this._tileSize );
    }
}

