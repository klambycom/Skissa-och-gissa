require('../testdom')('<html><body></body></html>');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var ProfilePicture = require('../../src/components/profile_picture');

describe('<ProfilePicture />', function () {

  beforeEach(function () {
    this.user = { id: 1 };
    this.sut = TestUtils.renderIntoDocument(
        <ProfilePicture user={this.user} />
        );
  });

  it('should be a composite component', function () {
    expect(TestUtils.isCompositeComponent(this.sut)).toBe(true);
  });

  //it('should have id "fdasds"', function () {
  //  var profile_picture = TestUtils.scryRenderedDOMComponentsWithTag(this.sut, 'a');
  //  console.log(profile_picture);
  //});
});
