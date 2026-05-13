// @ts-check
import {SmartBuffer} from "smart-buffer"

export class PackedVoxels {
	/** @param {Buffer} buffer */
	constructor(buffer) {
		if (Buffer.isBuffer(buffer)) {
			// data is serialized in BlockStarPlanet's voxel format
			const chunkData = SmartBuffer.fromBuffer(buffer)
			// read layout
			const volumeChunks = [chunkData.readUInt8(), chunkData.readUInt8(), chunkData.readUInt8()]
			const volumeChunksOffsets = []
			const chunkSize = chunkData.readUInt8()
			this.setVolumes(volumeChunks, chunkSize)
			for (let z = 0; z < volumeChunks[2]; z++) {
				for (let y = 0; y < volumeChunks[1]; y++) {
					for (let x = 0; x < volumeChunks[0]; x++) {
						volumeChunksOffsets.push([x, y, z])
					}
				}
			}
			// think its just a height map. not really useful here. we can skip it
			chunkData.readBuffer(chunkData.readUInt32BE())
			const chunkCount = chunkData.readUInt16BE() // accurate, but unused here.
			let bufferSize = chunkData.readUInt32BE()
			const maxIterations = 2000 // in case the reader is borked, don't waste any more time. also useful for logging
			let iteration = 0
			console.log("reading buffers")
			const voxelBuffers = []
			while (!(iteration > maxIterations || chunkData.remaining() == 0)) {
				console.log(bufferSize)
				if (bufferSize == 0) {
					console.log(`erm. Fucky wucky?? ${chunkData.remaining()} bytes still remain 3:`)
					// console.log("one step bacj")
					// chunkData.readOffset -= 8
					break
				}
				voxelBuffers.push(chunkData.readBuffer(bufferSize))
				if (chunkData.remaining()) bufferSize = chunkData.readUInt32BE()
				iteration++
			}
			console.log("buffers", voxelBuffers.length / 4)

			const blockBounds = volumeChunks.map((value) => value * chunkSize)
			for (let bufferIndex = 0; bufferIndex < voxelBuffers.length / 4; bufferIndex++) {
				const blocktypeBuffer = voxelBuffers[bufferIndex * 4]
				const rotationBuffer = voxelBuffers[bufferIndex * 4 + 1]
				const shapeBuffer = voxelBuffers[bufferIndex * 4 + 2]
				const rgbBuffer = voxelBuffers[bufferIndex * 4 + 3]
				const currentSectionOffset = volumeChunksOffsets[bufferIndex]
				const blockOffset = currentSectionOffset.map((value) => value * chunkSize)
				let currentOffset = 0
				for (let z = 0; z < chunkSize; z++) {
					for (let y = 0; y < chunkSize; y++) {
						for (let x = 0; x < chunkSize; x++) {
							const typeDatum = blocktypeBuffer.readUInt16BE(currentOffset * 2 + 4)
							const shapeDatum = shapeBuffer.readUInt8(currentOffset)
							const rotationDatum = rotationBuffer.readUInt8(currentOffset)
							const colorDatum = rgbBuffer.readUInt32BE(currentOffset * 4)
							const index = this.getIndex([x, y, z].map((position, index) => position + blockOffset[index]))
							this.color.writeUInt32BE(colorDatum, index * 4)
							this.types.writeUInt16BE(typeDatum, index * 2)
							this.shapes.writeUInt8(shapeDatum, index)
							this.rotations.writeUInt8(rotationDatum, index)
							currentOffset++
						}
					}
				}
			}
		} else {
			// not implemented
			throw "Not implemented :("
		}
	}

	/**@param {any[]} chunkExtents
	 * @param {number} chunkSize
	 */
	setVolumes(chunkExtents, chunkSize) {
		const volumeSize = chunkExtents.map((/** @type {number} */ chunkExtent) => chunkExtent * chunkSize)
		const bufferLength = volumeSize[0] * volumeSize[1] * volumeSize[2]
		this.types = Buffer.alloc(bufferLength * 2)
		this.rotations = Buffer.alloc(bufferLength * 1)
		this.shapes = Buffer.alloc(bufferLength * 1)
		this.color = Buffer.alloc(bufferLength * 4 + 0)
		this.chunkExtents = chunkExtents
		this.chunkSize = chunkSize
		this.volumeSize = volumeSize
		console.log(volumeSize, bufferLength)
	}

	/** @param {number[]} position */
	getIndex(position) {
		return position[0] + this.volumeSize[2] * (position[2] + this.volumeSize[0] * position[1])
	}

	/** @param {number | undefined} index */
	getVoxel(index) {
		return [this.types.readUInt16BE(index * 2), this.color.readUInt32BE(index * 4), this.shapes.readUInt8(index), this.rotations.readUInt8(index)]
	}

	/**@param {any} type
	 * @param {any} shape
	 * @param {any} color
	 * @param {any} rotation
	 */
	setVoxel(type, shape, color, rotation) {
		// 0-255, int32 (including redunant bits), byte (??). htye're just numbers okay?
	}
}

export default PackedVoxels
