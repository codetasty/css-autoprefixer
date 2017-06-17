define(function(require, exports, module) {
	var ExtensionManager = require('core/extensionManager');
	
	var Utils = require('core/utils');
	var FileManager = require('core/fileManager');
	
	var Autoprefixer = require('./autoprefixer');
	
	var EditorEditors = require('modules/editor/ext/editors');
	var EditorCompiler = require('modules/editor/ext/compiler');
	
	var Extension = ExtensionManager.register({
		name: 'css-autoprefixer',
		
	}, {
		watcher: null,
		compilerName: 'CSS Autoprefixer',
		init: function() {
			EditorCompiler.addPlugin(this.name, this.onPlugin);
		},
		destroy: function() {
			EditorCompiler.removePlugin(this.name);
		},
		onPlugin: function(output, cb) {
			Autoprefixer.process(output, {
				add: false,
				browsers: []
			}).then(function(cleaned) {
				Autoprefixer.process(cleaned.css).then(function(prefixed) {
					cb(prefixed.css);
				}, function(error) {
					cb(null, error);
				});
			}, function(error) {
				cb(null, error);
			});
		},
	});
	
	module.exports = Extension.api();
});