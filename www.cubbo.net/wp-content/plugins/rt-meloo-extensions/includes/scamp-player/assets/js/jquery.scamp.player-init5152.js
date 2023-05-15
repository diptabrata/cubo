/**
 * Plugin Name: 	Meloo Extensions
 * Theme Author: 	Mariusz Rek - Rascals Themes
 * Theme URI: 		http://rascalsthemes.com/meloo
 * Author URI: 		http://rascalsthemes.com
 * File:			scamp-player-init.js
 * =========================================================================================================================================
 *
 * @package meloo-plugin
 * @since 1.0.0
 */


var sc = (function($) {

    "use strict";
    

    /* Extended functions
	 -------------------------------- */
	(function( func ) {
	    jQuery.fn.addClass = function() {
	        func.apply( this, arguments );
	        this.trigger('classChanged');
	        return this;
	    }
	})(jQuery.fn.addClass); // pass the original function as an argument


	/* Run scripts
	 -------------------------------- */

	/* Ajax: Enabled */
	if ( $( 'body' ).hasClass('WPAjaxLoader') ) {
		$( document ).on('AjaxLoadEnd', function() {
        	sc.init();
    	});

    /* Ajax: Disabled */
	} else {
		$( document ).ready(function($){
        	sc.init($);
    	});
	}

    return {
    	loaded : false,
        scamp_player : null,


        /* Init
		 -------------------------------- */
        init : function(){
        	
        	/* First load */
            if ( ! sc.loaded ) {

            	this.player.init();
            	this.actions();
            	this.scrollbars();
            	this.waveform.init();

            /* Reloaded */
            } else {
            	
            	this.scrollbars();
           		this.waveform.init();
           		this.scamp_player.update_content();
            	this.scamp_player.update_analyser();
            	this.scamp_player.update_events('body');
            }

            sc.loaded = true;

        },


        /* Scrollbars
		 -------------------------------- */
        scrollbars : function (){
        	if ( $( '.sp-tracklist-block.sp-has-fixed-height' ).length ) {
				$( '.sp-tracklist-block.sp-has-fixed-height' ).each(function(){
					var id = $( this ).attr( 'id' ),
						Scrollbar = window.Scrollbar;
	  				Scrollbar.init( document.querySelector( '#'+id ), {  } );
				} );
	  		}
        },


        /* Player Actions
		 -------------------------------- */
        actions : function(){

        	/* Show Player */
			$( 'a[href="#show-player"]' ).on( 'click', function(event) {

				event.preventDefault();
				event.stopPropagation();

				if ( $( '#scamp_player' ).hasClass( 'sp-show-player' ) ) {
					$( '#scamp_player' ).removeClass( 'sp-show-list' );
					$( '#scamp_player' ).removeClass( 'sp-show-player' ).addClass( 'sp-hidden-player' );
				} else {
					// Show player
					$( '#scamp_player' ).removeClass( 'sp-hidden-player' ).addClass( 'sp-show-player' );
				}

			});
			if ( $( '#scamp_player' ).hasClass( 'sp-open-after-click' ) ) {
				$( '.sp-play-track' ).on( 'click', function(){
					$( '#scamp_player' ).addClass( 'sp-show-player' );
				} );
			}

			/* Lyrics button */
			$( 'body' ).on( 'click', '.sp-tracklist li .track-lyrics', function(){
				var $this = $( this ),
				$li = $this.parents( 'li' ),
				$list = $this.parents( '.sp-tracklist' );

				$list.find( 'li').not($li).find( '.track-row-lyrics' ).slideUp();
				$list.find( 'li').not($li).find( '.track-lyrics.is-active' ).removeClass( 'is-active' );

				$this.toggleClass( 'is-active' );
				$li.find( '.track-row-lyrics' ).slideToggle();

			});

			/* Player status */
			$( '#scamp_player' ).on('classChanged', function(){ 

				if ( $( this ).hasClass( 'sp-show-player' ) ) {
					$( 'a[href="#show-player"]' ).addClass( 'status-show-player' );
				} else {
					$( 'a[href="#show-player"]' ).removeClass( 'status-show-player' );
				}

				if ( $( this ).hasClass( 'playing' ) ) {

					$( 'a[href="#show-player"]' ).addClass( 'status-playing' ).removeClass( 'status-loading status-paused' );
					var pos = $( '#scamp_player .sp-position' ).width(),
						el_w = 	$( window ).width(),
						max = 144,
						p,x;

					pos = parseFloat( pos / el_w ) * 100;
					pos = pos.toFixed(0);
					p = pos/100;
					x = p * max;
					$( '.nav-player-btn .circle' ).css({ 'stroke-dasharray': + x + ' 144' });
				} else if ( $( this ).hasClass( 'loading' ) ) {
					$( 'a[href="#show-player"]' ).addClass( 'status-loading' ).removeClass( 'status-playing status-paused' );
				} else if ( $( this ).hasClass( 'paused' ) ) {
					$( 'a[href="#show-player"]' ).addClass( 'status-paused' ).removeClass( 'status-playing status-loading' );
				} else {
					$( 'a[href="#show-player"]' ).removeClass( 'status-playing status-loading status-paused' );
				}

			});
	    },


	    /* Waveform
		 -------------------------------- */
	    waveform : {
	    	count : 0,
	    	max : null,
	    	list : [],

	    	init : function() {
	    		sc.waveform.count = 0;
	    		sc.waveform.list = $( '.track-waveform' );
	    		sc.waveform.max = $( '.track-waveform' ).length-1;
	    		if ( sc.waveform.max >= 0 ) {
	    			sc.waveform.generate( sc.waveform.list[sc.waveform.count] );
	    		}
	    		
	    	},
	    	generate : function(el) {
				
				if ( $(el).hasClass( 'ready' ) || $(el).hasClass( 'error' ) ) {
					return;
				}

	    		var 
					w = $( el ),
					id = w.attr( 'id' ),
					audio = w.attr( 'data-audio' ),
					waveform,
					shadow_height = w.attr( 'data-shadow-height' ),
					colors = ['#ff7700', '#ff2400', '#ff7700', '#ff2400'],
					colors_d = w.attr( 'data-colors' ),
					waveform_w = $( '#' + id + ' .waveform').prop('width'),
					waveform_h = $( '#' + id + ' .waveform').prop('height'),
					ctx;


	    		if ( Waveform != undefined && id !== undefined && audio !== undefined && audio !== '' ) {
	    			
	    			if ( colors_d !== undefined ) {
	    				colors = colors_d.split(',');
	    			}
	    			if ( shadow_height !== undefined ) {
	    				shadow_height = parseInt( shadow_height, 10 );
	    			} else {
	    				shadow_height = 100;
	    			}
	    			w.addClass( 'loading' );

					$.ajax({
				        url: audio,
				        async: false,
				        type: "GET",
				        dataType: "binary",
				        processData: false,
				        success: function (data) {
				            var blob = data;
				            Waveform.generate( blob, {
				                canvas_width: waveform_w,
				                canvas_height: waveform_h,
				                bar_width:4,
				                bar_gap : 0.4,
				                wave_start_color: colors[0],
								wave_end_color: colors[1],
				                shadow_height : shadow_height,
								shadow_start_color: colors[2],
								shadow_end_color: colors[3],
								shadow_opacity : 0.2,
								shadow_gap : 1,
				                download: false,
				                onComplete: function(png, pixels) {
				                	waveform = $( '#' + id + ' .waveform')[0];
				                	w.addClass( 'ready' );
				                	w.removeClass( 'loading' );
									ctx = waveform.getContext( '2d' );
				                    ctx.putImageData( pixels, 0, 0 );
				                    sc.waveform.count++;
				                    if ( sc.waveform.count <= sc.waveform.max  ) {
				                    	sc.waveform.generate( sc.waveform.list[sc.waveform.count] );
				                    }
				                    //settings.audio_player.update_events( w );
				                }
				            });
				                                    
				        },

				        error: function (xhr, status, err) {
				           console.log(status);
				           w.addClass( 'error' );
				        }

				    }); // Ajax magic
				}
	    	}

	    },


	    /* Scamp Player
		 -------------------------------- */
	    player : {

	    	v : {},
			eq_enterframe : null,
			track : null,
			scale : null,
			vis_type : null, 
			v_id : null, 
			status : null,
			audio : null, 
			eq_ctx : null,
			comp : null,
			canvas : null,
			cwidth : null,
			cheight : null,
			gradient : null,
			meterWidth : null,
			gap : null,
			meterNum : null,

	    	init : function() {

	    		sc.scamp_player = new $.ScampPlayer( $( '#scamp_player' ), {

					// Default Scamp Player options
					volume : scamp_vars.volume, // Start volume level
					no_track_image : scamp_vars.plugin_assets_uri+'/assets/img/no-track-image.png', // Placeholder image for track cover
					path: scamp_vars.plugin_uri,
					loop : scamp_vars.loop, // Loop tracklist
					load_first_track : scamp_vars.load_first_track, // Load First track
					random : scamp_vars.random, // Random playing
					titlebar : scamp_vars.titlebar, // Replace browser title on track title
					check_files : false, // Checks whether a track file exists
					client_id : scamp_vars.soundcloud_id, // Soundcloud Client ID
					shoutcast : scamp_vars.shoutcast,
					shoutcast_interval : scamp_vars.shoutcast_interval,
					labels : {
						play : scamp_vars.play_label,
						cover : scamp_vars.cover_label,
						title : scamp_vars.title_label,
						buy : scamp_vars.buy_label,
						remove : scamp_vars.remove_label,
						empty_queue : scamp_vars.empty_queue
					},
					debug : false,
					// Soundmanager2 options
					sm_options : { 
						url: scamp_vars.plugin_uri+'/js/swf/', 
						flashVersion: 9,
						ignoreMobileRestrictions: true,
						preferFlash: false, 
						useHTML5Audio: true, 
						allowScriptAccess: 'always', 
						debugMode: false, 
						debugFlash: false, 
						useConsole: false,
						forceUseGlobalHTML5Audio: false,
						ignoreMobileRestrictions: false
					},
					audioAnalyser : function(a) {
						sc.player.status = a.status;
						sc.player.v = a.v;
						switch ( sc.player.status ) {
						    case 'init':
						        sc.player.vis();
						        break;
						    case 'play':
						        sc.player.vis();
						        break;
						    case 'stop':
						        sc.player.end_vis();
						        break;
						    case 'update':
						       	cancelAnimationFrame(sc.player.eq_enterframe);
								sc.player.vis();
						        break;
						}

					}
					
				});

				window.addEventListener('resize', sc.player.resize_eq(), false);

	    	},
	    	vis : function() {
				if ( sc.player.status == 'init' ) {
					$( '.sp-vis.sp-vis-on' ).removeClass( 'sp-vis-on' );
				}
				if ( $( '.sp-vis.sp-vis-on' ).length ) {
					sc.player.start_vis();
				} else if ( $( 'a.sp-play-track.has-vis[href="'+sc.player.v.audio.src+'"]' ).length ) {

					sc.player.track = $( 'a.sp-play-track.has-vis[href="'+sc.player.v.audio.src+'"]' );

					/* Track has visualisation */
					if ( typeof sc.player.track.data( 'v' ) !== undefined ) {
						sc.player.v_id = sc.player.track.data( 'v' );
						sc.player.vis_type = sc.player.track.data( 'vt' );
						if ( $( '#'+sc.player.v_id ).length ) {
							$( '#'+sc.player.v_id ).addClass( 'sp-vis-on' );
							if ( $( '#'+sc.player.v_id ).find( '.tracklist-waveform:not(.ready):not(.error)' ) ) {
								var wave = $( '#'+sc.player.v_id ).find( '.tracklist-waveform' );
								sc.waveform.generate( wave );
							}
							sc.player.start_vis();
						}
					}
				}
			},
			start_vis : function() {

				/* Visualisation type */
				if ( sc.player.vis_type == 'lines' ) {
					sc.player.init_eq();
					sc.player.render_vis_lines();
				} else if ( sc.player.vis_type == 'bars' ) {
					sc.player.init_eq();
					sc.player.render_vis_bars();
				}
			},
			end_vis : function() {
				sc.player.clear_eq();
			},
			init_eq : function() {
				sc.player.canvas = document.getElementById(sc.player.v_id+'-canvas');
			    sc.player.eq_ctx = sc.player.canvas.getContext('2d');
			    sc.player.redraw_eq(); 
			},
			redraw_eq : function() {
				$( '#'+sc.player.v_id+'-canvas').prop( 'width', $( '.sp-vis.sp-vis-on' ).width() );
				$( '#'+sc.player.v_id+'-canvas').prop( 'height', $( '.sp-vis.sp-vis-on' ).height() );
		        sc.player.cwidth = sc.player.canvas.width;
		        sc.player.cheight = sc.player.canvas.height;
		        
		        sc.player.gap = 2; //gap between meters
		        if ( sc.player.cwidth < 400 ) {
		        	sc.player.scale = .5;
		        	sc.player.meterWidth = Math.round(sc.player.cwidth/14); //width of the meters in the spectrum
		        } else {
		        	sc.player.scale = 1.1;
		        	sc.player.meterWidth = Math.round(sc.player.cwidth/30); //width of the meters in the spectrum
		        }
		        sc.player.meterNum = sc.player.cwidth / (10 + 2);  //count of the meters
		        sc.player.gradient = sc.player.eq_ctx.createLinearGradient(0, 0, 0, sc.player.cheight);
			    sc.player.gradient.addColorStop(1, '#4063e6');
			    sc.player.gradient.addColorStop(0.5, '#b869ff');
			    sc.player.gradient.addColorStop(0, '#eb18d9');
			},
			render_vis_bars : function() {
				//console.log('renderFrame');
		        var array = new Uint8Array(sc.player.v.analyser.frequencyBinCount);
		        sc.player.v.analyser.getByteFrequencyData(array);
		        var step = Math.round(array.length / sc.player.meterNum); //sample limited data from the total array
		        sc.player.eq_ctx.clearRect(0, 0, sc.player.cwidth, sc.player.cheight);
		        for (var i = 0; i < sc.player.meterNum; i++) {
		            var value = array[i * step];
		            value = value * sc.player.scale;
		            sc.player.eq_ctx.fillStyle = sc.player.gradient; 
		            sc.player.eq_ctx.fillRect(i * (sc.player.meterWidth+sc.player.gap), sc.player.cheight, sc.player.meterWidth, sc.player.cheight-value); //the meter
		        }
	        	sc.player.eq_enterframe = requestAnimationFrame(sc.player.render_vis_bars);
			},
			render_vis_lines : function() {
		        var array = new Uint8Array(sc.player.v.analyser.frequencyBinCount);
		        sc.player.v.analyser.getByteFrequencyData(array);
		        var step = Math.round(array.length / sc.player.cwidth); //sample limited data from the total array
		        sc.player.eq_ctx.clearRect(0, 0, sc.player.cwidth, sc.player.cheight);
		       	
		       	sc.player.eq_ctx.strokeStyle="#464646";
		        sc.player.eq_ctx.beginPath();
		        for (var i = 0; i < sc.player.meterNum; i++) {
		            var value = array[i * step];
		            value = value *.5;
					sc.player.eq_ctx.lineTo(i * (sc.player.meterWidth+sc.player.gap),(sc.player.cheight+50)-value );
					sc.player.eq_ctx.stroke();
		        }
		       	sc.player.eq_ctx.strokeStyle="#4063e6";
		        sc.player.eq_ctx.beginPath();
		        for (var i = 0; i < sc.player.meterNum; i++) {
		            var value = array[i * step];
		            value = value * .2;
					sc.player.eq_ctx.lineTo(i * (sc.player.meterWidth+sc.player.gap),(sc.player.cheight)-value);
					sc.player.eq_ctx.stroke();
		        }
		        sc.player.eq_enterframe = requestAnimationFrame(sc.player.render_vis_lines);
		    },
			clear_eq : function() {
				cancelAnimationFrame(sc.player.eq_enterframe);
				// sc.player.eq_ctx.clearRect(0, 0, sc.player.cwidth, sc.player.cheight);
			},
			resize_eq : function() {
				if ( $( '.sp-vis.sp-vis-on' ).length ) {
	            	sc.player.redraw_eq();
	            }
	        }
	    }
    }

}( jQuery ));