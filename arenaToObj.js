function readRotationX(byte) {
	return ((byte << 26) >>> 30)
}
function readRotationY(byte) {
	return ((byte << 28) >>> 30)
}
function readRotationZ(byte) {
	return ((byte << 30) >>> 30)
}
const radianIncrement = 1.5708
function getRotationVector(byte) {
	// Bunny: there are some hardcoded vectors in here. not sure if i am parsing them correctly, but the default switch is mostly accurate, otherwise the incorrectly guessed vectors are corrected. there are only 6 incorrect vectors, and they seem somewhat predictable as to how they fail. its weird, i am not going to look into c# or actionscript decomps for this, mainly because i don't want to install tools at this time, but also this been mostly the efforts of staring at a file format for a while and not a decomp of the client code. again, its weird.
	// typically, developers want to do sensible stuff, but other factors (internal or external) may screw that up and implement stuff that will be received poorly.
	// ps: the bottom face is incorrect. please fix.
	switch (byte) {
		case 17: // 000 10001 to understand means to know what is going on. this was easy to figure out.
			return [1, 1, 0].map(value => value * radianIncrement)
		case 18: // 000 10010 again, but the process of understanding becomes easier to understand.
			return [1, 2, 0].map(value => value * radianIncrement)
		case 19: // if it somehow isn't obvious. the process is rather simple, i am only incrementing the x and y. it may be easier to understand when given the game's interface for rotations.
			return [1, 3, 0].map(value => value * radianIncrement)
		case 25: // this is clearly a separate row now, as indicated by the numbers being changed. however, the process remains the same, and was easily guessed once you're aware of the vectors that were correct, and those that aren't. however, this is what i would have said if this worked and is much complicated as it may have seemed, as it turns out, [3, 1, 0] was not the correct answer. if you just can't , just take a break. I feel tried (not tired, but also tired too.).
			return [3, 1, 0].map(value => value * radianIncrement)
		case 24: // i was once called a freak. but maybe whoever said that was right.
			return [1, 0, 2].map(value => value * radianIncrement)
		case 27: // finally. i hated those three. as dull as it sounds, just keep trying. you'll get it.
			return [3, 3, 0].map(value => value * radianIncrement)
		case 31: // apparently there are more cases.
			return [2, 1, 2].map(value => value * radianIncrement)
		default: // but i believe everything i know about rotations is just speculation. i wasn't aware that the rotation order can matter. math is weird.
			return [readRotationX(byte) * radianIncrement,
			readRotationY(byte) * radianIncrement,
			readRotationZ(byte) * radianIncrement]
	}

}

const blockFaces = ["xNeg", "xPos", "yNeg", "yPos", "zNeg", "zPos"]

