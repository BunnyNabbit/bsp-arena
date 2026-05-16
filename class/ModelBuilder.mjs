// @ts-check
import { cubeShape, slopeShape } from "../data/geometry.mjs"
/** @import {PackedVoxels} from "./class/PackedVoxels.mjs" */
function readRotationX(byte) {
	return (byte << 26) >>> 30
}
function readRotationY(byte) {
	return (byte << 28) >>> 30
}
function readRotationZ(byte) {
	return (byte << 30) >>> 30
}
const blockFaces = ["xNeg", "xPos", "yNeg", "yPos", "zNeg", "zPos"]

const degreeToRadianConstant = 1.5708
/** @param {number} byte */
function getRotationVector(byte) {
	// typically, developers want to do sensible stuff, but other factors (internal or external) may screw that up and implement stuff that will be received poorly.
	switch (byte) {
		case 17:
			return [1, 1, 0].map((value) => value * radianIncrement)
		case 18:
			return [1, 2, 0].map((value) => value * radianIncrement)
		case 19:
			return [1, 3, 0].map((value) => value * radianIncrement)
		case 25:
			return [3, 1, 0].map((value) => value * radianIncrement)
		case 24:
			return [1, 0, 2].map((value) => value * radianIncrement)
		case 27:
			return [3, 3, 0].map((value) => value * radianIncrement)
		case 31:
			return [2, 1, 2].map((value) => value * radianIncrement)
		default:
			return [readRotationX(byte) * degreeToRadianConstant, readRotationY(byte) * degreeToRadianConstant, readRotationZ(byte) * degreeToRadianConstant]
	}
}
/**Rotate a 3D vector around the z-axis.
 *
 * @license {@link https://github.com/visgl/math.gl/blob/master/LICENSE|MIT}
 * @param {any[]} out The receiving vec3
 * @param {any[]} a The vec3 point to rotate
 * @param {number[]} b The origin of the rotation
 * @param {number} rad The angle of rotation in radians
 */
function rotateX(out, a, b, rad) {
	const p = []
	const r = []
	// Translate point to the origin
	p[0] = a[0] - b[0]
	p[1] = a[1] - b[1]
	p[2] = a[2] - b[2]
	// perform rotation
	r[0] = p[0]
	r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad)
	r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad)
	// translate to correct position
	out[0] = r[0] + b[0]
	out[1] = r[1] + b[1]
	out[2] = r[2] + b[2]
	return out
}
/**Rotate a 3D vector around the z-axis
 *
 * @license {@link https://github.com/visgl/math.gl/blob/master/LICENSE|MIT}
 * @param {any[]} out The receiving vec3
 * @param {number[]} a The vec3 point to rotate
 * @param {number[]} b The origin of the rotation
 * @param {number} rad The angle of rotation in radians
 */
function rotateY(out, a, b, rad) {
	const p = []
	const r = []
	// Translate point to the origin
	p[0] = a[0] - b[0]
	p[1] = a[1] - b[1]
	p[2] = a[2] - b[2]
	// perform rotation
	r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad)
	r[1] = p[1]
	r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad)
	// translate to correct position
	out[0] = r[0] + b[0]
	out[1] = r[1] + b[1]
	out[2] = r[2] + b[2]
	return out
}
/**Rotate a 3D vector around the z-axis
 *
 * @license {@link https://github.com/visgl/math.gl/blob/master/LICENSE|MIT}
 * @param {any[]} out The receiving vec3
 * @param {any[]} a The vec3 point to rotate
 * @param {number[]} b The origin of the rotation
 * @param {number} rad The angle of rotation in radians
 */
function rotateZ(out, a, b, rad) {
	const p = []
	const r = []
	// Translate point to the origin
	p[0] = a[0] - b[0]
	p[1] = a[1] - b[1]
	p[2] = a[2] - b[2]
	// perform rotation
	r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad)
	r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad)
	r[2] = p[2]
	// translate to correct position
	out[0] = r[0] + b[0]
	out[1] = r[1] + b[1]
	out[2] = r[2] + b[2]
	return out
}
/**@param {{ yNeg: any; yPos: any; xPos: any; xNeg: any; zPos: any; zNeg: any }} shape
 * @param {any} position
 * @param {number[] | undefined} color
 * @param {number[] | undefined} rotation
 */
function addShape(shape, position, color, rotation) {
	addGeometry(shape.yNeg, position, color, rotation)
	addGeometry(shape.yPos, position, color, rotation)
	addGeometry(shape.xPos, position, color, rotation)
	addGeometry(shape.xNeg, position, color, rotation)
	addGeometry(shape.zPos, position, color, rotation)
	addGeometry(shape.zNeg, position, color, rotation)
}

/**@param {any} position
 * @param {any[]} rotation
 */
