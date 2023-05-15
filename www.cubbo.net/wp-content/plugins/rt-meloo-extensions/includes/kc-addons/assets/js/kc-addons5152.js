/**
 * Plugin Name: 	Meloo Extensions
 * Theme Author: 	Mariusz Rek - Rascals Themes
 * Theme URI: 		http://rascalsthemes.com/meloo
 * Author URI: 		http://rascalsthemes.com
 * File:			modules.js
 * =========================================================================================================================================
 *
 * @package meloo-plugin
 * @since 1.0.0
 */

var kc_addons = (function($) {

    "use strict";


    /* Extended functions
     -------------------------------- */
    $.fn.addClassDelay = function( c, d ) {
        var t = $( this );
        setTimeout( function(){ 
            t.addClass( c ) }, 
        d );
        return this;
    };
    $.fn.removeClassDelay = function( c, d ) {
        var t = $( this );
        setTimeout( function(){ 
            t.removeClass( c ) }, 
        d );
        return this;
    };


    /* Run scripts
     -------------------------------- */

    /* Ajax: Enabled */
    if ( $( 'body' ).hasClass('WPAjaxLoader') && window.location.href.indexOf('kc_action=live-editor') <= 0 ) {
        $( document ).on('AjaxLoadEnd', function() {
            kc_addons.init();
        });

    /* Ajax: Disabled */
    } else {
        $( document ).ready(function($){
            kc_addons.init($);
        });
    }

    return {
        loaded : false,

        /* Init
         -------------------------------- */
        init : function(){
            
            /* First load */
            if ( ! kc_addons.loaded ) {

                this.lightbox();
                this.layers_slider();
                this.testi_slider();
                this.text_slider('body');
                this.countdown();
                this.stats();

            /* Reloaded */
            } else {
                
                this.lightbox();
                this.layers_slider();
                this.testi_slider();
                this.text_slider('body');
                this.countdown();
                this.stats();
            }

            kc_addons.loaded = true;

        },

        lightbox : function(){

            /* Pause player on Iframe videos */
            $( 'a.iframebox' ).on( 'click', function(){
                if ( typeof sc.scamp_player != 'undefined' ) {
                    sc.scamp_player.playerAction( 'pause' );
                }
            } );
            
            /* Unbind prettyphoto form KC*/
            $("a[rel^='prettyPhoto']").unbind('click.prettyphoto');
            $("a[data-lightbox]").unbind('click.prettyphoto');

            $("a.kc-pretty-photo").each(function(i) {
                if ($(this).attr('data-lightbox')) {
                    $(this).addClass('kc-gallery-item');
                } else {
                    $(this).addClass('imagebox');
                }
            })
            $("a.kc-pretty-photo").removeAttr('rel data-lightbox').removeClass('kc-pretty-photo');

            /* KC Gallery */
            $('.kc_image_gallery').magnificPopup({
                delegate: 'a.kc-gallery-item',
                closeMarkup: '<a href="#" class="mfp-close"></a>',
                type: 'image',
                image: {
                    verticalFit: true,
                },
                gallery: {
                    arrowMarkup: '<a href="#" class="mfp-arrow mfp-arrow-%dir%"></a>',
                    enabled: true
                }
            });

            /* Theme gallery */
            $('.gallery-images-grid').magnificPopup({
                delegate: 'a.g-item',
                closeMarkup: '<a href="#" class="mfp-close"></a>',
                type: 'image',
                zoom: {
                    enabled: true,
                    duration: 300, // don't foget to change the duration also in CSS
                    opener: function(element) {
                        return element.find('img');
                    }
                },
                image: {
                    verticalFit: true,
                },
                gallery: {
                    arrowMarkup: '<a href="#" class="mfp-arrow mfp-arrow-%dir%"></a>',
                    enabled: true
                }
            });

            /* Image */
            $('body').magnificPopup({
                delegate: '.imagebox',
                type: 'image',
                closeMarkup: '<a href="#" class="mfp-close"></a>',
            });

            /* iframe */
            $('body').magnificPopup({
                delegate : '.iframebox',
                type: 'iframe',
                closeMarkup: '<a href="#" class="mfp-close"></a>',
            });

            /* WP Gallery */
            $('.gallery').each(function() {

                var gallery = $(this)
                  , id = $(this).attr('id')
                  , attachment_id = false;
                if ($('a[href*="attachment_id"]', gallery).length) {
                    return false;
                }
                $('a[href*="uploads"]', gallery).each(function() {
                    $(this).attr('data-group', id);
                    $(this).addClass('thumb');
                    if ($(this).parents('.gallery-item').find('.gallery-caption').length) {
                        var caption = $(this).parents('.gallery-item').find('.gallery-caption').text();
                        $(this).attr('title', caption);
                    }

                });

                $(this).magnificPopup({
                    delegate: 'a',
                    closeMarkup: '<a href="#" class="mfp-close"></a>',
                    type: 'image',
                    fixedBgPos: true,
                    gallery: {
                        arrowMarkup: '<a href="#" class="mfp-arrow mfp-arrow-%dir%"></a>',
                        enabled: true
                    }
                });

            });
        },

        layers_slider : function() {

            if ( $( '.layers-slider' ).length ) {

                $( '.layers-slider' ).each( function(){
                    var delay = parseInt( $(this).attr( 'data-delay' ), 10 ),
                        auto = false;
                    delay = delay * 1000;
                    if ( delay > 0 ) {
                        auto = true;
                    }
                    var ls = $( this ).bxSlider({
                        mode: 'fade',
                        auto: auto,
                        speed: 1000,
                        pager: true,
                        autoStart: true,
                        controls: true,
                        pause: delay,
                        touchEnabled: true,
                        onSliderLoad: function( slide ) {
                            setTimeout(function() {
                                var init_height = $( '.layers-slider li', ls ).outerHeight();
                                $( '.bx-viewport', ls ).height( init_height );
                            }, 100 );
                            $( '.layers-slider li.on .title', ls ).addClassDelay( 'on', 1000 );
                            $( '.layers-slider li.on .sub-title', ls ).addClassDelay( 'on', 1200 );
                            $( '.layers-slider li.on .thumb-icon', ls ).addClassDelay( 'on', 1300 );
                        },
                        onSlideBefore: function(slide) {

                            slide.addClass( 'start' );
                            slide.addClassDelay( 'over', 10 );
                            slide.parent().children('li').removeClassDelay( 'on start', 100 );
                            slide.addClassDelay( 'on', 500 );
                            slide.removeClassDelay( 'over', 800 );
                            $( slide ).find( '.title' ).removeClass( 'on' );
                            $( slide ).find( '.sub-title' ).removeClass( 'on' );
                            $( slide ).find( '.thumb-icon' ).removeClass( 'on' );
                         
                        },
                        onSlideAfter: function(slide) {
                            $( slide ).find( '.title' ).addClassDelay( 'on', 200 );
                            $( slide ).find( '.sub-title' ).addClassDelay( 'on', 600 );
                            $( slide ).find( '.thumb-icon' ).addClassDelay( 'on', 700 );
                        }
                    });

                });
               
            }
        },

        testi_slider : function() {

            if ( $( '.testi-slider' ).length ) {
                $( '.testi-slider' ).each( function(){
                    var delay = parseInt( $(this).attr( 'data-delay' ), 10 ),
                        auto = false;
                    delay = delay * 1000;
                    if ( delay > 0 ) {
                        auto = true;
                    }
                    var ts = $( '.testi-slider' ).bxSlider({
                        mode: 'fade',
                        auto: auto,
                        speed: 1000,
                        pager: true,
                        controls: true,
                        pause: delay,
                        touchEnabled: true,
                        onSliderLoad: function( slide ) {
                            setTimeout(function() {
                                var init_height = $( '.testi-slider li', ts ).outerHeight();
                                $( '.bx-viewport', ts ).height(init_height);
                            }, 100 );
                        },
                        onSlideBefore: function(slide) {
                            slide.addClass( 'start' );
                            slide.addClassDelay( 'over', 10 );
                            slide.parent().children('li').removeClassDelay( 'on start', 100 );
                            slide.addClassDelay( 'on', 500 );
                            slide.removeClassDelay( 'over', 800 );
                        },
                    });
                });
            }
        },

        text_slider : function(container) {

            if ( $( '.kc-text-slider', container ).length <= 0 ) {
                return;
            } 

            // For each instance
            $( '.kc-text-slider', container ).each( function(){
                var $this = $( this ),
                    delay = parseInt( $this.attr( 'data-delay' ), 10 ),
                    handle,
                    index = 0,
                    l = $( this ).find( '.text-slide' ).length-1,
                    delay = delay * 1000;
             
                if ( l == 0 ) {
                    return;
                }
                $this.addClass('ready');
                $this.find( '.visible h2' ).addClassDelay( 'on', 100 );
                $this.find( '.visible h6' ).addClassDelay( 'on', 300 );
                
                var _change_slide = function() {
                    $this.find( '.text-slide:eq( ' + index + ' )' ).hide().removeClass( 'visible' ).find( '.on' ).removeClass( 'on' );
                    index ++;
                    
                    if ( index > l ) {
                        index = 0;
                    }
                    $this.find( '.text-slide:eq( ' + index + ' )' ).show().addClass( 'visible' );
                    $this.find( '.visible h2' ).addClassDelay( 'on', 100 );
                    $this.find( '.visible h6' ).addClassDelay( 'on', 300 );
                }
                handle = setInterval( _change_slide, delay );
                delay = delay * 1000;
            });
        },

        countdown : function() {

            if ( $.fn.countdown ) {
                $( '.kc-countdown' ).each( function(e) {
                    var date = $( this ).data( 'event-date' );

                    $( this ).countdown( date, function( event ) {
                        var $this = $( this );
                        $this.find( '.days' ).html( event.offset.totalDays );
                        $this.find( '.hours' ).html( event.strftime(''+'%H') );
                        $this.find( '.minutes' ).html( event.strftime(''+'%M') );
                        $this.find( '.seconds' ).html( event.strftime(''+'%S') );
                        
                    });
                });
            }
        },

        stats : function() {

            $( 'ul.stats' ).each( function(){

                /* Variables */
                var
                    $max_el       = 6,
                    $stats        = $( this ),
                    $stats_values = [],
                    $stats_names  = [],
                    $timer        = $stats.data( 'timer' ),
                    $stats_length;


                /* Get all stats and convert to array */
                /* Set length variable */
                $( 'li', $stats).each( function(i){
                    $stats_values[i] = $( '.stat-value', this).text();
                    $stats_names[i] = $( '.stat-name', this).text();
                });
                $stats_length = $stats_names.length;

                /* Clear list */
                $stats.html( '' );

                /* Init */
                display_stats();

                /* Set $timer */
                var init = setInterval( function(){
                    display_stats();
                },$timer);

                /* Generate new random array */
                function randsort(c,l,m) {
                    var o = new Array();
                    for (var i = 0; i < m; i++) {
                        var n = Math.floor(Math.random()*l);
                        var index = jQuery.inArray(n, o);
                        if (index >= 0) i--;
                        else o.push(n);
                    }
                    return o;
                }

                /* Display stats */
                function display_stats(){
                    var random_list = randsort( $stats_names, $stats_length, $max_el);
                    var i = 0;

                    /* First run */
                    if ( $( 'li', $stats).length == 0) {
                        for (var e = 0; e < random_list.length; e++) {
                            $( $stats).append( '<li class="stat-col"><span class="stat-value"></span><span class="stat-name"></span></li>' );
                        }
                    }

                    var _display = setInterval( function(){

                        var num = random_list[i];
                            var stat_name = $( 'li', $stats).eq(i).find( '.stat-name' );
                            stat_name.animate({bottom : '-40px', opacity : 0}, 400, function(){
                                $( this ).text( $stats_names[num]);
                                $( this ).css({bottom : '-40px', opacity : 1});
                                $( this ).animate({ bottom : 0}, 400 );
                            });
                            
                            var stat_value = $( 'li', $stats).eq(i).find( '.stat-value' );
                            display_val(stat_value, num);
                        i++;
                        if (i == random_list.length)
                            clearInterval(_display);
                    },600);
                }

                /* Display value */
                function display_val(val, num) {
                    var 
                        val_length = $stats_values[num].length,
                        val_int = parseInt( $stats_values[num], 10 ),
                        counter = 10,
                        delta = 10,
                        new_val;

                    // Delta
                    if (val_int <= 50) delta = 1;
                    else if (val_int > 50 && val_int <= 100) delta = 3;
                    else if (val_int > 100 && val_int <= 1000) delta = 50;
                    else if (val_int > 1000 && val_int <= 2000) delta = 100
                    else if (val_int > 2000 && val_int <= 3000) delta = 150;
                    else if (val_int > 3000 && val_int <= 4000) delta = 200;
                    else delta = 250;

                    var _display = setInterval( function(){
                        
                        counter = counter+delta;
                        new_val = counter;
                        val.text(new_val);
                        if (new_val >= val_int) {
                            clearInterval(_display);
                            val.text( $stats_values[num]);
                        }
                            
                    },40);
                    
                }

            });

        },

    }

}( jQuery ));