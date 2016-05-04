var AppDispatcher = require('../dispatcher/AppDispatcher'),
    appConstants = require('../constants/appConstants'),
    objectAssign = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

/*
First: The actual “model” or data store. What’s great about Flux, is your “model”
is just a JavaScript data structure like an object or array. Everything else in
the Store will be built around manipulating or getting this data.
*/

var _store = {
  list: []
};

/*
Second: Setter methods. Remember, the whole point of Flux is to make your data
changes easy to reason about. These setter methods will be the only interface for
manipulating the data of our store (which we made in the first step above).
*/

var addItem = function(item) {
  _store.list.push(item);
};

var removeItem = function(index) {
  _store.list.splice(index, 1);
};

/*
Third: The Store itself, which is really just a collection of getter functions in
order to access the data in the first step along with a few emitter/change listener
helpers. Another idea of Flux that might throw you at first is Getters vs Setters.
Remember, we only want to be able to manipulate the data from our setter functions
(which we made in the second step above). However, we want to be able to GET the
data whenever we like through our Getter functions defined in this step. To
accomplish this, we’ll make the setter functions “private” to our Store file
while we’ll export the actual Store (this step, or the collection of Getter
methods) so that we can require the Store in other files and invoke those getter
methods in order to get the data. In other words, this step is going to be global,
while the other steps will be “private”.
*/

/*
We pass objectAssign a target, or an empty object first. This empty object is what
the next two parameters are going to add their properties to. We then pass it
EventEmitter.prototype. Now our empty object will get all of the properties that
are on the EventEmitter’s prototype object. This will give our store the ability
to do things like .on() and .emit(). The last argument is another object whose
properties will be added to the empty object. So when everything is complete, the
object being returned from objectAssign is an object which has all of properties
of EventEmitter’s prototype as well as adChangeListener, removeChangeListener, and
getList.
*/
var todoStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  getList: function() {
    return _store.list;
  },
});

/*
Fourth: We need to use our Dispatcher to listen for certain events and when we hear
those events, invoke the setter functions above (in the second step).
*/
AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case appConstants.ADD_ITEM:
      addItem(action.data);
      todoStore.emit(CHANGE_EVENT);
      break;
    case appConstants.REMOVE_ITEM:
      removeItem(action.data);
      todoStore.emit(CHANGE_EVENT);
      break;
    default:
      return true;
  }
});

module.exports = todoStore;
