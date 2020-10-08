import {assert} from './test-util-core.mjs'
import {getFile} from './test-util-core.mjs'
import * as exifr from '../src/bundles/full.mjs'
import {testSegment, testMergeSegment, testImage, testImageFull} from './test-util-suites.mjs'


describe('PNG File format', () => {


	describe(`IHDR segment`, () => {

		it(`IHDR should be parsed with default options`, async () => {
			let options = undefined
			let input = await getFile('png/IMG_20180725_163423-1.png')
			let output = await exifr.parse(input, options)
			assert.equal(output.ImageWidth, 40)
			assert.equal(output.BitDepth, 8)
		})

		it(`handles broken file (invalid crc) without crashing`, async () => {
			let options = undefined
			let input = await getFile('png/invalid-iCCP-missing-adler32-checksum.png')
			let output = await exifr.parse(input, options)
			assert.equal(output.ImageWidth, 460)
		})

	})

	describe('IHDR Segment', () => {

		describe('options.ihdr enable/disable', () => {
			testSegment({
				key: 'ihdr',
				fileWith: 'png/IMG_20180725_163423-1.png',
				definedByDefault: true,
			})
		})

		testMergeSegment({
			key: 'ihdr',
			file: 'png/IMG_20180725_163423-1.png',
			properties: ['ImageWidth', 'BitDepth', 'Interlace']
		})

		describe(`routine 'correctly parses all data' tests`, () => {

			testImage('ihdr', 'png/IMG_20180725_163423-1.png', {
				ImageWidth: 40,
				ImageHeight: 30,
				BitDepth: 8,
				//Interlace: 'Noninterlaced', // warning: translated value
			})

			testImageFull('png/IMG_20180725_163423-1.png', {
				ImageWidth: 40,
				ImageHeight: 30,
				BitDepth: 8,
				Filter: 'Adaptive', // warning: translated value
				Interlace: 'Noninterlaced', // warning: translated value
				// text name of ICCP chunk
				ProfileName: 'Photoshop ICC profile',
				// XMP
				CreatorTool:	'HDR+ 1.0.199571065z',
				// ICC
				//ProfileFileSignature: 'acsp',
				//ViewingCondIlluminantType: 'D50',
			})

			testImageFull('png/IMG_20180725_163423-2.png', {
				ImageWidth: 40,
				ImageHeight: 30,
				BitDepth: 8,
				// text chunk
				Software: 'Adobe ImageReady',
				// text name of ICCP chunk
				ProfileName: 'ICC profile',
				//ProfileName: 'ICC profile',
				// XMP
				CreatorTool: 'HDR+ 1.0.199571065z',
				format: 'image/png', // WARNING: yes, the key in XMP is lowercase
				// ICC
				//ProfileFileSignature: 'acsp',
				//DeviceManufacturer: 'Google',
				//ProfileConnectionSpace: 'XYZ',
			})

		})

	})

})