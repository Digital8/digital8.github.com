
$(window).load(function(){
	// preloader
	$("#preloader").each(function(){
		var preloader = $(this);
		
		// complete first part
		$("#loader .first .progress").stop(true).animate({
			width: "100%"
		}, 1000, function(){
			
			// complete middle part
			$("#loader .middle .progress").stop(true).animate({
				width: "100%"
			}, 500, function(){
				
				// complete last part
				$("#loader .last .progress").stop(true).animate({
					width: "100%"
				}, 1000, function(){
					preloader.delay(150).fadeOut(150);
					
					if ($("body").width() <= 320){
						$('html, body').delay(300).animate({scrollTop:0}, 0);
					}
				});
			});
		});
	});
});


$(document).ready(function(){

	//i hate ppl right clicking on stuff
	$(document).bind("contextmenu", function(event) {
		//event.preventDefault();
    //return false;
  });


	// preloader
	$("#preloader").each(function(){
		// start first part
		$("#loader .first .progress").animate({
			width: "100%"
		}, 25000);
	});
	
	
	
	
	// menu anchor links
	$("a.anchor").on("click", function(){
		var parent = $(this).parent("li"),
			target = $($(this).attr("href"));
		
		// if menu link
		if (parent != null){
			$("#menu li.active").removeClass("active");
			
			parent.addClass("active");
		}
		
		$("html, body").animate({
			scrollTop: target.offset().top
		}, 600);
		
		return false;
	});
	
	
	
	
	// our work slider
	
	$("#work .slideshow").flexslider({
		animation: "slide"
	});
	

	
	// prototyping bubbles
	throttled = _.throttle(function(){
		var windowPosition = $(window).scrollTop();
		var offset = $('#prototyping').offset().top;
		var height = $('#prototyping').height();

		$("#prototyping .background .layer-01, #jeff").animate({
			'top':((windowPosition + height - offset) * -0.5) + "px"
		}, {queue:false, easing: 'easeOutExpo'});
		
		$("#prototyping .background .layer-02").animate({
			'top':((windowPosition + height - offset) * -1.5) + "px"
		}, {queue:false, easing: 'easeOutQuart'});
	}, 20);
	
	$(window).on("scroll", throttled);
	
	// in field labels
	$("label").inFieldLabels();
	
	
	
	
	// contact form
	function validateEmail(email){ 
	    var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	    return reg.test(email);
	}
	
	$("#contact-form").submit(function(){
		var name = $("#contact-name"),
			email = $("#contact-email"),
			phone = $("#contact-phone"),
			message = $("#contact-message");
		
		// validation
		var error = false;
		
		// name
		if (name.val() == '' || name.val() == null){
			error = true;
			
			$("+ .validation", name).remove();
			name.after("<span class='validation'>Please enter your name</span>");
		}
		
		else {
			$("+ .validation", name).remove();
		}
		
		// email
		if (email.val() == '' || email.val() == null){
			error = true;
			
			$("+ .validation", email).remove();
			email.after("<span class='validation'>Please enter your email</span>");
		}
		
		else if (!validateEmail(email.val())){
			error = true;
			
			$("+ .validation", email).remove();
			email.after("<span class='validation'>Please enter a valid email</span>");
		}
		
		else {
			$("+ .validation", email).remove();
		}
		
		// message
		if (message.val() == '' || message.val() == null){
			error = true;
			
			$("+ .validation", message).remove();
			message.after("<span class='validation'>Please enter your message</span>");
		}
		
		else {
			$("+ .validation", message).remove();
		}
		
		// error
		if (error){
			return false;
		}
		
		else {
			// build data
			var data = new FormData();
			
			data.append("Name", name.val());
			data.append("Email", email.val());
			data.append("Phone", phone.val());
			data.append("message", message.val());
			
			// send
			$.ajax({
				url: "mailer.php",
				data: data,
				processData: false,
				contentType: false,
				type: "POST",
				success: function(data){
					var response = jQuery.parseJSON(data);
					
					// error
					if (response['status'] == 500){
						notify("There was an error with your form. Please try again.", "error");
					}
					
					// success
					if (response['status'] == 200){
						notify("Thanks for your message! You'll be hearing from me soon :)", "success");
					}
					
				}
			});
			
			// clear form
			name.val("").change().blur();
			email.val("").change().blur();
			phone.val("").change().blur();
			message.val("").change().blur();
			
			$("+ .validation", name).remove();
			$("+ .validation", email).remove();
			$("+ .validation", message).remove();
		}
		
		return false;
	});
	
	function notify(message, status){
		$("#alert .alert-message").html(message);
		$("#alert").addClass("status").fadeIn(150);
	}
	
	
	
	
	// window overlay
	$(".window-overlay").each(function(){
		var overlay = $(this),
			modal = $(".modal", this);
		
		// fade out on click
		overlay.on("click", function(){
			overlay.fadeOut(150);
		});
		
		modal.on("click", function(){
			event.stopPropagation();
		});
		
		// modal close button
		$(".modal-close", overlay).on("click", function(){
			overlay.fadeOut(150);
			
			return false;
		});
	});
	
	$(".launch-modal").on("click", function(){
		// get target
		var href = $(this).attr("href");
		
		$(href).fadeIn(150);
		
		return false;
	});
	
	// positon modals
	positionModals();
	
	$(window).on("resize", function(){
		positionModals();
	});
	
	function positionModals(){
		$(".window-overlay").each(function(){
			var overlay = $(this),
				modal = $(".modal", this),
				visible = overlay.is(":visible");
			
			// vertically center modal within window
			overlay.show();
			
			var top = (modal.height() / 2 * -1) + "px",
				left = (modal.width() / 2 * -1) + "px";
			
			modal.css({
				"margin-top": top,
				"margin-left": left,
			});
			
			if (!visible){
				overlay.hide();
			}
		});
	}
	
	
	//hax
	crapTimer = null;
	function cleanUpCrap() {
		$("div").each(function() {
	    // go through each element
	    var zindex = parseInt($(this).css("zIndex"), 10);
	    if(zindex > 10000) {
	       $(this).css({display:'none'});
	       clearInterval(crapTimer);
	    }
		});
	}
	
	// google map
	var map;
	var office = new google.maps.LatLng(-27.466056, 153.030463);
	
	var MY_MAPTYPE_ID = 'custom_style';
	
	function initialize() {
		var featureOpts = [{
			featureType: 'all',
			elementType: 'labels.text.fill',
			stylers: [{
				color: '#496000'
			}]
		},{
			featureType: 'all',
			elementType: 'labels.text.stroke',
			stylers: [{
				visibility: 'off'
			}]
		},{
			featureType: 'all',
			elementType: 'labels.icon',
			stylers: [{
				visibility: 'off',
			}]
		},{
			featureType: 'all',
			elementType: 'geometry.stroke',
			stylers: [{
				visibility: 'off'
			}]
		},{
			featureType: 'landscape',
			elementType: 'geometry',
			stylers: [{
				color: '#a2d600'
			}]
		},{
			featureType: 'landscape',
			elementType: 'geometry.fill',
			stylers: [{
				color: '#a2d600'
			}]
		},{
			featureType: 'water',
			elementType: 'geometry',
			stylers: [{
				color: '#92c100'
			}]
		},{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [{
				color: '#b1e900'
			}]
		},{
			featureType: 'transit',
			elementType: 'geometry',
			stylers: [{
				color: '#739700'
			}]
		},{
			featureType: 'poi',
			elementType: 'geometry',
			stylers: [{
				color: '#86b000'
			}]
		}];
		
		var mapOptions = {
			backgroundColor: '#b1e900',
			disableDefaultUI: true,
			draggable: false,
			scrollwheel: false,
			zoom: 16,
			center: office,
			mapTypeId: MY_MAPTYPE_ID
		};
		
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
		var styledMapOptions = {
			name: 'Custom Style'
		};
		
		var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
		
		map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
		
		var marker = new google.maps.Marker({
			position: office,
			map: map,
			icon: 'images/icons/map-pin.png'
		});

		//keep calling thing
		crapTimer = setInterval(cleanUpCrap, 100);
	}
	
	google.maps.event.addDomListener(window, 'load', initialize);

});