function fLEEP(arr) {
	if (arr[0]) {
		arr[0] = 0
	} else {
		arr[0] = 1
	}
	// if (arr[1]) {
	// 	arr[1] = 0
	// } else {
	// 	arr[1] = 1
	// }
	return arr
}
// faceCovers means if the surface covers the whole area. currently, only full faces are considered when detecting occluded geometry
// given face names are not accurate to any coordinate system involved.
const cubeShape = {
	// bottom face
	yNeg: {
		geometry: [
			[[0, 0, 1], fLEEP([0, 0])],
			[[0, 0, 0], fLEEP([1, 0])],
			[[1, 0, 0], fLEEP([1, 1])],

			[[1, 0, 1], fLEEP([0, 1])],
			[[0, 0, 1], fLEEP([0, 0])],
			[[1, 0, 0], fLEEP([1, 1])]
		],
		faceNormal: [0, -1, 0],
		faceCovers: true
	},
	yPos: { // Top face
		geometry: [
			[[1, 1, 0], [0, 0]],
			[[0, 1, 0], [0, 1]],
			[[0, 1, 1], [1, 1]],

			[[1, 1, 1], [1, 0]],
			[[1, 1, 0], [0, 0]],
			[[0, 1, 1], [1, 1]]
		],
		faceNormal: [0, 1, 0],
		faceCovers: true
	},
	zNeg: { // front face
		geometry: [
			[[1, 0, 0], fLEEP([0, 0])],
			[[0, 0, 0], fLEEP([1, 0])],
			[[0, 1, 0], fLEEP([1, 1])],

			[[1, 1, 0], fLEEP([0, 1])],
			[[1, 0, 0], fLEEP([0, 0])],
			[[0, 1, 0], fLEEP([1, 1])]
		],
		faceNormal: [0, 0, -1],
		faceCovers: true
	},

	zPos: { // back face
		geometry: [
			[[0, 0, 1], fLEEP([0, 0])],
			[[1, 0, 1], fLEEP([1, 0])],
			[[1, 1, 1], fLEEP([1, 1])],

			[[0, 1, 1], fLEEP([0, 1])],
			[[0, 0, 1], fLEEP([0, 0])],
			[[1, 1, 1], fLEEP([1, 1])]
		],
		faceNormal: [0, 0, 1],
		faceCovers: true
	},
	xNeg: { // left face
		geometry: [
			[[0, 0, 0], fLEEP([0, 0])],
			[[0, 0, 1], fLEEP([1, 0])],
			[[0, 1, 1], fLEEP([1, 1])],

			[[0, 1, 0], fLEEP([0, 1])],
			[[0, 0, 0], fLEEP([0, 0])],
			[[0, 1, 1], fLEEP([1, 1])]
		],
		faceNormal: [-1, 0, 0],
		faceCovers: true
	},
	xPos: { // right face
		geometry: [
			[[1, 0, 1], fLEEP([0, 0])],
			[[1, 0, 0], fLEEP([1, 0])],
			[[1, 1, 0], fLEEP([1, 1])],

			[[1, 1, 1], fLEEP([0, 1])],
			[[1, 0, 1], fLEEP([0, 0])],
			[[1, 1, 0], fLEEP([1, 1])]
		],
		faceNormal: [1, 0, 0],
		faceCovers: true
	}
}
const slopeShape = {
	// bottom face
	yNeg: {
		geometry: [
			[[0, 0, 1], fLEEP([0, 0])],
			[[0, 0, 0], fLEEP([1, 0])],
			[[1, 0, 0], fLEEP([1, 1])],

			[[1, 0, 1], fLEEP([0, 1])],
			[[0, 0, 1], fLEEP([0, 0])],
			[[1, 0, 0], fLEEP([1, 1])]
		],
		faceNormal: [0, -1, 0],
		faceCovers: true
	},
	yPos: { // Top face
		geometry: [
			[[1, 1, 0], [0, 0]],
			[[0, 1, 0], [0, 1]],
			[[0, 0, 1], [1, 1]],

			[[1, 0, 1], [1, 0]],
			[[1, 1, 0], [0, 0]],
			[[0, 0, 1], [1, 1]]
		],
		faceNormal: [0, 1, 0],
		faceCovers: false
	},
	zNeg: { // front face ( ia)
		geometry: [
			[[1, 0, 0], fLEEP([0, 0])],
			[[0, 0, 0], fLEEP([1, 0])],
			[[0, 1, 0], fLEEP([1, 1])],

			[[1, 1, 0], fLEEP([0, 1])],
			[[1, 0, 0], fLEEP([0, 0])],
			[[0, 1, 0], fLEEP([1, 1])]
		],
		faceNormal: [0, 0, -1],
		faceCovers: true
	},

	zPos: { // back face
		geometry: [
			// [[0, 0, 1], [0, 1]],
			// [[1, 0, 1], [1, 1]],
			// [[1, 1, 1], [1, 0]],

			// [[0, 1, 1], [0, 0]],
			// [[0, 0, 1], [0, 1]],
			// [[1, 1, 1], [1, 0]]
		],
		faceNormal: [0, 0, 1],
		faceCovers: false
	},
	xNeg: { // left face. I ARLEDY FIXED THE UV. DON:"T TOCUH"
		geometry: [
			[[0, 0, 0], [1, 0]],
			[[0, 0, 1], [0, 0]],
			[[0, 1, 0], [1, 1]],

			// [[0, 1, 0], [0, 0]],
			// [[0, 0, 0], [0, 1]],
			// [[0, 1, 1], [1, 0]]
		],
		faceNormal: [-1, 0, 0],
		faceCovers: false
	},
	xPos: { // right face. intentionally broken to match BSP's texturing
		geometry: [
			[[1, 0, 1], [1, 1]],
			[[1, 0, 0], [0, 0]],
			[[1, 1, 0], [0, 1]],

			// [[1, 1, 1], [0, 1]],
			// [[1, 0, 1], [0, 0]],
			// [[1, 1, 0], [1, 1]]
		],
		faceNormal: [1, 0, 0],
		faceCovers: false
	}
}

