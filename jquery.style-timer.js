/*
* Graceful Hover Style Timer
* 
* jQuery plugin to gracefully and accurately set a timer that pads the time from one
* style change to another after hover off
*
* Author: Ryan Bales <thinkt4nk@gmail.com>, 2011
*/
(function($) {

	var resetStyleTimer = function(jNode) {
		// del timer
		jNode.removeData('hide_timer');
		// del interval handler
		clearInterval(jNode.data('interval_id'));
		// del interval id from data
		jNode.removeData('interval_id');
	};

	var applyStyle = function(jNode,style) {
		$(Object.keys(style)).each(function() {
			jNode.css(''+this,style[''+this]);
		});
	};

	$.fn.hoverStyleTimer = function(options) {

		var defaults = {
			timeAfterHoverOff : 5,		// the padding time after hover off
			onHoverOn : {},				// style must be set
			onHoverOff : {},			// style must be set
		};

		var options = $.extend({},defaults,options);

		this.each(function() {
			$(this).hover(
				function() {
					resetStyleTimer($(this));
					applyStyle($(this),options.onHoverOn);
				},
				function() {
					if( typeof($(this).data('hide_timer')) === 'undefined' )
					{
						// start second timer
						$(this).data('interval_id',setInterval(function() {
							var timer_tick = $(this).data('hide_timer');
							if( timer_tick > 0 )
							{
								// tick
								$(this).data('hide_timer',timer_tick - 1);
							} else {
								resetStyleTimer($(this));
								// reset style
								applyStyle($(this),options.onHoverOff);
							}
						}.bind(this),1000));
						// set timer
						$(this).data('hide_timer',options.timeAfterHoverOff);
					}
				}
			);
		});

		// return jq object for chaining
		return this;
	};

})( jQuery );
