/* global librarySystem:false, tests:false, eq:false */
/*
basic usage

librarySystem('app', [], function(){
	return {
		firstName: 'Ivo',
		lastName: 'Vermeer'
	};
});

var app = librarySystem('app');
console.log('My name is ' + app.firstName + ' ' + app.lastName'); // My name is Ivo Vermeer
 */
tests({
	'It should be able to load and retrieve a library.': function () {
		librarySystem('app', [], function app () {
			return 'I am the app';
		});
		eq(librarySystem('app'), 'I am the app');
	},
	'It should be able to inject dependencies into the callback.': function () {
		librarySystem('router', [], function router () {
			return 'I am the router';
		});

		librarySystem('dependsOnRouter', ['router'], function dependsOnRouter (router) {
			return 'I have access to: \'' + router + '\'';
		});
		eq(librarySystem('dependsOnRouter'), 'I have access to: \'I am the router\'');
	},
	'It should be able to load libraries out of order.': function () {
		librarySystem('workBlurb', ['name', 'company'], function(name, company) {
			return name + ' works at ' + company;
		});

		librarySystem('name', [], function() {
			return 'Ivo';
		});

		librarySystem('company', [], function() {
			return 'Ardagh Group';
		});
		eq(librarySystem('workBlurb'), 'Ivo works at Ardagh Group');
	},
	'It should silently fail and return undefined if one or more dependencies are not met.': function () {
		librarySystem('main', ['dependencyOne', 'dependencyTwo'], function (dependencyOne, dependencyTwo) {
			return [dependencyOne, dependencyTwo];
		});

		librarySystem('dependencyTwo', [], function () {
			return 'I am the second dependency';
		});
		eq(librarySystem('main'), undefined);

		librarySystem('dependencyOne', [], function () {
			return 'I am the first dependency';
		});

		eq(librarySystem('main')[0], 'I am the first dependency');
		eq(librarySystem('main')[1], 'I am the second dependency');
	},
	'It should call the libraryName callback once and cache it for later use.': function () {
		var timesCallbackHasRun = 0;
		librarySystem('myCallbackShouldRunOnce', [], function () {
			timesCallbackHasRun++;
		});

		librarySystem('myCallbackShouldRunOnce');
		librarySystem('myCallbackShouldRunOnce');

		eq(timesCallbackHasRun, 1);
	},
	'It should also chache dependencies.': function () {
		var timesCallbackHasRun = 0;
		librarySystem('cat', [], function () {
			timesCallbackHasRun++;
			return 'meow';
		});

		librarySystem('petTheCat', ['cat'], function (cat) {
			return 'The cat says: ' + cat;
		});

		librarySystem('feedTheCat', ['cat'], function (cat) {
			return 'The cat eats and then says: ' + cat;
		});

		eq(librarySystem('petTheCat'), 'The cat says: meow');
		eq(librarySystem('feedTheCat'), 'The cat eats and then says: meow');
		eq(timesCallbackHasRun, 1);
	},
	'It should be able to restore the previous grobal variable.': function() {
		// preTests.js declares extra vairable:
		// var librarySystem = 'I am a different librarySystem';
		librarySystem('noConflict', [], function () {
			return 'I should be accessible using libraryLoaderSystem';
		});
		var libraryLoaderSystem = librarySystem.noConflict();
		eq(librarySystem, 'I am a different librarySystem');
		eq(libraryLoaderSystem('noConflict'), 'I should be accessible using libraryLoaderSystem');
		/*eslint-disable no-global-assign */
		librarySystem = libraryLoaderSystem;
		/*eslint-enable no-global-assign*/
	},
	'It should throw a ReferenceError if a library has already been registered.': function () {
		var errorWasThrown = false;
		try {
			librarySystem('noConflict', [], function () {
				return 'I should throw.';
			});
		}
		catch (e) {
			eq(Object.getPrototypeOf(e).name, 'ReferenceError');
			eq(e.message, 'Library noConflict has already been registered');
			errorWasThrown = true;
		}
		eq(errorWasThrown, true);
	}
});
