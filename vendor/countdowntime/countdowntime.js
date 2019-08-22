(function ($) {
    "use strict";

    $.fn.extend({ 

      countdown100: function(options) {
        var defaults = {
          counterTimes: 0,
          endtimeDate: 0,
          endtimeHours: 0,
          endtimeMinutes: 0,
          endtimeSeconds: 0
        }

        var options =  $.extend(defaults, options);

        return this.each(function() {
          var obj = $(this);
          var timeNow = new Date();
          var counterTimes = options.counterTimes;
          var endDate = options.endtimeDate;
          var endHours = options.endtimeHours;
          var endMinutes = options.endtimeMinutes;
          var endSeconds = options.endtimeSeconds;

          var deadline = new Date(endDate, endHours, endMinutes, endSeconds);

          if(Date.parse(deadline) < Date.parse(timeNow)) {
            var deadline = new Date(Date.parse(new Date()) + endDate * 24 * 60 * 60 * 1000 + endHours * 60 * 60 * 1000 + endMinutes * 60 * 1000 + endSeconds * 1000); 
          }
          
          var t = Date.parse(deadline) - Date.parse(new Date());

		  var count = 0;
		  var winner = '';
 
          var clock = $(obj).FlipClock(t/1000, {
            countdown: true,
            callbacks: {
              stop: function() {

                counterTimes--;

                if($('.wait').length){
                  $('.wait').remove();
                }

                count++;

                if(counterTimes >= 1) {

					$.ajax({
						url: 'https://conference.phprs.com.br/api/sorteio/sortear',	
						method: 'GET',
						dataType: 'json',
						success: function(response) {
							console.log(response.first_name + ' ' + response.last_name);
							winner = response.first_name + ' ' + response.last_name;
							
							animation(winner);

							$('.list').append('<li>'+ count +'º '+ winner +'</li>');
		  
							setTimeout(function(){
							  clock.setTime(t/1000);
							  clock.start();
							}, 1000);
						},
						error: function(response) {
							console.log('Erro ao se comunicar');
						}
					});

                } else {
					$.ajax({
						url: 'https://conference.phprs.com.br/api/sorteio/sortear',	
						method: 'GET',
						dataType: 'json',
						success: function(response) {
							console.log(response.first_name + ' ' + response.last_name);
							winner = response.first_name + ' ' + response.last_name;
							animation(winner);
							$('.list').append('<li>'+ count +'º '+ winner +'</li>');
						},
						error: function(response) {
							console.log('Erro ao se comunicar');
						}
					});
                }
              }
            },
          });

          function animation(nome) {
            $(".overlay").fadeIn();
            $(".title").html('');
            $(".title:nth-child(1)").html('Parabéns');
            $(".title:nth-child(2)").html(nome);

            $(".title").lettering();
            var title1 = new TimelineMax();
            title1.to(".title", 0.2, {visibility: 'visible' , opacity: 1})
            title1.staggerFromTo(".title span", 0.5, 
            {ease: Back.easeOut.config(1.7), opacity: 0, bottom: -80},
            {ease: Back.easeOut.config(1.7), opacity: 1, bottom: 0}, 0.05);
            setTimeout(function(){
              title1.to(".title", 0.2, {visibility: 'hidden' ,opacity: 0})  
              $(".overlay").fadeOut();
            }, 10000);
            
          }
        });
      }
    });

})(jQuery);