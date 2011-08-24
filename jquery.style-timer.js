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

	var defineStyle = function(jNode,style,options) {
			$(Object.keys(style)).each(function() {
				jNode.css(''+this,style[''+this]);
			});
	}

	var stripAnimate = function(style)
	{
		var return_object = {};
		$(Object.keys(style)).each(function() {
			if( ''+this !== 'animate_style' )
			{
				return_object[''+this] = style[''+this];
			}
		});
		return return_object;
	};

	var applyStyle = function(jNode,style,options) {
		if( options.animate !== false )
		{
			var animate_style = style
				,animate_callback = function() {};
			if( typeof(style.animate_style) !== 'undefined' ) {
				animate_style = style.animate_style;
				animate_callback = function() {
					defineStyle(jNode,stripAnimate(style),options);
				}
			}
			jNode.animate(animate_style,options.animate_interval,animate_callback);
		} else {
			defineStyle.apply(null,arguments);
		}
	};

	var applyTransition = function(jNode,transition,options) {
		if( typeof(transition) === 'function' )
		{
			transition.apply(null,arguments);
		} else if( Object.keys(transition).length > 0 ) {
			applyStyle.apply(null,arguments);
		}
	};

	$.fn.hoverStyleTimer = function(options) {

		var defaults = {
			timeAfterHoverOff : 5,		// the padding time after hover off
			onHoverOn : {},				// style must be set
			onHoverOff : {},			// style must be set
			animate : false,			// animate styles
			animate_interval : 'slow',	// takes any valid animate interval argument
			onTransition : {},			// transitional style or handler
			onTick : {}					// tick style or handler
		};

		var options = $.extend({},defaults,options);

		this.each(function() {
			$(this).hover(
				function() {
					resetStyleTimer($(this));
					applyTransition($(this),options.onHoverOn,options);
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
								applyTransition($(this),options.onTick,options);
							} else {
								resetStyleTimer($(this));
								// reset style
								applyTransition($(this),options.onHoverOff,options);
							}
						}.bind(this),1000));
						// set timer
						$(this).data('hide_timer',options.timeAfterHoverOff);
						// apply transitional style/callback
						applyTransition($(this),options.onTransition,options);
					}
				}
			);
		});

		// return jq object for chaining
		return this;
	};

})( jQuery );
