var React = require('react');
var Layout = require('./layout');

module.exports = React.createClass({
  componentWillMount: function () {
    console.log(this.props.user);
  },

  render: function () {
    var permissionIcon = <i className="fa fa-check-circle-o"></i>;
    var permissionLink = <a href="#">Ta bort behörighet</a>;
    if (this.props.user.facebook.permissions.userFriends) {
      userFriendsGranted = <i className="fa fa-times-circle-o"></i>;
      permissionLink = <a href="#">Uppdatera behörighet</a>;
    }

    return (
        <Layout {...this.props}>
          <h1>Inställningar</h1>
          <p>Berätta vad som är skillnaden mellan de olika topplistorna, och berätta även att om användaren väljer att synas i topplistan över alla spelare kan hens profilbild och namn (men inte om användaren har valt att bilden inte ska synas ovan) komma att visas för alla användare, även de som inte är inloggade.</p>
          <p>Berätta var profilbilden syns och varför!</p>

          <h2>Profilbild</h2>
          <p>
            <ul>
              <li>
                <input type="radio" id="settings-show-profilepicture" />
                <label htmlFor="settings-show-profilepicture">
                  Jag vill att min profilbild ska synas för andra användare
                </label>
              </li>
              <li>
                <input type="radio" id="settings-hide-profilepicture" />
                <label htmlFor="settings-hide-profilepicture">
                  Jag vill inte att min profilbild ska synas för andra användare
                </label>
              </li>
            </ul>
          </p>

          <h2>Highscore</h2>
          <p>
            <ul>
              <li>
                <input type="checkbox" id="settings-highscore-all" />
                <label htmlFor="settings-highscore-all">
                  Jag vill synas i topplistan över alla spelare
                </label>
              </li>
              <li>
                <input type="checkbox" id="settings-highscore-friends" />
                <label htmlFor="settings-highscore-all">
                  Jag vill synas i topplistan över mina vänner
                </label>
              </li>
            </ul>
          </p>

          <div id="permissions">
            <h2>Facebook</h2>
            <p>När du loggar in på skissaochgissa.se får vi viss information från Facebook. Denna informationen använder vi för att göra din upplevelse så bra som möjligt.</p>

            <div className="permission">
              <i className="fa fa-check-circle-o"></i>
              <div>
                <h3>Publik användarprofil (obligatorisk)</h3>
                <p>Denna information skickar Facebook alltid när du loggar in på skissaochgissa.se och är inget du kan välja bort. Vi spara och använder bara den information som du kan se på skissaochgissa.se (ditt namn och din profilbild).</p>
              </div>
            </div>

            <div className="permission">
              {permissionIcon}
              <div>
                <h3>Dina vänner (frivillig)</h3>
                <p>När du ger oss tillätelse att se dina vänner kan vi bara se de av dina vänner som också använder skissaochgissa.se. Vi använder denna informationen för att visa i vilka spel dina vänner spelar och vi skapar även en unik highscore för dina vänner där du kan se hur bra det går för dig jämfört med dem. {permissionLink}.</p>
              </div>
            </div>
            <div id="revoce-authorization">
              Avsluta medlemskap och ta bort kopplingen med Facebook
              <div className="confirm">
                <input type="checkbox" id="confirm-revoce" /> 
                <label htmlFor="confirm-revoce">Jag förstår mina resultat kommer tas bort permanent</label>
              </div>
            </div>
          </div>
        </Layout>
        );
  }
});
