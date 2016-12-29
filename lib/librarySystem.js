(function () {
	'use strict';
	
	var libraryStorage = {};

	/*==================librarySystem==================*/
	function librarySystem (libraryName, dependencies, callback) {
		if ( arguments.length > 1 ) {
			storeLibrary(libraryName, dependencies, callback);
		} else {
			return loadLibrary(libraryName);
		}
	}

	/* === Expose the librarySystem function === */
	window['librarySystem'] = librarySystem;

	/* === helper functions === */
	function storeLibrary(libraryName, dependencies, callback) {
		libraryStorage[libraryName] = {
			dependencies: dependencies,
			callback: callback
		};
	}

	function loadLibrary(libraryName) {
		if ( libraryStorage[libraryName].cache !== undefined ) {
			return libraryStorage[libraryName].cache;
		}

		var dependencies = libraryStorage[libraryName].dependencies;
		if ( dependenciesAreLoaded(dependencies) ) {
			var cache = libraryStorage[libraryName].callback.apply(null, loadDependencies(dependencies));
			libraryStorage[libraryName].cache = cache;
			return cache;
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

})(); 
