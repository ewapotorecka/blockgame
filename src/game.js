
import { Scene } from './scene';
import { levels } from './levels';
import { Renderer } from './renderer';
import { Emitter } from './emitter';

export const levelStates = {
	UNDONE: 0,
	DONE: 1,
	SKIPPED: 2
}

export class Game {
	constructor() {
		this.levelChangeEmitter = new Emitter();
		this.levelsInfo = levels.map( () => levelStates.UNDONE );
	}

	start() {
		this.levelNum = 0;
		const levelData = levels[ this.levelNum ];
		this.levels = levels;
		this.scene = new Scene( levelData );
		const canvas = document.getElementById( 'blocksBoard' );
		this.ctx = canvas.getContext( '2d' );

		this.renderer = new Renderer( this.ctx, this.scene );
		this.renderer.resizeBoard();
		this.renderer.renderBoard();
		this.handleKeyboard();

		this.scene.levelChangeEmitter.subscribe( () => {
			this.levelsInfo[ this.levelNum ] = levelStates.DONE;
			this.loadNextLevel();
		} );

		window.addEventListener( 'resize', () => {
			this.renderer.resizeBoard();
			this.renderer.renderBoard();
		} );
	}

	loadNextLevel() {
		const num = this.levelNum + 1;

		this.loadLevel( num );
	}

	loadLevel( id ) {
		this.levelNum = id;
		const level = levels[ this.levelNum ];
		this.scene.setLevelData( level );
		this.renderer.resizeBoard();
		this.renderer.renderBoard();
		this.levelChangeEmitter.emit();
	}

	handleKeyboard() {
		document.addEventListener( 'keyup', event => {
			if ( event.key === 'ArrowUp' ) {
				this.scene.move( { x: 0, y: -1 } );
			} else if ( event.key === 'ArrowDown' ) {
				this.scene.move( { x: 0, y: 1 } );
			} else if ( event.key === 'ArrowLeft' ) {
				this.scene.move( { x: -1, y: 0 } );
			} else if ( event.key === 'ArrowRight' ) {
				this.scene.move( { x: 1, y: 0 } );
			}
			this.renderer.renderBoard();
		} );
	}
}
