var React = require('react');

module.exports = React.createClass({
  render: function () {
    return (
        <div id="crayons">
          <h1>KRITA</h1>
          <ul id="sizes">
            <li className="size-5"><a href="#" data-size="5"></a></li>
            <li className="size-10"><a href="#" data-size="10"></a></li>
            <li className="size-15"><a href="#" data-size="15"></a></li>
            <li className="size-20"><a href="#" data-size="20"></a></li>
          </ul>
          <h1>FÄRG</h1>
          <ul id="colors">
            <li className="white"><a href="#" data-color="white"></a></li>
            <li className="black"><a href="#" data-color="black"></a></li>
            <li className="red"><a href="#" data-color="red"></a></li>
            <li className="orange"><a href="#" data-color="orange"></a></li>
            <li className="yellow"><a href="#" data-color="yellow"></a></li>
            <li className="yellowgreen"><a href="#" data-color="yellowgreen"></a></li>
            <li className="green"><a href="#" data-color="green"></a></li>
            <li className="lightskyblue"><a href="#" data-color="lightskyblue"></a></li>
            <li className="dodgerblue"><a href="#" data-color="dodgerblue"></a></li>
            <li className="violet"><a href="#" data-color="violet"></a></li>
            <li className="pink"><a href="#" data-color="pink"></a></li>
            <li className="burlywood"><a href="#" data-color="burlywood"></a></li>
            <li className="saddlebrown"><a href="#" data-color="saddlebrown"></a></li>
            <li className="brown"><a href="#" data-color="brown"></a></li>
          </ul>
        </div>
        );
  }
});
