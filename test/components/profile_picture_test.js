require('../testdom')('<html><body></body></html>');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var expect = require('chai').expect;

var ProfilePicture = require('../../src/components/profile_picture');

describe('<ProfilePicture />', function () {

  beforeEach(function () {
    this.user = { id: 1 };
    this.sut = TestUtils.renderIntoDocument(
        <ProfilePicture user={this.user} />
        );
    this.props = TestUtils.scryRenderedDOMComponentsWithTag(this.sut, 'img')[0].props;
  });

  it('should be a composite component', function () {
    expect(TestUtils.isCompositeComponent(this.sut)).to.be.true
  });

  it('should have id "profile-picture"', function () {
    expect(this.props.id).to.equal('profile-picture');
  });

  it('should have /nopic50.png as default src', function () {
    expect(this.props.src).to.equal('/nopic50.png');
  });

  it('should have src to Facebook if user have signed in with Facebook', function () {
    var user = { facebook: { id: 123 } };
    var sut = TestUtils.renderIntoDocument(
        <ProfilePicture user={user} size='large' />
        );
    var props = TestUtils.scryRenderedDOMComponentsWithTag(sut, 'img')[0].props;

    expect(props.src).to.equal('http://graph.facebook.com/v2.4/123/picture?type=large');
  });

  it('should have the alt "Profilbild"', function () {
    expect(this.props.alt).to.equal('Profilbild');
  });

  it('should have src to Facebook if user have signed in with Facebook', function () {
    var user = { facebook: { firstName: 'Christian', lastName: 'Nilsson' } };
    var sut = TestUtils.renderIntoDocument(
        <ProfilePicture user={user} size='large' />
        );
    var props = TestUtils.scryRenderedDOMComponentsWithTag(sut, 'img')[0].props;

    expect(props.alt).to.equal('Bild på Christian Nilsson');
  });

  it('should have className="small" as default', function () {
    expect(this.props.className).to.equal('small');
  });

  it('should have the image size as className', function () {
    var sut = TestUtils.renderIntoDocument(
        <ProfilePicture user={this.user} size='large' />
        );
    var props = TestUtils.scryRenderedDOMComponentsWithTag(sut, 'img')[0].props;

    expect(props.className).to.equal('large');
  });
});
