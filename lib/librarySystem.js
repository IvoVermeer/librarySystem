(function main() {
	'use strict';

	// Store the old global librarySystem variable
	var oldLibrarySystem = window.librarySystem;

	// Provide a storage object
	var libraryStorage = {};

	/*==================librarySystem==================*/
	function librarySystem (libraryName, dependencies, callback) {
		if ( arguments.length > 1 ) {
			storeLibrary(libraryName, dependencies, callback);
		} else {
			return loadLibrary(libraryName);
		}
	}

	// add a noCoflict() function
	librarySystem.noConflict = function noConflict () {
		window.librarySystem = oldLibrarySystem;
		return this;
		// return librarySystem;
	};

	/* === Expose the librarySystem function === */
	window['librarySystem'] = librarySystem;

	/* === helper functions === */
	function storeLibrary(libraryName, dependencies, callback) {
		// Check if the library already exists
		if (libraryName in libraryStorage) {
			throw new ReferenceError('Library ' + libraryName + ' has already been registered');
		}
		libraryStorage[libraryName] = {
			dependencies: dependencies,
			callback: callback
		};
	}

	function loadLibrary(libraryName) {
		var library = libraryStorage[libraryName];
		if ( 'cache' in library ) {
			return library.cache;
		}

		var dependencies = library.dependencies;
		if ( dependenciesAreLoaded(dependencies) ) {
			// var cache = libraryStorage[libraryName].callback.apply(null, loadDependencies(dependencies));
			library.cache = library.callback.apply(null, loadDependencies(dependencies));
			return library.cache;
		}
		
		/* helper functions */
		function dependenciesAreLoaded(dependencies) {
			for ( var i = 0 ; i < dependencies.length ; i++ ) {
				var libraryName = dependencies[i];
				if ( !(libraryStorage[libraryName]) ) {
					return false;
				}
			}
			return true;
		}

		function loadDependencies (dependencies) {
			var loadedDependencies = [];
			loadedDependencies = dependencies.map(function (libraryName) {
				if ( libraryStorage[libraryName] ) {
					var dependencies = libraryStorage[libraryName].dependencies;
					var callback = libraryStorage[libraryName].callback;
					return loadLibrary(libraryName, dependencies, callback);
				}
			});
			return loadedDependencies;
		}
	}

}()); 