let output = "# Generated with BunnyNabbit's BlockStarPlanet .arena to .obj converter https://ko-fi.com/bunnynabbit\n"
let vertexNumber = 1
// https://www.npmjs.com/package/@math.gl/core
/**
* Rotate a 3D vector around the z-axis
* @param out The receiving vec3
* @param a The vec3 point to rotate
* @param b The origin of the rotation
* @param rad The angle of rotation in radians
*/
function rotateX(out, a, b, rad) {
	const p = [];
	const r = [];
	// Translate point to the origin
	p[0] = a[0] - b[0];
	p[1] = a[1] - b[1];
	p[2] = a[2] - b[2];
	// perform rotation
	r[0] = p[0];
	r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
	r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
	// translate to correct position
	out[0] = r[0] + b[0];
	out[1] = r[1] + b[1];
	out[2] = r[2] + b[2];
	return out;
}
/**
* Rotate a 3D vector around the z-axis
* @param out The receiving vec3
* @param a The vec3 point to rotate
* @param b The origin of the rotation
* @param rad The angle of rotation in radians
*/
function rotateY(out, a, b, rad) {
	const p = [];
	const r = [];
	// Translate point to the origin
	p[0] = a[0] - b[0];
	p[1] = a[1] - b[1];
	p[2] = a[2] - b[2];
	// perform rotation
	r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
	r[1] = p[1];
	r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
	// translate to correct position
	out[0] = r[0] + b[0];
	out[1] = r[1] + b[1];
	out[2] = r[2] + b[2];
	return out;
}
/**
* Rotate a 3D vector around the z-axis
* @param out The receiving vec3
* @param a The vec3 point to rotate
* @param b The origin of the rotation
* @param rad The angle of rotation in radians
*/
function rotateZ(out, a, b, rad) {
	const p = [];
	const r = [];
	// Translate point to the origin
	p[0] = a[0] - b[0];
	p[1] = a[1] - b[1];
	p[2] = a[2] - b[2];
	// perform rotation
	r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
	r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
	r[2] = p[2];
	// translate to correct position
	out[0] = r[0] + b[0];
	out[1] = r[1] + b[1];
	out[2] = r[2] + b[2];
	return out;
}
function addGeometry(face, offset, color = [255, 0, 0], rotation = [0, 0, 0]) {
	for (let i = 0; i < face.geometry.length / 3; i++) {
		const vertexOffset = i * 3
		const vert1 = face.geometry[vertexOffset]
		const vert2 = face.geometry[vertexOffset + 1]
		const vert3 = face.geometry[vertexOffset + 2]; // STINKY, SMELLY SEMI-COLON THAT IS REQUIRED
		[vert1, vert2, vert3].forEach(vert => {
			let transformedVert = []
			rotateY(transformedVert, vert[0], [0.5, 0.5, 0.5], rotation[1])
			rotateZ(transformedVert, transformedVert, [0.5, 0.5, 0.5], rotation[2])
			rotateX(transformedVert, transformedVert, [0.5, 0.5, 0.5], rotation[0])
			output += `v ${transformedVert.map((vertPos, vertIndex) => vertPos + offset[vertIndex]).join(" ")} ${color[0] / 255} ${color[1] / 255} ${color[2] / 255}\n`
			output += `vt ${vert[1].join(" ")}\n`
		})
		output += `f ${vertexNumber}/${vertexNumber} ${vertexNumber + 1}/${vertexNumber + 1} ${vertexNumber + 2}/${vertexNumber + 2}\n`
		vertexNumber += 3
	}
}
function addShape(shape, position, color, rotation) {
	addGeometry(shape.yNeg, position, color, rotation)
	addGeometry(shape.yPos, position, color, rotation)
	addGeometry(shape.xPos, position, color, rotation)
	addGeometry(shape.xNeg, position, color, rotation)
	addGeometry(shape.zPos, position, color, rotation)
	addGeometry(shape.zNeg, position, color, rotation)
}

