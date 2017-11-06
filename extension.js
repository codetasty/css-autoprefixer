/* global define, $ */
"use strict";

define(function(require, exports, module) {
	const ExtensionManager = require('core/extensionManager');
	
	const Utils = require('core/utils');
	const FileManager = require('core/fileManager');
	
	const Autoprefixer = require('./autoprefixer');
	
	const EditorEditors = require('modules/editor/ext/editors');
	const EditorCompiler = require('modules/editor/ext/compiler');
	
	class Extension extends ExtensionManager.Extension {
		constructor() {
			super({
				name: 'css-autoprefixer',
			});
			
			this.watcher = null;
			
			this.compilerName = 'CSS Autoprefixer';
		}
		
		init() {
			super.init();
			
			EditorCompiler.addPlugin(this.name, this.onPlugin);
		}
		
		destroy() {
			super.destroy();
			
			EditorCompiler.removePlugin(this.name);
		}
		
		onPlugin(output, cb) {
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
		}
		
	}
	
	module.exports = new Extension();
});