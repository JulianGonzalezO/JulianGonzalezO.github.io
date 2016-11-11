"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('kanban/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'kanban/config/environment'], function (exports, _ember, _emberResolver, _emberLoadInitializers, _kanbanConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _kanbanConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _kanbanConfigEnvironment['default'].podModulePrefix,
    Resolver: _emberResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _kanbanConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('kanban/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'kanban/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _kanbanConfigEnvironment) {

  var name = _kanbanConfigEnvironment['default'].APP.name;
  var version = _kanbanConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('kanban/components/list-component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({

    actions: {
      onOpenTaskCreationModal: function onOpenTaskCreationModal() {
        this.sendAction('onOpenTaskCreationModal', this.get('list').id);
      },
      onDeleteTask: function onDeleteTask(taskId) {
        this.sendAction('onDeleteTask', this.get('list').id, taskId);
      }
    }
  });
});
define('kanban/components/task-component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    actions: {
      onDeleteTask: function onDeleteTask() {
        this.sendAction('onDeleteTask', this.get('task').id);
      }
    }
  });
});
define('kanban/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('kanban/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('kanban/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'kanban/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _kanbanConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_kanbanConfigEnvironment['default'].APP.name, _kanbanConfigEnvironment['default'].APP.version)
  };
});
define('kanban/initializers/export-application-global', ['exports', 'ember', 'kanban/config/environment'], function (exports, _ember, _kanbanConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_kanbanConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _kanbanConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_kanbanConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('kanban/router', ['exports', 'ember', 'kanban/config/environment'], function (exports, _ember, _kanbanConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _kanbanConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('board', {
      'path': '/'
    });
  });

  exports['default'] = Router;
});
define('kanban/routes/board', ['exports', 'ember'], function (exports, _ember) {

  /**
  * TODO traer las listas del API
  */

  exports['default'] = _ember['default'].Route.extend({

    lists: [{
      id: 1,
      title: 'Problems',
      tasks: [{ id: 202002, text: 'Text 1' }, { id: 202003, text: 'Text 2' }, { id: 202004, text: 'Text 3' }]
    }, {
      id: 2,
      title: 'Reproduced',
      tasks: [{ id: 203002, text: 'Text 4' }, { id: 203003, text: 'Text 5' }]
    }, {
      id: 3,
      title: 'Identified',
      tasks: [{ id: 204002, text: 'Text 6' }, { id: 204003, text: 'Text 7' }]
    }],

    taskCreationModalIsOpen: false,
    actualList: null,
    newTaskText: '',

    model: function model() {
      return {
        lists: this.get('lists'),
        taskCreationModalIsOpen: this.get('taskCreationModalIsOpen'),
        newTaskText: this.get('newTaskText')
      };
    },

    actions: {

      /**
      * @param {Int} listId
      */
      onOpenTaskCreationModal: function onOpenTaskCreationModal(listId) {
        this.set('taskCreationModalIsOpen', true);
        this.set('actualList', listId);
        this.refresh();
      },

      onCloseTaskCreationModal: function onCloseTaskCreationModal() {
        this.set('taskCreationModalIsOpen', false);
        this.set('actualList', null);
        this.refresh();
      },

      onAddTask: function onAddTask() {
        var _this = this;

        var newTaskText = document.getElementById('newTaskText').value;
        var newTask = {
          id: Math.random(),
          text: newTaskText
        };
        var newLists = this.get('lists').map(function (list) {
          if (list.id === _this.get('actualList')) {
            list.tasks.addObject(newTask);
          }
          return list;
        });
        this.set('lists', newLists);
        this.send('onCloseTaskCreationModal');
        this.refresh();
      },
      onDeleteTask: function onDeleteTask(listId, taskId) {
        var newLists = this.get('lists').map(function (list) {
          if (list.id === listId) {
            var objectToRemove = list.tasks.findBy('id', taskId);
            list.tasks.removeObject(objectToRemove);
          }
          return list;
        });
        this.set('lists', newLists);
        this.refresh();
      },
      onNewList: function onNewList() {
        var newList = {
          id: Math.random(),
          title: 'Nueva Lista',
          tasks: []
        };
        var newLists = this.get('lists').addObject(newList);
        this.set('lists', newLists);
        this.refresh();
      }
    }

  });
});
define("kanban/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@1.13.12",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "kanban/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [1, 0], [1, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("kanban/templates/board", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.12",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 8,
              "column": 2
            }
          },
          "moduleName": "kanban/templates/board.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "list-component", [], ["list", ["subexpr", "@mut", [["get", "list", ["loc", [null, [4, 11], [4, 15]]]]], [], []], "onOpenTaskCreationModal", "onOpenTaskCreationModal", "onDeleteTask", "onDeleteTask"], ["loc", [null, [3, 4], [7, 6]]]]],
        locals: ["list"],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.12",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 0
            },
            "end": {
              "line": 31,
              "column": 0
            }
          },
          "moduleName": "kanban/templates/board.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "translucentDiv");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "taskCreationModal");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "header");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4, "class", "text");
          var el5 = dom.createTextNode("\n          Crear nueva tarea\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4, "class", "close");
          var el5 = dom.createTextNode("\n          X\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "content");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("textarea");
          dom.setAttribute(el4, "id", "newTaskText");
          dom.setAttribute(el4, "autofocus", "");
          dom.setAttribute(el4, "placeholder", "Agrega el texto de tu tarea");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          var el4 = dom.createTextNode("\n        Agregar tarea\n      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var element1 = dom.childAt(element0, [1, 3]);
          var element2 = dom.childAt(element0, [5]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element1);
          morphs[1] = dom.createElementMorph(element2);
          return morphs;
        },
        statements: [["element", "action", ["onCloseTaskCreationModal"], [], ["loc", [null, [19, 27], [19, 64]]]], ["element", "action", ["onAddTask"], [], ["loc", [null, [26, 14], [26, 36]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.12",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 32,
            "column": 0
          }
        },
        "moduleName": "kanban/templates/board.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "lists-container");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "class", "newListButton");
        var el3 = dom.createTextNode("Nueva Lista\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element3 = dom.childAt(fragment, [0]);
        var element4 = dom.childAt(element3, [3]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element3, 1, 1);
        morphs[1] = dom.createElementMorph(element4);
        morphs[2] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "each", [["get", "model.lists", ["loc", [null, [2, 10], [2, 21]]]]], [], 0, null, ["loc", [null, [2, 2], [8, 11]]]], ["element", "action", ["onNewList"], [], ["loc", [null, [9, 32], [9, 54]]]], ["block", "if", [["get", "model.taskCreationModalIsOpen", ["loc", [null, [12, 6], [12, 35]]]]], [], 1, null, ["loc", [null, [12, 0], [31, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("kanban/templates/components/list-component", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.12",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 4
            },
            "end": {
              "line": 16,
              "column": 4
            }
          },
          "moduleName": "kanban/templates/components/list-component.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "task-component", [], ["task", ["subexpr", "@mut", [["get", "task", ["loc", [null, [13, 13], [13, 17]]]]], [], []], "onDeleteTask", "onDeleteTask"], ["loc", [null, [12, 6], [15, 8]]]]],
        locals: ["task"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.12",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "kanban/templates/components/list-component.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "list");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "title-text");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "add-task-button");
        var el4 = dom.createTextNode("\n      +\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "task-container");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var morphs = new Array(4);
        morphs[0] = dom.createAttrMorph(element1, 'id');
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]), 1, 1);
        morphs[2] = dom.createElementMorph(element2);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
        return morphs;
      },
      statements: [["attribute", "id", ["get", "list.id", ["loc", [null, [2, 27], [2, 34]]]]], ["content", "list.title", ["loc", [null, [4, 6], [4, 20]]]], ["element", "action", ["onOpenTaskCreationModal"], [], ["loc", [null, [6, 33], [6, 69]]]], ["block", "each", [["get", "list.tasks", ["loc", [null, [11, 12], [11, 22]]]]], [], 0, null, ["loc", [null, [11, 4], [16, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("kanban/templates/components/task-component", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@1.13.12",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "kanban/templates/components/task-component.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "task");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("strong");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "delete");
        var el3 = dom.createTextNode("\n    X\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[1] = dom.createElementMorph(element1);
        return morphs;
      },
      statements: [["content", "task.text", ["loc", [null, [3, 4], [3, 17]]]], ["element", "action", ["onDeleteTask"], [], ["loc", [null, [5, 22], [5, 47]]]]],
      locals: [],
      templates: []
    };
  })());
});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('kanban/config/environment', ['ember'], function(Ember) {
  var prefix = 'kanban';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (!runningTests) {
  require("kanban/app")["default"].create({"name":"kanban","version":"0.0.0+41f435bb"});
}

/* jshint ignore:end */
//# sourceMappingURL=kanban.map