class PackedVoxels {
	constructor(chunksX, chunksY, chunksZ, chunkSize) {
		if (Buffer.isBuffer(chunksX)) { // data is serialized in BlockStarPlanet's voxel format
			const chunkData = SmartBuffer.fromBuffer(chunksX)
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
			console.log('buffers', voxelBuffers.length / 4)

			const blockBounds = volumeChunks.map(value => value * chunkSize)
			for (let bufferIndex = 0; bufferIndex < voxelBuffers.length / 4; bufferIndex++) {
				const blocktypeBuffer = voxelBuffers[(bufferIndex * 4)]
				const rotationBuffer = voxelBuffers[(bufferIndex * 4) + 1]
				const shapeBuffer = voxelBuffers[(bufferIndex * 4) + 2]
				const rgbBuffer = voxelBuffers[(bufferIndex * 4) + 3]
				const currentSectionOffset = volumeChunksOffsets[bufferIndex]
				const blockOffset = currentSectionOffset.map(value => value * chunkSize)
				let currentOffset = 0
				for (let z = 0; z < chunkSize; z++) {
					for (let y = 0; y < chunkSize; y++) {
						for (let x = 0; x < chunkSize; x++) {
							const typeDatum = blocktypeBuffer.readUInt16BE((currentOffset * 2) + 4)
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
		} else { // not implemented
			throw "Not implemented :("
		}
	}
	setVolumes(chunkExtents, chunkSize) {
		const volumeSize = chunkExtents.map(chunkExtent => chunkExtent * chunkSize)
		const bufferLength = volumeSize[0] * volumeSize[1] * volumeSize[2]
		this.types = Buffer.alloc(bufferLength * 2)
		this.rotations = Buffer.alloc(bufferLength * 1)
		this.shapes = Buffer.alloc(bufferLength * 1)
		this.color = Buffer.alloc((bufferLength * 4) + 0)
		this.chunkExtents = chunkExtents
		this.chunkSize = chunkSize
		this.volumeSize = volumeSize
		console.log(volumeSize, bufferLength)
	}
	getIndex(position) {
		return position[0] + this.volumeSize[2] * (position[2] + this.volumeSize[0] * position[1])
	}
	getVoxel(index) {
		return [this.types.readUInt16BE(index * 2), this.color.readUInt32BE(index * 4), this.shapes.readUInt8(index), this.rotations.readUInt8(index)]
	}
	setVoxel(type, shape, color, rotation) { // 0-255, int32 (including redunant bits), byte (??). htye're just numbers okay?

	}
}


const fs = require("fs")
const file = "./moarrotations.arena"
const SmartBuffer = require("smart-buffer").SmartBuffer
let chunkData = null
const zlib = require("zlib")
{
	const arenaBuffer = zlib.inflateSync(fs.readFileSync(`${file}`))
	chunkData = zlib.inflateSync(arenaBuffer.subarray(6, arenaBuffer.length))
}

const packedVoxels = new PackedVoxels(chunkData)
function positionOffBounds(position) {
	return position.some((component, index) => component >= packedVoxels.volumeSize[index] || component < 0)
}
function applyRotation(position, rotation, origin = [0.5, 0.5, 0.5]) {
	let transformed = []
	rotateY(transformed, position, origin, rotation[1])
	rotateZ(transformed, transformed, origin, rotation[2])
	rotateX(transformed, transformed, origin, rotation[0])
	return transformed
}
function roundComponets(arr) {
	return arr.map(value => Math.round(value))
}
function getOpposingFace(shape, normal, rotation) {
	return blockFaces.find(blockFace => {
		// console.log({
		// 	faceNormal: shape[blockFace].faceNormal,
		// 	rotation: rotation,
		// 	normal: normal
		// })
		// console.log(applyRotation(shape[blockFace].faceNormal, rotation, [0, 0, 0]))
		// let transformed = applyRotation(shape[blockFace].faceNormal, rotation, [0, 0, 0]);
		// (transformed[0] == -normal[0] && transformed[1] == -normal[1] && transformed[2] == -normal[2])
		// !applyRotation(shape[blockFace].faceNormal, rotation, [0, 0, 0]).some((value, index) => value !== -normal[index])


		return applyRotation(shape[blockFace].faceNormal, rotation, [0, 0, 0]).map(value => Math.round(value)).some((value, index) => value !== 0 && normal[index] !== 0 && value == -normal[index])
	})
}
function getShapeGeometryFromId(shapeId) {
	if (shapeId == 1) return slopeShape
	return cubeShape
}
console.log(packedVoxels)
for (let z = 0; z < packedVoxels.volumeSize[2]; z++) {
	console.log(z)
	for (let y = 0; y < packedVoxels.volumeSize[1]; y++) {
		for (let x = 0; x < packedVoxels.volumeSize[0]; x++) {
			// console.log(x)
			const voxel = packedVoxels.getVoxel(packedVoxels.getIndex([x, y, z]))
			const type = voxel[0]
			if (!type) continue
			const colorBuffer = Buffer.alloc(4)
			colorBuffer.writeUInt32BE(voxel[1], 0)
			const rotation = getRotationVector(voxel[3])
			let shapeGeometry = getShapeGeometryFromId(voxel[2])
			blockFaces.forEach(blockFace => {
				let isBlocked = false
				blockFace = shapeGeometry[blockFace]
				if (blockFace.faceCovers) {
					let transformedNormal = []
					rotateY(transformedNormal, blockFace.faceNormal, [0, 0, 0], rotation[1])
					rotateZ(transformedNormal, transformedNormal, [0, 0, 0], rotation[2])
					rotateX(transformedNormal, transformedNormal, [0, 0, 0], rotation[0])
					transformedNormal = roundComponets(transformedNormal)
					// check if the face is occluded
					const checkPosition = [x, y, z].map((value, index) => Math.round(value + transformedNormal[index]))
					// console.log(checkPosition)
					if (!positionOffBounds(checkPosition)) {
						// if ((packedVoxels.getIndex(checkPosition) * 2) ==456784.0921533697) {
						// console.log({checkPosition});
						// console.log({transformedNormal})
						// console.log({rotation})
						// }
						const checkedVoxel = packedVoxels.getVoxel(packedVoxels.getIndex(checkPosition))
						const checkedType = checkedVoxel[0]
						if (checkedType) {
							const checkedShapeGeometry = getShapeGeometryFromId(checkedVoxel[2])
							const checkedRotation = getRotationVector(checkedVoxel[3])
							// let transformedCheckedNormal = []
							// rotateY(transformedCheckedNormal, checkedShapeGeometry[xNeg].faceNormal, [0.5, 0.5, 0.5], rotation[1])
							// rotateZ(transformedCheckedNormal, transformedCheckedNormal, [0.5, 0.5, 0.5], rotation[2])
							// rotateX(transformedCheckedNormal, transformedCheckedNormal, [0.5, 0.5, 0.5], rotation[0])
							const opposing = getOpposingFace(checkedShapeGeometry, transformedNormal, checkedRotation)
							// console.log(opposing)
							isBlocked = checkedShapeGeometry[opposing].faceCovers
							// if (isBlocked == true) console.log("Blocked")
						}
					}
				}
				if (!isBlocked) addGeometry(blockFace, [x, y, z], [1, 2, 3].map(offset => colorBuffer.readUInt8(offset)), rotation)
			})
		}
	}
}
console.log(packedVoxels)
console.log(output.length)
fs.writeFileSync("E:/aerna.obj", output)