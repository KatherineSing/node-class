const { expect } = require('chai');
const { assert } = require('chai');
const Track = require('./../../../models/track');

describe('track', () => {
	describe('milliseconds', () => {
	
		it('fails validation: should be numeric', async() => {
			try {
				let track = new Track({ milliseconds: 'a' });
				await track.validate();
			} catch(error) {
				expect(error.errors[0].message).to.equal('Milliseconds must be numeric');
			}
		});

		it('passes validation: is numeric', async() => {
			let track = new Track({ milliseconds: 100 });
			assert.isNumber(track.milliseconds);
		});
	});
});