var theme = (function($) {

    "use strict";

    /* Run scripts
     -------------------------------- */

    $(document).ready(function($) {
        theme.init($);
    });

    return {
        loaded: false,

        /* Init
         -------------------------------- */
        init: function() {
            if ( this.check_mobile ) {
                $('body').addClass('is-mobile');
            }
            this.WPAjaxLoader.init();
            this.nav.init();
            this.ajax__posts_slider();
            this.ajax__posts_loader.init();

            if (!theme.WPAjaxLoader.ajax__ready()) {
                this.reload();
            }

        },

        reload: function() {
            this.window_events.init();
            this.nav.nav__refresh();
            this.social_players.vimeo();
            this.social_players.youtube();
            this.text_anim('body');
            this.plugins.reset();
            this.plugins.ResIframe();
            this.plugins.Lazy();
            this.plugins.theiaStickySidebar();
            this.plugins.disqus();
        },

        ajax__posts_loaded: function(container) {
            this.text_anim(container);
            this.social_players.vimeo();
            this.social_players.youtube();
        },


        /* ==================================================
          Check Mobile Browser
        ================================================== */
        check_mobile: function() {

            if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
            ){
                return true;
            } else {
                return false;
            }
        },

        /* ==================================================
          WPAjaxLoader 
        ================================================== */
        WPAjaxLoader: {

            init: function() {

                if (!theme.WPAjaxLoader.ajax__ready()) {
                    return;
                }
                $.WPAjaxLoader({
                    home_url: controls_vars.home_url,
                    theme_uri: controls_vars.theme_uri,
                    dir: controls_vars.dir,
                    reload_containers: controls_vars.ajax_reload_containers,
                    permalinks: controls_vars.permalinks,
                    ajax_async: controls_vars.ajax_async,
                    ajax_cache: controls_vars.ajax_cache,
                    ajax_events: controls_vars.ajax_events,
                    ajax_elements: controls_vars.ajax_elements,
                    excludes_links: controls_vars.ajax_exclude_links,
                    reload_scripts: controls_vars.ajax_reload_scripts,
                    search_forms: '#searchform,#searchform',
                    start_delay: 1200,
                    nav: '#nav-main',
                    header_container: '.header',
                    loadStart: theme.WPAjaxLoader.load__start,
                    loadEnd: theme.WPAjaxLoader.load__end,
                    redirectStart: theme.WPAjaxLoader.redirect__start
                });
                $.WPAjaxLoader.init(function() {});

            },

            ajax__ready: function() {

                // If customize panel
                if (window.location.href.indexOf('customize.php') > -1 || window.location.href.indexOf('customize_messenger_channel') > -1) {
                    $('#wpal-loader').remove();
                    return false;
                    // 404
                } else if (window.location.href.indexOf('/404') > -1 || window.location.href.indexOf('/?error=404') > -1) {
                    $('#wpal-loader').remove();
                    return false;
                    // If KC Live editor
                } else if (window.location.href.indexOf('kc_action=live-editor') > -1) {
                    $('#wpal-loader').remove();
                    return false;
                    // Ajax is disabled in theme panel
                } else if (controls_vars.ajaxed == 0) {
                    $('#wpal-loader').remove();
                    return false;
                } else {
                    return true;
                }

            },

            load__start: function() {
                if (!theme.WPAjaxLoader.ajax__ready()) {
                    return;
                }

                if ( $( '#wpal-loader' ).length ) {
                    if (controls_vars.loader_style == 'bars') {
                        theme.WPAjaxLoader.loader__bars_start();
                    } else if (controls_vars.loader_style == 'stripes') {
                        theme.WPAjaxLoader.loader__stripes_start();
                    }
                }

                $('#nav-search').removeClass('on');
                $('#header').removeClass('open-panel-search');
                $('#search-block').slideUp(400);
                $('#s').val('');

                /* Fire Event */
                $.event.trigger({
                    type: "AjaxLoadStart"
                });
            },

            load__end: function() {
                if (!theme.WPAjaxLoader.ajax__ready()) {
                    return;
                }

                // End animations
                setTimeout(function() {
                    /* Load End */
                    if ( $( '#wpal-loader' ).length ) {
                        if (controls_vars.loader_style == 'bars') {
                            theme.WPAjaxLoader.loader__bars_end();
                        } else if (controls_vars.loader_style == 'stripes') {
                            theme.WPAjaxLoader.loader__stripes_end();
                        }
                    }

                }, 100);

                setTimeout(function() {

                    /* Reload theme scripts */
                    theme.reload();

                    /* Fire Event */
                    $.event.trigger({
                        type: "AjaxLoadEnd"
                    });

                }, 50);

            },

            redirect__start: function(url) {
                if (!theme.WPAjaxLoader.ajax__ready()) {
                    return;
                }

                $('.wpal-loading-layer .progress-bar').css({
                    width: 0
                });
                $('.wpal-loading-layer').css('display', 'block');
                anime({
                    targets: '.page-trans-stripe',
                    width: '100%',
                    easing: 'easeInQuad',
                    duration: 400,
                    delay: function(el, i, l) {
                        return 400 + (i * 100);
                    },
                    complete: function() {
                        window.location.href = url;
                    }
                });
            },

            loader__stripes_start: function() {
                $('.wpal-loading-stripes-layer .progress-bar').css({
                    width: 0
                });
                $('.wpal-loading-stripes-layer').css('display', 'block');
                anime({
                    targets: '.page-trans-stripe',
                    width: '100%',
                    easing: 'easeInQuad',
                    duration: 400,
                    delay: function(el, i, l) {
                        return 400 + (i * 100);
                    },
                    complete: function() {
                        anime({
                            targets: '.wpal-loading-stripes-layer .page-loader-content',
                            opacity: {
                                value: 1,
                                delay: 0,
                                duration: 400,
                                easing: 'easeInQuad',
                            },
                        });

                        /* Close playlist */
                        if ($('#scamp_player.sp-show-list').length) {
                            $('#scamp_player').removeClass('sp-show-list');
                        }

                        /* Close Dropdown Menu */
                        $('.nav-horizontal ul li').removeClass('active').children('ul').stop(true, true).removeClass('show-list edge');

                        /* Close Slidepanel */
                        $('body').removeClass('slidebar-visible');

                        /* Remove HTML classes */
                        $('html').attr('class', '');
                    }
                });

            },

            loader__stripes_end: function() {
                anime({
                    targets: '.wpal-loading-stripes-layer .page-loader-content',
                    opacity: {
                        value: 0,
                        delay: 0,
                        duration: 400,
                        easing: 'easeInQuad',
                    },
                    complete: function() {
                        anime({
                            targets: '.page-trans-stripe-5',
                            width: 0,
                            easing: 'easeOutQuad',
                            duration: 400,
                            delay: 0
                        });
                        anime({
                            targets: '.page-trans-stripe-4',
                            width: 0,
                            easing: 'easeOutQuad',
                            duration: 400,
                            delay: 0
                        });
                        anime({
                            targets: '.page-trans-stripe-3',
                            width: 0,
                            easing: 'easeOutQuad',
                            duration: 400,
                            delay: 100
                        });
                        anime({
                            targets: '.page-trans-stripe-2',
                            width: 0,
                            easing: 'easeOutQuad',
                            duration: 400,
                            delay: 200
                        });
                        anime({
                            targets: '.page-trans-stripe-1',
                            width: 0,
                            easing: 'easeOutQuad',
                            duration: 400,
                            delay: 300
                        });
                        anime({
                            targets: '.page-trans-stripe-0',
                            width: 0,
                            easing: 'easeOutQuad',
                            duration: 400,
                            delay: 300,
                            complete: function() {
                                $('.wpal-loading-stripes-layer').css('display', 'none');
                            }
                        });
                    }
                });
            },

            loader__bars_start: function() {
                $('.wpal-loading-bars-layer .progress-bar').css({
                    width: 0
                });
                anime({
                    targets: '.wpal-loading-bars-layer',
                    translateY: {
                        value: '0',
                        delay: 0,
                        duration: 800,
                        easing: 'easeInOutQuad'
                    }
                });
                anime({
                    targets: '.wpal-loading-bars-layer svg.shape path',
                    duration: 800,
                    easing: 'linear',
                    d: document.querySelector('.wpal-loading-bars-layer svg.shape path').getAttribute('data-spirit-id'),
                });

                anime({
                    targets: '.wpal-loading-bars-layer .loader-content',
                    opacity: {
                        value: '1',
                        delay: 800,
                        duration: 400,
                        easing: 'linear',
                        complete: function(anim) {

                            /* Close playlist */
                            if ($('#scamp_player.sp-show-list').length) {
                                $('#scamp_player').removeClass('sp-show-list');
                            }

                            /* Close Dropdown Menu */
                            $('.nav-horizontal ul li').removeClass('active').children('ul').stop(true, true).removeClass('show-list edge');

                            /* Close Slidepanel */
                            $('body').removeClass('slidebar-visible');

                            /* Remove HTML classes */
                            $('html').attr('class', '');
                        }
                    }
                });
            },

            loader__bars_end: function() {
                anime({
                    targets: '.wpal-loading-bars-layer .loader-content',
                    opacity: {
                        value: '0',
                        delay: 0,
                        duration: 400,
                        easing: 'easeInOutQuad',
                    },
                });
                anime({
                    targets: '.wpal-loading-bars-layer',
                    translateY: {
                        value: '-200vh',
                        delay: 400,
                        duration: 800,
                        easing: 'easeInOutQuad'
                    }
                });
                anime({
                    targets: '.wpal-loading-bars-layer svg.shape path',
                    duration: 800,
                    easing: 'easeInOutQuad',
                    d: document.querySelector('.wpal-loading-bars-layer svg.shape path').getAttribute('data-spirit-id'),
                });

            },

        },

        /* ==================================================
          Navigation 
        ================================================== */
        nav: {
            init: function() {
                theme.nav.nav__top();
                theme.nav.nav__responsive();
                theme.nav.nav__icons();
                theme.nav.nav__hash();
                theme.nav.nav__refresh();
            },
            nav__top: function() {

                /*  Create top navigation */
                $(document).on('mouseenter', '.nav-horizontal ul li', function() {
                    var $this = $(this)
                      , $sub = $this.children('ul')
                      , t = this;

                    var timer = $this.data('timer');
                    if (timer)
                        clearTimeout(timer);
                    $this.data('showTimer', setTimeout(function() {

                        $sub.css('display', 'block');
                        anime({
                            targets: t.querySelector('ul'),
                            translateY: 20,
                            opacity: {
                                value: 1,
                                delay: 0,
                                duration: 300,
                                easing: 'easeInQuad',
                            },
                            translateY: {
                                value: 0,
                                delay: 0,
                                duration: 300,
                                easing: 'easeOutQuad',
                            }
                        });
                        if ($sub.length) {
                            $this.addClass('active');
                            var elm = $('ul:first', t)
                              , off = elm.offset()
                              , l = off.left + 20
                              , w = elm.width()
                              , docH = $('body').height()
                              , docW = $('body').width();

                            var isEntirelyVisible = (l + w <= docW);
                            if (!$this.hasClass('super-menu')) {
                                if (!isEntirelyVisible) {
                                    $sub.addClass('edge');
                                } else {
                                    $sub.removeClass('edge');
                                }
                            }
                        }

                    }, 50));

                }).on('mouseleave', '.nav-horizontal ul li', function() {
                    var $t = $(this)
                      , t = this;

                    var showTimer = $t.data('showTimer');
                    if (showTimer)
                        clearTimeout(showTimer);

                    $t.data('timer', setTimeout(function() {
                        anime({
                            targets: t.querySelector('ul'),
                            translateY: 0,
                            opacity: {
                                value: 0,
                                delay: 0,
                                duration: 200,
                                easing: 'easeInQuad',
                            },
                            translateY: {
                                value: 20,
                                delay: 0,
                                duration: 300,
                                easing: 'easeOutQuad',
                            },
                            complete: function() {
                                $t.removeClass('active').children('ul').stop(true, true).removeClass('show-list edge').css('display', 'none');

                            }
                        });

                    }, 500));

                });
            },

            nav__responsive: function() {
                $('#nav-sidebar .menu-item-has-children > a').each(function() {
                    $(this).after('<span class="submenu-trigger"></span>');
                });
                $('#nav-sidebar > ul > li').addClass('first-child');
                $('#nav-sidebar > ul').append('<li class="nav-end"></li>');
                $('#nav-sidebar .submenu-trigger, #nav-sidebar .menu-item-has-children > a[href="#"]').on('click', function(e) {
                    e.preventDefault();
                    var li = $(this).closest('li')
                      , main_index = $(this).parents('.first-child').index();
                    $('#nav-sidebar > ul > li:not(:eq(' + main_index + ')) ul:visible').slideUp();
                    $('#nav-sidebar > ul > li:not(:eq(' + main_index + ')) li, #nav-sidebar > ul > li:not(:eq(' + main_index + '))').removeClass('opened');
                    li.toggleClass('opened').find(' > ul').slideToggle(400);
                });

                /* Menu Trigger */
                $('.responsive-trigger').on('click', function(e) {
                    e.preventDefault();
                    $('body').addClass('slidebar-visible');
                });
                $('#slidebar-close, #slidebar-layer').on('click', function(e) {
                    e.preventDefault();
                    $('body').removeClass('slidebar-visible');
                });

                /* Close Slidebar after click on hash anchor */
                $(document).on('click', '.slidebar-content a[href*=#]', function(e) {
                    if ($(this).attr('href') != '#') {
                        $('body').removeClass('slidebar-visible');
                    }
                });
            },

            nav__icons: function() {

                /* Show/Hide Search Block */
                $('#nav-search').on('click', function(e) {
                    $(this).toggleClass('on');
                    $('#header').toggleClass('open-panel-search');
                    $('#search-block').slideToggle(400);
                    e.preventDefault();
                });

                $("#searchform").keypress(function(e) {
                    if ((e.keyCode == 13) && (e.target.type != "textarea")) {
                        e.preventDefault();
                        $(this).submit();
                        $(this).attr('readonly', 'readonly');
                        $(this).attr('disabled', 'true');
                        setTimeout(function() {
                            document.activeElement.blur();
                            $(this).blur();
                            $(this).removeAttr('readonly');
                            $(this).removeAttr('disabled');

                        }, 100);

                    }
                });

                /* Show/Hide Social Block */
                $('#nav-social').on('click', function(e) {
                    $(this).toggleClass('on');
                    $('#header').toggleClass('open-panel-social');
                    $('#social-block').slideToggle(400, function() {
                        $('#social-block .show-fx').toggleClass('on');
                    });

                    e.preventDefault();
                });
            },

            nav__hash: function() {

                /* Don't run if ajax is enabled */
                if (theme.WPAjaxLoader.ajax__ready()) {
                    return;
                }

                var target_hash = location.hash;
                var offset = parseInt($('.header').css('height'), 10);

                if (target_hash != '' && $(target_hash).length) {
                    var scroll_offset = $(target_hash).offset().top + offset;
                    $('html, body').animate({
                        scrollTop: scroll_offset
                    }, 900);
                }

                $(document).on('click', '#nav-main a[href*=#], #slidemenu a[href*=#], #slidebar-content a[href*=#]', function(e) {
                    var that = $(this);
                    var url = that.attr('href');
                    var target_hash = location.hash;
                    if (that.attr('href') !== '#') {

                        var hash = url.split('#')[1];

                        if (hash) {

                            hash = $(this).attr('href').replace(/^.*?#/, '');
                            hash = '#' + hash;

                            url = url.replace(hash, '');
                            offset = $(this).data('offset');
                            if (offset == undefined || offset == '') {

                                offset = parseInt($('.header').css('height'), 10);
                                offset = -(offset);
                            }
                        } else {
                            hash = '';
                        }

                        if (url === '') {
                            url = ajax_vars.home_url + '/';
                        }

                        if (url !== window.location.href.split('#')[0]) {
                            window.location.href = url + hash;
                        } else {
                            if (hash !== '' && hash !== '#') {
                                var scroll_offset = $(hash).offset().top + offset;
                                $('html, body').animate({
                                    scrollTop: scroll_offset
                                }, 900);
                            }
                        }
                    }
                    e.preventDefault();
                });
            },

            nav__refresh : function() {
                $('#nav-main a').removeClass('active');
            }

        },

        /* ==================================================
          Ajax Posts Slider 
        ================================================== */
        ajax__posts_slider: function() {
            if ($('.ajax-posts-slider').length) {

                $(document).on('click', '.arrow-nav:not(.disabled)', function(event) {

                    event.preventDefault();

                    var $this = $(this), $slider = $(this).parents('.ajax-posts-slider'), $container, direction = 'right', curr_page = parseInt($slider.attr('data-pagenum')), container_height, obj;

                    /* Check loading */
                    if ($slider.hasClass('loading')) {
                        return;
                    }

                    /* Check obj */
                    try {
                        obj = $.parseJSON($slider.attr('data-obj'));
                    } catch (err) {
                        return;
                    }

                    /* Left or right */
                    if ($this.hasClass('left')) {
                        direction = 'left';
                    }

                    /* Set page nr */
                    if (direction == 'left' && curr_page != 1) {
                        curr_page--;
                        $slider.addClass('anim-slide-from-left').removeClass('anim-slide-from-right');
                    }
                    if (direction == 'right' && !$slider.hasClass('end')) {
                        curr_page++;
                        $slider.addClass('anim-slide-from-right').removeClass('anim-slide-from-left');
                    }

                    /* Grid */
                    $container = $slider.find('.ajax-posts-slider-inner');

                    /* Pagenum */
                    obj['pagenum'] = curr_page;

                    /* Classes */
                    $slider.addClass('loading');

                    /* Set min height */
                    container_height = $container.outerHeight();
                    $container.css('min-height', container_height + 'px');

                    /* Ajax */
                    $.ajax({
                        url: ajax_action.ajaxurl,
                        type: 'post',
                        data: {
                            action: obj['action'],
                            ajax_nonce: ajax_action.ajax_nonce,
                            obj: obj
                        },
                        success: function(result) {

                            if (result == 'Busted!') {
                                location.reload();
                                return false;
                            }
                            var $result = $(result);
                            $result.imagesLoaded({
                                background: false
                            }, function() {

                                $slider.attr('data-pagenum', obj['pagenum']);
                                $slider.removeClass('loading');
                                $container.html($result);
                                $container.css('min-height', '0').find('.ajax-item').addClass('new-item');
                                // Callback function
                                theme.ajax__posts_loaded($container);

                                // Show Posts
                                setTimeout(function() {
                                    $container.find('.ajax-item').addClass('is-active')
                                }, 20);
                                if ($container.find('.ajax-item.finished').length) {
                                    $slider.addClass('end');
                                } else {
                                    $slider.removeClass('end');
                                }
                                if (curr_page != 1) {
                                    $slider.find('.arrow-nav.left').removeClass('disabled');
                                } else {
                                    $slider.find('.arrow-nav.left').addClass('disabled');
                                }
                                if ($slider.hasClass('end')) {
                                    $slider.find('.arrow-nav.right').addClass('disabled');
                                } else {
                                    $slider.find('.arrow-nav.right').removeClass('disabled');
                                }
                            });
                        },
                        error: function(request, status, error) {
                            $slider.attr('data-pagenum', '2');
                            $slider.removeClass('loading');
                            $container.css('height', '100%');
                        }
                    });

                });
            }
        },

        /* ==================================================
          Ajax Load Posts 
        ================================================== */
        ajax__posts_loader: {

            init: function() {

                $(document).on('scroll', theme.ajax__posts_loader.infinity);
                $(document).on('click', '.load-more', theme.ajax__posts_loader.load_more);
                $(document).on('click', '.ajax-filter ul a:not(.is-active)', theme.ajax__posts_loader.filter);
            },

            infinity: function(event) {
                if ($('.infinite-load').length && !$('.infinite-load').hasClass('last-page')) {
                    if ($('.infinite-load').visible(true)) {
                        var $ajax_block = $('.infinite-load').parents('.ajax-grid-block');

                        if ($ajax_block.length && !$ajax_block.hasClass('last-page')) {
                            $ajax_block.addClass('loading-infinite');
                            theme.ajax__posts_loader.get($ajax_block);
                        }
                    }
                }

            },

            load_more: function(event) {
                var $ajax_block = $(this).parents('.ajax-grid-block');
                if ($ajax_block.length) {
                    theme.ajax__posts_loader.get($ajax_block);
                }
                event.preventDefault();
            },

            filter: function(event) {

                event.preventDefault();
                var $this = $(this)
                  , $ajax_block = $this.parents('.ajax-grid-block');

                if (!$ajax_block.length || $ajax_block.data('loading') == true) {
                    return;
                }

                var $filter = $this.parents('.ajax-filter'), filter_data = $.parseJSON($ajax_block.attr('data-filter')), mod_data = null, tax_a, tax_type = 'category_ids', block_h, saved_taxes = null, tax = $(this).attr('data-category_ids');

                if (filter_data["0"] != undefined) {
                    filter_data = filter_data["0"];
                }

                // Check startup taxonomies
                if (!$ajax_block.hasClass('filter-ready')) {
                    if (filter_data.category_ids != '' && filter_data.category_ids != null) {
                        $ajax_block.data('startup-taxes', filter_data.category_ids);
                    } else if (filter_data.category_slugs != '' && filter_data.category_slugs != null) {
                        $ajax_block.data('startup-taxes', filter_data.category_slugs);
                    } else {
                        $ajax_block.data('startup-taxes', null);
                    }
                    $ajax_block.addClass('filter-ready');
                }

                if (filter_data.category_slugs != '' && filter_data.category_slugs != null) {
                    tax_type = 'category_slugs';
                    tax = $(this).attr('data-category_slugs');
                }

                saved_taxes = $ajax_block.data('startup-taxes');

                if (saved_taxes == null) {
                    if (tax == 'all') {
                        filter_data[tax_type] = null;
                    } else {
                        filter_data[tax_type] = tax;
                    }
                } else {
                    if (tax == 'all') {
                        filter_data[tax_type] = saved_taxes;

                    } else {
                        filter_data[tax_type] = tax;
                    }
                }

                mod_data = JSON.stringify(filter_data);

                $ajax_block.attr('data-filter', mod_data);

                // Reset current page
                $ajax_block.data('paged', '1');

                // Clear filters
                $filter.find('ul li a.is-active').removeClass('is-active');

                // Add active Class 
                $this.addClass('is-active');

                // Remove items
                block_h = $ajax_block.find('.ajax-grid').height();
                $ajax_block.find('.ajax-grid').height(block_h);
                $ajax_block.find('.ajax-grid .flex-item').remove();

                // Load posts
                theme.ajax__posts_loader.get($ajax_block);

            },

            get: function(el) {

                if ($(el).data('loading') == true) {
                    return;
                }

                var $this = $(el), opts = $.parseJSON($this.attr('data-opts')), filter = $.parseJSON($this.attr('data-filter')), module_opts, paged = $this.data('paged'), $grid;

                /* Check if posts container exists */
                $grid = $this.find('.ajax-grid');

                if ($grid.length <= 0) {
                    return;
                }

                /* Paged */
                opts['paged'] = paged;

                /* Module opts */
                module_opts = $.parseJSON($grid.attr('data-module-opts'));

                /* Classes */
                $this.addClass('loading').removeClass('loaded last-page');

                $(el).data('loading', true);

                /* Ajax */
                $.ajax({
                    url: ajax_action.ajaxurl,
                    type: 'post',
                    data: {
                        action: opts['action'],
                        ajax_nonce: ajax_action.ajax_nonce,
                        opts: opts,
                        filter: filter,
                        module_opts: module_opts
                    },
                    success: function(result) {

                        if (result == 'Busted!') {
                            location.reload();
                            return false;
                        }

                        var $result = $(result);

                        if (result == 'no_results') {
                            $this.removeClass('loading loading-infinite');
                            $this.addClass('loaded');
                            $this.find('.ajax-grid').css('height', 'auto');
                            $this.data('loading', false);
                            return;
                        }

                        $result.imagesLoaded({
                            background: true
                        }, function() {
                            paged++;
                            $this.data('paged', paged);
                            $this.removeClass('loading loading-infinite');
                            $this.data('loading', false);
                            $grid.append($($result).addClass('flex-new-item'));
                            $.event.trigger({
                                type: "loadmore",
                                container: $grid,
                            });
                            theme.ajax__posts_loaded($grid);
                            $this.find('.ajax-grid').css('height', 'auto');
                            setTimeout(function() {
                                $grid.find('.flex-new-item').addClass('on');

                            }, 100);
                            if ($grid.find('.last-page').length) {
                                // Hide loader
                                $this.addClass('last-page loaded');
                            } else {
                                $this.removeClass('last-page loaded');
                            }
                        });
                    },
                    error: function(request, status, error) {
                        $this.data('paged', '2');
                        $this.removeClass('loading loading-infinite');
                        $(this).data('loading', false);
                        $this.addClass('loaded');
                        $this.find('.ajax-grid').css('height', 'auto');
                    }
                });
            }

        },

        /* ==================================================
          Social Players 
        ================================================== */
        social_players: {

            youtube: function() {
                if ($('.youtube:not(.ready)').length) {

                    $('.youtube:not(.ready)').each(function() {

                        /* Based on the YouTube ID, we can easily find the thumbnail image */
                        var src = 'http://i.ytimg.com/vi/' + this.id + '/maxresdefault.jpg'
                          , cover = $(this).attr('data-cover')
                          , ca = $(this).attr('data-ca');

                        /* Set default click action */
                        if (typeof ca == 'undefined') {
                            ca = 'open_in_player';
                        }

                        /* If image doesn't exists get image from YouTube */
                        if (cover) {
                            $(this).append('<img src="' + cover + '">');
                        } else {
                            $(this).append('<img src="' + src + '">');
                        }

                        /* Add thumb classes */
                        $(this).addClass('thumb thumb-fade ready');

                        /* Overlay the Play icon to make it look like a video player */
                        var icon_layer_template = '' + '<span class="thumb-icon">' + '<svg class="circle-svg" width="60" height="60" viewBox="0 0 50 50">' + '<circle class="circle" cx="25" cy="25" r="23" stroke="#fff" stroke-width="1" fill="none"></circle>' + '</svg>' + '<span class="pe-7s-video"></span>' + '</span>';

                        $(this).append(icon_layer_template);

                        if (ca == 'open_in_player') {
                            $('#' + this.id).on('click', function() {

                                /* Create an iFrame with autoplay set to true */
                                var iframe_url = 'https://www.youtube.com/embed/' + this.id + '?autoplay=1&autohide=1';
                                var $parent = $('#' + this.id).parent();
                                if ($(this).data('params')) {
                                    iframe_url += '&' + $(this).data('params');
                                }

                                /* The height and width of the iFrame should be the same as parent */
                                var iframe = $('<iframe/>', {
                                    'frameborder': '0',
                                    'src': iframe_url,
                                    'width': '1200',
                                    'height': '688'
                                });

                                /* Replace the YouTube thumbnail with YouTube HTML5 Player */
                                $(this).replaceWith(iframe);

                                /* Make movie responsive */
                                if ($.fn.ResIframe) {
                                    $parent.ResIframe();
                                }

                                /* Pause Player */
                                if (typeof sc.scamp_player != 'undefined') {
                                    sc.scamp_player.playerAction('pause');
                                }

                            });
                        }
                    });
                }
            },

            vimeo: function() {
                if ($('.vimeo:not(.ready)').length) {
                    $('.vimeo:not(.ready)').each(function() {

                        var movie = $(this)
                          , id = movie.attr('id')
                          , cover = movie.attr('data-cover')
                          , ca = movie.attr('data-ca');

                         /* Set default click action */
                        if (typeof ca == 'undefined') {
                            ca = 'open_in_player';
                        }

                        /* If image doesn't exists get image from YouTube */
                        if (cover) {
                            movie.append('<img src="' + cover + '">');
                        } else {

                            $.getJSON('http://www.vimeo.com/api/v2/video/' + id + '.json?callback=?', {
                                format: "json"
                            }, function(data) {
                                var src = data[0].thumbnail_large;
                                var src = src.replace("_640.jpg", "_1280x720");
                                movie.append('<img src="' + src + '">');

                            });
                        }

                        /* Add thumb classes */
                        movie.addClass('thumb thumb-fade ready');

                        /* Overlay the Play icon to make it look like a video player */
                        var icon_layer_template = '' + '<span class="thumb-icon">' + '<svg class="circle-svg" width="60" height="60" viewBox="0 0 50 50">' + '<circle class="circle" cx="25" cy="25" r="23" stroke="#fff" stroke-width="1" fill="none"></circle>' + '</svg>' + '<span class="pe-7s-video"></span>' + '</span>';

                        movie.append(icon_layer_template);

                        if (ca == 'open_in_player') {

                            $('#' + id).on('click', function() {

                                /* Create an iFrame with autoplay set to true */
                                var iframe_url = 'https://player.vimeo.com/video/' + id + '?autoplay=1';
                                var $parent = $('#' + this.id).parent();
                                if ($(this).data('params')) {
                                    iframe_url += '&' + $(this).data('params');
                                }

                                /* The height and width of the iFrame should be the same as parent */
                                var iframe = $('<iframe/>', {
                                    'frameborder': '0',
                                    'src': iframe_url,
                                    'width': '1280',
                                    'height': '734'
                                });

                                /* Replace the YouTube thumbnail with YouTube HTML5 Player */
                                $(this).replaceWith(iframe);

                                /* Make movie responsive */
                                if ($.fn.ResIframe) {
                                    $parent.ResIframe();
                                }

                                /* Pause Player */
                                if (typeof sc.scamp_player != 'undefined') {
                                    sc.scamp_player.playerAction('pause');
                                }

                            });
                        }

                    });
                }
            }

        },

        /* ==================================================
          Text Animations 
        ================================================== */
        text_anim: function(container) {

            if ($(container).find(".text-fx").length) {
                $(container).find(".text-fx").each(function() {

                    if (!$(this).hasClass("finished")) {
                        $(this).addClass("finished");
                        var c = $(this).html().replace("<br />", "~");
                        var c = c.replace("<br>", "~");
                        var e = c.split("");
                        var b = "";
                        var a;
                        for (var d = 0; d < e.length; d++) {
                            if (e[d] == " ") {
                                b += " ";
                            } else {
                                if (e[d] == "~") {
                                    b += "<br />";
                                } else {
                                    b += '<p><span class="trans-10" style="-webkit-transition-delay: ' + (d / 32) + "s; transition-delay: " + (d / 32) + 's;">' + e[d] + "</span></p>";
                                }
                            }
                        }
                        $(this).html(b);
                    }
                });
            }
            if ($(container).find(".text-fx-word").length) {
                $(container).find(".text-fx-word").each(function() {

                    if (!$(this).hasClass("finished")) {
                        $(this).addClass("finished");
                        var d = $(this).html().split(" ");
                        var b = "";
                        var a;

                        for (var c = 0; c < d.length; c++) {
                            if (d[c] == " ") {
                                b += " ";
                            } else {
                                if (d[c] == "<br>" || d[c] == "<br />") {
                                    b += "<br />";
                                } else {
                                    b += '<p><span class="trans-15" style="-webkit-transition-delay: ' + (c / 14) + "s; transition-delay: " + (c / 14) + 's;">' + d[c] + "</span></p>";
                                }
                            }
                        }
                        $(this).html(b);
                    }
                });
            }
            if ($(container).find(".text-fx-btn").length) {
                $(container).find(".text-fx-btn .text-fx-btn-x").each(function() {
                    if (!$(this).hasClass("finished")) {
                        $(this).addClass("finished");
                        var c = $(this).html().replace("<br />", "~");
                        var c = c.replace("<br>", "~");
                        var e = c.split("");
                        var b = "";
                        var a;
                        for (var d = 0; d < e.length; d++) {
                            if (e[d] == " ") {
                                b += " ";
                            } else {
                                if (e[d] == "~") {
                                    b += "<br />";
                                } else {
                                    b += '<p><span class="trans-12" style="-webkit-transition-delay: ' + (d / 45) + "s; transition-delay: " + (d / 45) + 's;">' + e[d] + "</span></p>";
                                }
                            }
                        }
                        $(this).html(b);
                    }
                });
            }

        },

        /* ==================================================
          Window Events
        ================================================== */
        window_events: {

            // Vars
            offset: 20,
            adminbar_height: 40,
            hidden_nav: false,
            sticky_top: 0,
            sticky_offset: 150,

            // Methods
            init: function() {

                var header = $('#header');

                /* Sticky Block */
                if ($('.sticky-block').length) {
                    theme.window_events.sticky_top = $('.sticky-block').offset().top;
                }

                /* Disable hidden navigation */
                if (header.hasClass('hide-navigation')) {
                    theme.window_events.hidden_nav = true;
                }

                /* Add fixed position to WP Admin Bar */
                $('#wpadminbar').css('position', 'fixed');

                /* Onepage actions */
                theme.window_events.onepage();

                /* Scroll / Resize Events */
                theme.window_events.scroll_actions();

                new ResizeSensor($('body'),theme.window_events.resize_actions);
                window.addEventListener('scroll', theme.window_events.scroll_actions);

            },

            scroll_actions: function() {
                var st = $(window).scrollTop()
                  , wh = $(window).height()
                  , ww = $(window).width()
                  , header = $('#header')
                  , header_height = header.outerHeight();

                /* WP Header */
                if ($('#wpadminbar').length) {
                    theme.window_events.adminbar_height = $('#wpadminbar').outerHeight();
                }

                /* Show or hide naviagtion background */
                if (theme.window_events.hidden_nav) {
                    if (st > 0) {
                        header.removeClass('hide-navigation');
                    } else {
                        header.addClass('hide-navigation')
                    }
                }

                /* Hero */
                if ($('.post-header.hero .overlay-color').length) {
                    var hero = $('.post-header.hero .hero-image'), overlay = $('.post-header.hero .overlay-color'), opacity, hero_height = hero.height() - 300;
                    if (st <= 0) {
                        opacity = 0;
                    } else if (st <= hero_height) {
                        opacity = 0 + st / hero_height;
                    }
                    overlay.css('opacity', opacity).html(opacity);
                }

                /* Sticky Block */
                if ($('.sticky-block').length && ww > 479) {

                    var sticky_h = $('.sticky-block').outerHeight()
                      , parent_pos = $('.sticky-block').parent().offset().top
                      , parent_h = $('.sticky-block').parent().outerHeight();
                    parent_pos = (parent_pos + parent_h) - sticky_h - theme.window_events.sticky_offset;
                    if (st == 0) {
                        theme.window_events.sticky_top = $('.sticky-block').offset().top;
                    } else if (st >= theme.window_events.sticky_top && st <= parent_pos) {
                        $('.sticky-block').addClass('sticky-js').css({
                            'top': theme.window_events.sticky_offset + 'px'
                        });
                    } else if (st >= parent_pos) {
                        $('.sticky-block').removeClass('sticky-js').css({
                            'top': (parent_h - sticky_h) + 'px'
                        });
                    } else {
                        $('.sticky-block').removeClass('sticky-js').css({
                            'top': '0'
                        });
                    }
                }
            },

            onepage: function() {
                theme.window_events.scroll_onepage();
                window.addEventListener('scroll', theme.window_events.scroll_onepage);
            },

            scroll_onepage: function() {
                var sections = document.querySelectorAll(".one-page-section");
                if (sections.length<=0) {
                    return;
                }

                var first_section = sections[0]
                , last_section = sections[sections.length - 1]
                , header = document.querySelector('#header')
                , header_height = header.getBoundingClientRect().height
                , nav = document.querySelector('#nav-main')
                , offset = theme.window_events.offset
                , cur_pos = $(this).scrollTop()
                , last_pos = last_section.offsetTop + last_section.getBoundingClientRect().height
                , nav_a, selected_nav, id;

                /* WP Header */
                if ($('#wpadminbar').length) {
                    theme.window_events.adminbar_height = $('#wpadminbar').outerHeight();
                }

                /* Add .active class to navigation if
                is over on .section container */
                if (cur_pos < first_section.offsetTop - header_height - offset) {
                    for (var i = 0; i < sections.length; ++i) {
                        sections[i].classList.remove("active");
                    }
                    nav_a = nav.querySelectorAll('a');
                    for (var i = 0; i < nav_a.length; ++i) {
                        nav_a[i].classList.remove("active");
                    }
                } else if (cur_pos > last_pos - header_height - offset) {
                    for (var i = 0; i < sections.length; ++i) {
                        sections[i].classList.remove("active");
                    }
                    nav_a = nav.querySelectorAll('a');
                    for (var i = 0; i < nav_a.length; ++i) {
                        nav_a[i].classList.remove("active");
                    }
                } else {

                    for (var i = 0; i < sections.length; ++i) {
                        var top = sections[i].offsetTop - header_height - offset
                          , bottom = top + sections[i].getBoundingClientRect().height;

                        if (cur_pos >= top && cur_pos <= bottom) {
                            nav_a = nav.querySelectorAll('a');
                            for (var nav_i = 0; nav_i < nav_a.length; ++nav_i) {
                                nav_a[nav_i].classList.remove("active");
                            }
                            for (var section_i = 0; section_i < sections.length; ++section_i) {
                                sections[section_i].classList.remove("active");
                            }
                            sections[i].classList.add('active');
                            id = sections[i].getAttribute('id');
                            selected_nav = nav.querySelector('a[href*="#' + id + '"]');
                            if (selected_nav != null) {
                                selected_nav.classList.add('active');
                            }
                        }
                    }
                }

            },

            resize_actions: function() {
                theme.window_events.scroll_actions();
            }

        },

        /* ==================================================
          Vendors Plugins
        ================================================== */
        plugins: {

            reset: function() {

                /* Waypoints */
                if ($.fn.waypoints) {
                    setTimeout(function() {
                        $.waypoints('refresh');
                        $.waypoints('destroy');
                    }, 400)
                }

                /* Isotope */
                if ($.fn.isotope) {
                    if ($('.masonry').data('isotope')) {
                        $('.masonry').isotope('destroy');
                    }
                    if ($('.items').data('isotope')) {
                        $('.items').isotope('destroy');
                    }
                }
            },

            ResIframe: function() {
                $('body').ResIframe();
            },

            Lazy: function() {

                if ($('body').hasClass('lazyload')) {
                    setTimeout(function() {
                        $('.lazy').Lazy({

                            // your configuration goes here
                            scrollDirection: 'vertical',
                            visibleOnly: true,
                            threshold: 0,
                            afterLoad: function(element) {

                                $(element).addClass('lazy-done');
                            },
                        });
                    }, 100);

                }

            },

            theiaStickySidebar: function() {
                if (typeof $.fn.theiaStickySidebar != 'undefined' && $('.sticky-sidebars .sidebar').length) {

                    $('.sticky-sidebars .sidebar').each(function(i) {

                        var id = 'sticky-sidebar-' + i
                          , offset = 0
                          , nav_height = $('.header').outerHeight()
                          , additional_margin = theme.window_events.admin_bar_height + nav_height;

                        $(this).attr('id', id);

                        $('#' + id).theiaStickySidebar({
                            // Settings
                            additionalMarginTop: additional_margin
                        });

                    });

                }
            },

            disqus: function() {
                if ($('#disqus_thread').length) {
                    var disqus_identifier = $('#disqus_thread').attr('data-post_id')
                      , disqus_shortname = $('#disqus_thread').attr('data-disqus_shortname')
                      , disqus_title = $('#disqus_title').text()
                      , disqus_url = window.location.href;
                    /* * * Disqus Reset Function * * */
                    if (typeof DISQUS != 'undefined') {
                        DISQUS.reset({
                            reload: true,
                            config: function() {
                                this.page.identifier = disqus_identifier;
                                this.page.url = disqus_url;
                                this.page.title = disqus_title;
                            }
                        });
                    } else {
                        var dsq = document.createElement('script');
                        dsq.type = 'text/javascript';
                        dsq.async = true;
                        dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
                        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
                    }
                }
            }

        }

    }

}(jQuery));
