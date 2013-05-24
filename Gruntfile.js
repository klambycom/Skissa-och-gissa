/*jslint node: true */
'use strict';

module.exports = function (grunt) {
	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [
					'lib/utils/functional.js', 'lib/utils/namespace.js', 'lib/utils/currying.js', 'lib/utils/html.js',
					'lib/utils/Subscriber.js', 'lib/utils/Channel.js', 'lib/utils/Mediator.js',

					//'lib/utils',
					//'public/templates/', // Should work, but will test later.
					'public/templates/facebook.js', 'public/templates/popup.js', 'public/templates/player.js',
					'public/templates/room.js', 'public/templates/message.js', 'public/templates/servermessage.js',
					'public/templates/donemessage.js',

					'lib/browser/game.js',

					'lib/browser/Point.js', 'lib/browser/points.js', 'lib/browser/artboard.js',

					'lib/shared/Player.js', 'lib/browser/Player.js',

					'lib/shared/Room.js', 'lib/browser/Room.js',

					'lib/browser/popup.js',

					'lib/browser/chat.js',

					'lib/browser/crayons.js',

					'public/javascript.js'
				],
				dest: 'public/javascript/<%= pkg.name %>.js',
				nonull: true
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
			},
			build: {
				src: 'public/javascript/<%= pkg.name %>.js',
				dest: 'public/javascript/<%= pkg.name %>.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task(s)
	grunt.registerTask('default', ['concat', 'uglify']);
};
