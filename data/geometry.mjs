/**@todo Rename this function or remove it.
 *
 * @param {number[]} arr
 */
function fLEEP(arr) {
	if (arr[0]) {
		arr[0] = 0
	} else {
		arr[0] = 1
	}
	return arr
}
// faceCovers means if the surface covers the whole area. currently, only full faces are considered when detecting occluded geometry
// given face names are not accurate to any coordinate system involved.
export const cubeShape = {
	// bottom face
	yNeg: {
		geometry: [
			[[0, 0, 1], fLEEP([0, 0])],
			[[0, 0, 0], fLEEP([1, 0])],
			[[1, 0, 0], fLEEP([1, 1])],

			[[1, 0, 1], fLEEP([0, 1])],
			[[0, 0, 1], fLEEP([0, 0])],
			[[1, 0, 0], fLEEP([1, 1])],
		],
		faceNormal: [0, -1, 0],
		faceCovers: true,
	},
	yPos: {
		// Top face
		geometry: [
			[
				[1, 1, 0],
				[0, 0],
			],
			[
				[0, 1, 0],
				[0, 1],
			],
			[
				[0, 1, 1],
				[1, 1],
			],

			[
				[1, 1, 1],
				[1, 0],
			],
			[
				[1, 1, 0],
				[0, 0],
			],
			[
				[0, 1, 1],
				[1, 1],
			],
		],
		faceNormal: [0, 1, 0],
		faceCovers: true,
	},
	zNeg: {
		// front face
		geometry: [
			[[1, 0, 0], fLEEP([0, 0])],
			[[0, 0, 0], fLEEP([1, 0])],
			[[0, 1, 0], fLEEP([1, 1])],

			[[1, 1, 0], fLEEP([0, 1])],
			[[1, 0, 0], fLEEP([0, 0])],
			[[0, 1, 0], fLEEP([1, 1])],
		],
		faceNormal: [0, 0, -1],
		faceCovers: true,
	},

	zPos: {
		// back face
		geometry: [
			[[0, 0, 1], fLEEP([0, 0])],
			[[1, 0, 1], fLEEP([1, 0])],
			[[1, 1, 1], fLEEP([1, 1])],

			[[0, 1, 1], fLEEP([0, 1])],
			[[0, 0, 1], fLEEP([0, 0])],
			[[1, 1, 1], fLEEP([1, 1])],
		],
		faceNormal: [0, 0, 1],
		faceCovers: true,
	},
	xNeg: {
		// left face
		geometry: [
			[[0, 0, 0], fLEEP([0, 0])],
			[[0, 0, 1], fLEEP([1, 0])],
			[[0, 1, 1], fLEEP([1, 1])],

			[[0, 1, 0], fLEEP([0, 1])],
			[[0, 0, 0], fLEEP([0, 0])],
			[[0, 1, 1], fLEEP([1, 1])],
		],
		faceNormal: [-1, 0, 0],
		faceCovers: true,
	},
	xPos: {
		// right face
		geometry: [
			[[1, 0, 1], fLEEP([0, 0])],
			[[1, 0, 0], fLEEP([1, 0])],
			[[1, 1, 0], fLEEP([1, 1])],

			[[1, 1, 1], fLEEP([0, 1])],
			[[1, 0, 1], fLEEP([0, 0])],
			[[1, 1, 0], fLEEP([1, 1])],
		],
		faceNormal: [1, 0, 0],
		faceCovers: true,
	},
}
export const slopeShape = {
	// bottom face
	yNeg: {
		geometry: [
			[[0, 0, 1], fLEEP([0, 0])],
			[[0, 0, 0], fLEEP([1, 0])],
			[[1, 0, 0], fLEEP([1, 1])],

			[[1, 0, 1], fLEEP([0, 1])],
			[[0, 0, 1], fLEEP([0, 0])],
			[[1, 0, 0], fLEEP([1, 1])],
		],
		faceNormal: [0, -1, 0],
		faceCovers: true,
	},
	yPos: {
		// Top face
		geometry: [
			[
				[1, 1, 0],
				[0, 0],
			],
			[
				[0, 1, 0],
				[0, 1],
			],
			[
				[0, 0, 1],
				[1, 1],
			],

			[
				[1, 0, 1],
				[1, 0],
			],
			[
				[1, 1, 0],
				[0, 0],
			],
			[
				[0, 0, 1],
				[1, 1],
			],
		],
		faceNormal: [0, 1, 0],
		faceCovers: false,
	},
	zNeg: {
		// front face ( ia)
		geometry: [
			[[1, 0, 0], fLEEP([0, 0])],
			[[0, 0, 0], fLEEP([1, 0])],
			[[0, 1, 0], fLEEP([1, 1])],

			[[1, 1, 0], fLEEP([0, 1])],
			[[1, 0, 0], fLEEP([0, 0])],
			[[0, 1, 0], fLEEP([1, 1])],
		],
		faceNormal: [0, 0, -1],
		faceCovers: true,
	},

	zPos: {
		// back face
		geometry: [],
		faceNormal: [0, 0, 1],
		faceCovers: false,
	},
	xNeg: {
		// left face.
		geometry: [
			[
				[0, 0, 0],
				[1, 0],
			],
			[
				[0, 0, 1],
				[0, 0],
			],
			[
				[0, 1, 0],
				[1, 1],
			],
		],
		faceNormal: [-1, 0, 0],
		faceCovers: false,
	},
	xPos: {
		// right face. intentionally broken to match BSP's texturing
		geometry: [
			[
				[1, 0, 1],
				[1, 1],
			],
			[
				[1, 0, 0],
				[0, 0],
			],
			[
				[1, 1, 0],
				[0, 1],
			],
		],
		faceNormal: [1, 0, 0],
		faceCovers: false,
	},
}