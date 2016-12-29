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
	'It should be able to load and retrieve a library': function () {
		librarySystem('app', [], function app () {
			return 'I am the app';
		});
		eq(librarySystem('app'), 'I am the app');
	},
	'It should be able to inject dependencies into the callback': function () {
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
	}
});
