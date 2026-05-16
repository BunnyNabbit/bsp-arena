// @ts-check
import { PackedVoxels } from "./class/PackedVoxels.mjs"
import { ModelBuilder } from "./class/ModelBuilder.mjs"
import fs from "node:fs"
import zlib from "node:zlib"

const file = "./example.arena"
let chunkData = null

{
	const arenaBuffer = zlib.inflateSync(fs.readFileSync(`${file}`))
	chunkData = zlib.inflateSync(arenaBuffer.subarray(6, arenaBuffer.length))
}

const modelBuilder = new ModelBuilder(new PackedVoxels(chunkData))
modelBuilder.build()
console.log("Output length:", modelBuilder.output.length)

fs.writeFileSync("./example.obj", modelBuilder.output)
