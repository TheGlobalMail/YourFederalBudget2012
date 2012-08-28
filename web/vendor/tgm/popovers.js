!function ($) {
    'use strict';

    $.fn.simplePopover = function(options) {
        var settings, timeoutId;

        switch (options) {
            case 'hide':
                this.each(function() {
                    $(this).data('hide')();
                });
                break;
            default:
                settings = {
                    actionToActivatePopover: 'hover', // can be 'click' or 'hover'
                    hide: function($link, $popover) {
                        $popover.hide(); 
                    },
                    nextPopoverSelector: '.popover',
                    show: function($link, $popover) {
                        $popover.fadeIn();
                    },
                    stickyDelay: 200
                };
                $.extend(settings, options);

                this.each(function() {
                    var $link = $(this);
                    var $popover = $link.next(settings.nextPopoverSelector);
                    var showing = false;
                    var show = function() {
                        if ($popover.is(':visible')) {
                            clearTimeout(timeoutId);
                        } else {
                            showing = true;
                            settings.show($link, $popover);
                        }
                    };
                    var hide = function() {
                        showing = false;
                        settings.hide($link, $popover); 
                    };
                    var eventuallyHide = function() {
                        timeoutId = setTimeout(hide, settings.stickyDelay);
                    };
                    $link.data({
                        show: show,
                        hide: hide
                    });
                    switch (settings.actionToActivatePopover) {
                        case 'click':
                            $link.click(function() {
                                if (showing === true) {
                                    hide();
                                } else {
                                    show();
                                }
                            });
                            $link.hover(function() {
                                if (showing === true) show();
                            }, eventuallyHide);
                            $popover.hover(show, eventuallyHide);
                            break;
                        case 'hover':
                            $link.hover(show, eventuallyHide);
                            $popover.hover(show, eventuallyHide);
                            break;
                        default:
                            throw 'Unknown action to actionToActivatePopovere popover: ' + settings.actionToActivatePopover;
                    }
                });

                return this;
        }
    };

    $.fn.arrowPopover = function(options) {
        var settings, timeoutId;

        function hide($link, $popover) {
            TGM.vent.publish('popover:hide', [$link]);
            $popover.fadeOut(settings.fadeOutMilliseconds, function() {
                $popover.removeClass('top right bottom left');
            });
        }

        function show($link, $popover) {
            var cssPlacement, linkOffset = $link.offset(), popoverOffset;
            $popover.appendTo('body');

            switch (settings.placement) {
                case 'smart-top':
                    var popOverTopPos = linkOffset.top - $popover.outerHeight();
                    var windowTopPos = $(document).scrollTop();
                    cssPlacement = popOverTopPos < windowTopPos ? 'bottom' : 'top';
                    break;

                case 'smart-bottom':
                    var popOverBottomPos = linkOffset.top + $popover.outerHeight();
                    var windowBottomPos = $(document).scrollTop() + $(window).height();
                    cssPlacement = popOverBottomPos > windowBottomPos ? 'top' : 'bottom';
                    break;
                default:
                    cssPlacement = settings.placement;
            }

            switch (cssPlacement) {
                case 'top':
                    popoverOffset = {
                        left: linkOffset.left + $link.width() / 2 - $popover.width() / 2,
                        top: linkOffset.top - $popover.height()
                    };
                    break;
                case 'right':
                    popoverOffset = {
                        left: linkOffset.left + $link.width(),
                        top: linkOffset.top + $link.height() / 2 - $popover.height() / 2
                    };
                    break;
                case 'bottom':
                    popoverOffset = {
                        left: linkOffset.left + $link.width() / 2 - $popover.width() / 2,
                        top: linkOffset.top + $link.height()
                    };
                    break;
                case 'left':
                    popoverOffset = {
                        left: linkOffset.left - $popover.width(),
                        top: linkOffset.top + $link.height() / 2 - $popover.height() / 2
                    }
                    break;
                default:
                    throw 'Invalid placement';
            }

            $popover.css(popoverOffset).addClass(cssPlacement).fadeIn(settings.fadeInMilliseconds);
            TGM.vent.publish('popover:show', [$link]);
        }

        // init
        settings = {
            actionToActivatePopover: 'hover',
            fadeInMilliseconds: 200,
            fadeOutMilliseconds: 100,
            placement: 'smart-bottom',
            stickyDelay: 200
        };
        $.extend(settings, options);

        this.each(function() {
            $(this).simplePopover({
                actionToActivatePopover: settings.actionToActivatePopover,
                hide: hide,
                show: show
            });
        });

        return this;
    }
}(window.jQuery);