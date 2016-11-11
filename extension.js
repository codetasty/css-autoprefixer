define(function(require, exports, module) {
	var ExtensionManager = require('core/extensionManager');
	
	var Socket = require('core/socket');
	var Workspace = require('core/workspace');
	var Notification = require('core/notification');
	var Fn = require('core/fn');
	var FileManager = require('core/fileManager');
	
	var Autoprefixer = require('./autoprefixer');
	
	var EditorSession = require('modules/editor/ext/session');
	
	var Extension = ExtensionManager.register({
		name: 'css-autoprefixer',
		
	}, {
		init: function() {
			EditorSession.on('save', this.onSave);
		},
		destroy: function() {
			EditorSession.off('save', this.onSave);
		},
		onSave: function(e) {
			if (Extension._exts.indexOf(e.storage.extension) !== -1) {
				Extension.compile(e.storage.workspaceId, e.storage.path, e.session.data.getValue());
			}
		},
		_exts: ['css'],
		plugin: function(css, cb) {
			Autoprefixer.process(css, { add: false, browsers: [] }).then(function(cleaned) {
				Autoprefixer.process(cleaned.css).then(function(prefixed) {
					cb(prefixed.css);
				}, function(error) {
					cb(null, error);
				});
			}, function(error) {
				cb(null, error);
			});
		},
		compile: function(workspaceId, path, doc) {
			var self = this;
			var options = FileManager.getFileOptions(doc, /^\s*\/\*\s*(.+)\*\//);
			
			if (!options.out || options.plugin != "css-autoprefixer") {
				return false;
			}
			
			var destination = FileManager.parsePath(path, options.out, [this._exts.join('|'), 'css']);
			
			if (!destination) {
				return false;
			}
			
			this.plugin(doc.substring(doc.indexOf("\n") + 1), function(output, error) {
				if (error) {
					Notification.open({
						type: 'error',
						title: 'CSS autoprefix failed',
						description: error.message + ' on ' + error.line + ':' + error.column,
						autoClose: true
					});
					return false;
				}
				
				FileManager.saveFile(workspaceId, destination, output, null);
			});
		}
	});

	module.exports = Extension.api();
});