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
		var dependencies = libraryStorage[libraryName].dependencies;
		return libraryStorage[libraryName].callback.apply(null, loadDependencies(dependencies));
		
		/* helper function */
		function loadDependencies (dependencies) {
			var loadedDependencies = [];
			loadedDependencies = dependencies.map(function (libraryName) {
				var dependencies = libraryStorage[libraryName].dependencies;
				var callback = libraryStorage[libraryName].callback;
				return loadLibrary(libraryName, dependencies, callback);
			});
			return loadedDependencies;
		}
	}

})(); 
