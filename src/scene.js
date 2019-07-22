import { RectangleBlock } from './rectangleblock';
import { CustomBlock } from './customblock';

export class Scene {
	constructor( levelData ) {
		this.setLevelData( levelData );
	}

	setLevelData( level ) {
		// TODO: All these things should be private and be available only from this class.

		level = JSON.parse( JSON.stringify( level ) );

		this.blocks = this._createBlocksFromJson( level.blocks );
		this.board = level.board;
		this.exit = level.exit;
		this.playerPosition = level.playerPosition;
	}

	_createBlocksFromJson( jsonBlocks ) {
		return jsonBlocks.map( jsonBlock => {
			if ( jsonBlock.type == 'rectangle' ) {
				return new RectangleBlock( jsonBlock.position, jsonBlock.width, jsonBlock.height );
			}
			if ( jsonBlock.type == 'custom' ) {
				return new CustomBlock( jsonBlock.points );
			}
		} );
	}

	isExitAt( position ) {
		return position.x == this.exit.x && position.y == this.exit.y;
	}

	isEmptyAt( position ) {
		for ( const block of this.blocks ) {
			for ( const partialPosition of block.partialPositions ) {
				if ( position.x == partialPosition.x && position.y == partialPosition.y ) {
					return false;
				}
			}
		}

		return true;
	}

	canBlockBeMoved( block, moveVector ) {
		const previousBlocks = this.blocks.slice();
		this.blocks = this.blocks.filter( blockInArr => block !== blockInArr );

		for ( const partialPosition of block.partialPositions ) {
			const newPosition = {
				x: partialPosition.x + moveVector.x,
				y: partialPosition.y + moveVector.y
			};

			if ( !this.isPositionOnBoard( newPosition ) ) {
				this.blocks = previousBlocks;
				return false;
			}

			if ( !this.isEmptyAt( newPosition ) ) {
				this.blocks = previousBlocks;
				return false;
			}
		}
		this.blocks = previousBlocks;
		return true;
	}

	findBlock( position ) {
		for ( const block of this.blocks ) {
			for ( const partialPosition of block.partialPositions ) {
				if ( position.x == partialPosition.x && position.y == partialPosition.y ) {
					return block;
				}
			}
		}
	}

	isPositionOnBoard( position ) {
		return (
			position.x < this.board.width &&
			position.y < this.board.height &&
			position.x >= 0 &&
			position.y >= 0
		);
	}
}

