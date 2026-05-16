// @ts-check
import { PackedVoxels } from "./class/PackedVoxels.mjs"
import { ModelBuilder } from "./class/ModelBuilder.mjs"
import zlib from "node:zlib"
import { Command } from "commander"
import fs from "fs/promises"
const program = new Command()

program
	.name("bsp-arena")
	.description("Converts a BlockStarPlanet .arena to a Wavefront .OBJ.")
	.version("0.0.0")
	.argument("<file>", "Path to the .arena file.")
	.option("-o, --output <file>", "Output file. (default: stdout)")
	.action(async (file, options) => {
		try {
			let chunkData = null
			{
				const arenaBuffer = zlib.inflateSync(await fs.readFile(file))
				chunkData = zlib.inflateSync(arenaBuffer.subarray(6, arenaBuffer.length))
			}
			const modelBuilder = new ModelBuilder(new PackedVoxels(chunkData))
			modelBuilder.build()
			if (options.output) {
				await fs.writeFile(options.output, modelBuilder.output)
				console.log(`Model written to ${options.output}`)
			} else {
				console.log(modelBuilder.output)
			}
		} catch (error) {
			console.error(error)
			process.exit(1)
		}
	})

program.parse()
