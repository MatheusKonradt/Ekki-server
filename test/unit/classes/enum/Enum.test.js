const { expect } = require('chai');
const Enum = require('../../../../classes/enum/Enum');

describe('Enum', () => {
  describe('#enum', () => {
    it('Should initialize static enum properties', () => {
      /**
       * @property {Color} RED
       * @property {Color} BLUE
       * @property {Color} GREEN
       */
      class Color extends Enum {}
      Color.enum('RED', 'BLUE', 'GREEN');
      expect(Color.RED).to.be.instanceof(Color);
      expect(Color.BLUE).to.be.instanceof(Color);
      expect(Color.GREEN).to.be.instanceof(Color);
      expect(String(Color.RED)).to.be.equal('Color.RED');
      expect(String(Color.BLUE)).to.be.equal('Color.BLUE');
      expect(String(Color.GREEN)).to.be.equal('Color.GREEN');
    });
  });
});
