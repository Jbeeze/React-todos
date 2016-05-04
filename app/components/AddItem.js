var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var AddItem = React.createClass({
  handleSubmit: function(e) {
    var $input = $('input');
    if(e.keyCode === 13) {
      var newItem = $input.val();
      $input.val('');
      this.props.add(newItem);
    }
  },

  render: function() {
    return (
      <div>
        <input type='text' className='form-control' placeholder='New Item' onKeyDown={this.handleSubmit} />
      </div>
    )
  }
});

module.exports = AddItem;