function applyRotation(position, rotation, origin = [0.5, 0.5, 0.5]) {
	/** @type {never[]} */
	let transformed = []
	rotateY(transformed, position, origin, rotation[1])
	rotateZ(transformed, transformed, origin, rotation[2])
	rotateX(transformed, transformed, origin, rotation[0])
	return transformed
}
/** @param {any[]} arr */
function roundComponents(arr) {
	return arr.map((/** @type {number} */ value) => Math.round(value))
}
/**@param {{
 * 	[x: string]: { faceNormal: any }
 * 	yNeg?: { geometry: any[][]; faceNormal: number[]; faceCovers: boolean }
 * 	yPos?: {
 * 		// Top face
 * 		geometry: number[][][]
 * 		faceNormal: number[]
 * 		faceCovers: boolean
 * 	}
 * 	zNeg?: {
 * 		// front face
 * 		geometry: any[][]
 * 		faceNormal: number[]
 * 		faceCovers: boolean
 * 	}
 * 	zPos?: {
 * 		// back face
 * 		geometry: any[][]
 * 		faceNormal: number[]
 * 		faceCovers: boolean
 * 	}
 * 	xNeg?: {
 * 		// left face
 * 		geometry: any[][]
 * 		faceNormal: number[]
 * 		faceCovers: boolean
 * 	}
 * 	xPos?: {
 * 		// right face
 * 		geometry: any[][]
 * 		faceNormal: number[]
 * 		faceCovers: boolean
 * 	}
 * }} shape
 * @param {number[]} normal
 * @param {any} rotation
 */
function getOpposingFace(shape, normal, rotation) {
	return blockFaces.find((blockFace) => {
		return applyRotation(shape[blockFace].faceNormal, rotation, [0, 0, 0])
			.map((value) => Math.round(value))
			.some((value, index) => value !== 0 && normal[index] !== 0 && value == -normal[index])
	})
}
/** @param {number} shapeId */
function getShapeGeometryFromId(shapeId) {
	if (shapeId == 1) return slopeShape
	return cubeShape
}

// @ts-check
export class ModelBuilder {
	/**/
	/** @param {PackedVoxels} packedVoxels */
	constructor(packedVoxels) {
		this.packedVoxels = packedVoxels
		this.output = "# Generated with BunnyNabbit's BlockStarPlanet .arena to .obj converter https://ko-fi.com/bunnynabbit\n"
		this.vertexNumber = 1
	}

	build() {
		for (let z = 0; z < this.packedVoxels.volumeSize[2]; z++) {
			console.log(z)
			for (let y = 0; y < this.packedVoxels.volumeSize[1]; y++) {
				for (let x = 0; x < packedVoxels.volumeSize[0]; x++) {
					// console.log(x)
					const voxel = this.packedVoxels.getVoxel(this.packedVoxels.getIndex([x, y, z]))
					const type = voxel[0]
					if (!type) continue
					const colorBuffer = Buffer.alloc(4)
					colorBuffer.writeUInt32BE(voxel[1], 0)
					const rotation = getRotationVector(voxel[3])
					let shapeGeometry = getShapeGeometryFromId(voxel[2])
					blockFaces.forEach((blockFace) => {
						let isBlocked = false
						blockFace = shapeGeometry[blockFace]
						if (blockFace.faceCovers) {
							/** @type {number[]} */
							let transformedNormal = []
							rotateY(transformedNormal, blockFace.faceNormal, [0, 0, 0], rotation[1])
							rotateZ(transformedNormal, transformedNormal, [0, 0, 0], rotation[2])
							rotateX(transformedNormal, transformedNormal, [0, 0, 0], rotation[0])
							transformedNormal = roundComponents(transformedNormal)
							// check if the face is occluded
							const checkPosition = [x, y, z].map((value, index) => Math.round(value + transformedNormal[index]))
							if (!this.#positionOffBounds(checkPosition)) {
								const checkedVoxel = this.packedVoxels.getVoxel(this.packedVoxels.getIndex(checkPosition))
								const checkedType = checkedVoxel[0]
								if (checkedType) {
									const checkedShapeGeometry = getShapeGeometryFromId(checkedVoxel[2])
									const checkedRotation = getRotationVector(checkedVoxel[3])
									const opposing = getOpposingFace(checkedShapeGeometry, transformedNormal, checkedRotation)
									isBlocked = checkedShapeGeometry[opposing].faceCovers
								}
							}
						}
						if (!isBlocked)
							addGeometry(
								blockFace,
								[x, y, z],
								[1, 2, 3].map((offset) => colorBuffer.readUInt8(offset)),
								rotation
							)
					})
				}
			}
		}
	}

	/** @param {any[]} position */
	#positionOffBounds(position) {
		return position.some((/** @type {number} */ component, /** @type {string | number} */ index) => component >= packedVoxels.volumeSize[index] || component < 0)
	}

	/**@param {string} face
	 * @param {any[]} offset
	 */
	addGeometry(face, offset, color = [255, 0, 0], rotation = [0, 0, 0]) {
		for (let i = 0; i < face.geometry.length / 3; i++) {
			const vertexOffset = i * 3
			const vert1 = face.geometry[vertexOffset]
			const vert2 = face.geometry[vertexOffset + 1]
			const vert3 = face.geometry[vertexOffset + 2]
			;[vert1, vert2, vert3].forEach((vert) => {
				/** @type {any[]} */
				let transformedVert = []
				rotateY(transformedVert, vert[0], [0.5, 0.5, 0.5], rotation[1])
				rotateZ(transformedVert, transformedVert, [0.5, 0.5, 0.5], rotation[2])
				rotateX(transformedVert, transformedVert, [0.5, 0.5, 0.5], rotation[0])
				this.output += `v ${transformedVert.map((vertPos, vertIndex) => vertPos + offset[vertIndex]).join(" ")} ${color[0] / 255} ${color[1] / 255} ${color[2] / 255}\n`
				this.output += `vt ${vert[1].join(" ")}\n`
			})
			this.output += `f ${this.vertexNumber}/${this.vertexNumber} ${this.vertexNumber + 1}/${this.vertexNumber + 1} ${this.vertexNumber + 2}/${this.vertexNumber + 2}\n`
			this.vertexNumber += 3
		}
	}
}
