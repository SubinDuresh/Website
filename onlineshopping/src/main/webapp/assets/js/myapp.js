$(function() {
	
	// for adding a loader
	$(window).load(function(){
		setTimeout(function() {
			$(".se-pre-con").fadeOut("slow");
		}, 500);			
	});	
	
	// for handling CSRF token
	var token = $('meta[name="_csrf"]').attr('content');
	var header = $('meta[name="_csrf_header"]').attr('content');
	
	if((token!=undefined && header !=undefined) && (token.length > 0 && header.length > 0)) {		
		// set the token header for the ajax request
		$(document).ajaxSend(function(e, xhr, options) {			
			xhr.setRequestHeader(header,token);			
		});				
	}
	
	
	
	// solving the active menu problem
	switch (menu) {

	case 'About Us':
		$('#about').addClass('active');
		break;
	case 'Contact Us':
		$('#contact').addClass('active');
		break;
	case 'All Products':
		$('#listProducts').addClass('active');
		break;
	case 'Product Management':
		$('#manageProduct').addClass('active');
		break;
	case 'Shopping Cart':
		$('#userModel').addClass('active');
		break;		
	default:
		if (menu == "Home")
			break;
		$('#listProducts').addClass('active');
		$('#a_' + menu).addClass('active');
		break;
	}

	// code for jquery dataTable
	var $table = $('#productListTable');

	// execute the below code only where we have this table
	if ($table.length) {
		// console.log('Inside the table!');

		var jsonUrl = '';
		if (window.categoryId == '') {
			jsonUrl = window.contextRoot + '/json/data/all/products';
		} else {
			jsonUrl = window.contextRoot + '/json/data/category/'
					+ window.categoryId + '/products';
		}

		$table
				.DataTable({

					lengthMenu : [ [ 3, 5, 10, -1 ],
							[ '3 Records', '5 Records', '10 Records', 'ALL' ] ],
					pageLength : 5,
					ajax : {
						url : jsonUrl,
						dataSrc : ''
					},
					columns : [
							{
								data : 'code',
								bSortable : false,
								mRender : function(data, type, row) {

									return '<img src="' + window.contextRoot
											+ '/resources/images/' + data
											+ '.jpg" class="dataTableImg"/>';

								}
							},
							{
								data : 'name'
							},
							{
								data : 'brand'
							},
							{
								data : 'unitPrice',
								mRender : function(data, type, row) {
									return '&#8377; ' + data
								}
							},
							{
								data : 'quantity',
								mRender : function(data, type, row) {

									if (data < 1) {
										return '<span style="color:red">Out of Stock!</span>';
									}

									return data;

								}
							},
							{
								data : 'id',
								bSortable : false,
								mRender : function(data, type, row) {

									var str = '';
									str += '<a href="'
											+ window.contextRoot
											+ '/show/'
											+ data
											+ '/product" class="btn btn-primary"><span class="glyphicon glyphicon-eye-open"></span></a> &#160;';

									
									if(userRole !== 'ADMIN') {
										if (row.quantity < 1) {
											str += '<a href="javascript:void(0)" class="btn btn-success disabled"><span class="glyphicon glyphicon-shopping-cart"></span></a>';
										} else {
	
											str += '<a href="'
													+ window.contextRoot
													+ '/cart/add/'
													+ data
													+ '/product" class="btn btn-success"><span class="glyphicon glyphicon-shopping-cart"></span></a>';
										}
									}
									else {
										str += '<a href="'
											+ window.contextRoot
											+ '/manage/'
											+ data
											+ '/product" class="btn btn-warning"><span class="glyphicon glyphicon-pencil"></span></a>';
									}
									
									return str;

								}

							} ]
				});
	}

	
	
	// list of all products for admin
	var $productsTable = $('#productsTable');
	
	
	if($productsTable.length) {
		
		var jsonUrl = window.contextRoot + '/json/data/admin/all/products';
		console.log(jsonUrl);
		
		$productsTable.DataTable({
					lengthMenu : [ [ 10, 30, 50, -1 ], [ '10 Records', '30 Records', '50 Records', 'ALL' ] ],
					pageLength : 30,
					ajax : {
						url : jsonUrl,
						dataSrc : ''
					},
					columns : [		
					           	{data: 'id'},


					           	{data: 'code',
					           	 bSortable: false,
					           		mRender: function(data,type,row) {
					           			return '<img src="' + window.contextRoot
										+ '/resources/images/' + data
										+ '.jpg" class="dataTableImg"/>';					           			
					           		}
					           	},
					           	{
									data : 'name'
								},
								{
									data : 'brand'
								},
								{
									data : 'quantity',
									mRender : function(data, type, row) {

										if (data < 1) {
											return '<span style="color:red">Out of Stock!</span>';
										}

										return data;

									}
								},
								{
									data : 'unitPrice',
									mRender : function(data, type, row) {
										return '&#8377; ' + data
									}
								},
								{
									data : 'active',
									bSortable : false,
									mRender : function(data, type, row) {
										var str = '';
										if(data) {											
											str += '<label class="switch"> <input type="checkbox" value="'+row.id+'" checked="checked">  <div class="slider round"> </div></label>';
											
										}else {
											str += '<label class="switch"> <input type="checkbox" value="'+row.id+'">  <div class="slider round"> </div></label>';
										}
										
										return str;
									}
								},
								{
									data : 'id',
									bSortable : false,
									mRender : function(data, type, row) {

										var str = '';
										str += '<a href="'
												+ window.contextRoot
												+ '/manage/'
												+ data
												+ '/product" class="btn btn-primary"><span class="glyphicon glyphicon-pencil"></span></a> &#160;';

										return str;
									}
								}					           	
					],
					
					
					initComplete: function () {
						var api = this.api();
						api.$('.switch input[type="checkbox"]').on('change' , function() {							
							var dText = (this.checked)? 'You want to activate the Product?': 'You want to de-activate the Product?';
							var checked = this.checked;
							var checkbox = $(this);
							debugger;
						    bootbox.confirm({
						    	size: 'medium',
						    	title: 'Product Activation/Deactivation',
						    	message: dText,
						    	callback: function (confirmed) {
							        if (confirmed) {
							            $.ajax({							            	
							            	type: 'GET',
							            	url: window.contextRoot + '/manage/product/'+checkbox.prop('value')+'/activation',
							        		timeout : 100000,
							        		success : function(data) {
							        			bootbox.alert(data);							        										        			
							        		},
							        		error : function(e) {
							        			bootbox.alert('ERROR: '+ e);
							        			//display(e);
							        		}						            	
							            });
							        }
							        else {							        	
							        	checkbox.prop('checked', !checked);
							        }
						    	}
						    });																											
						});
							
					}
				});
	}
	
	
	
	
	// jQuery Validation Code

	//methods required for validation
	
	function errorPlacement(error, element) {
		// Add the 'help-block' class to the error element
		error.addClass("help-block");
		
		// add the error label after the input element
		error.insertAfter(element);
		
		
		// add the has-feedback class to the
		// parent div.validate in order to add icons to inputs
		element.parents(".validate").addClass("has-feedback");	

	}	
	
	
	
	// validating the product form element	
	// fetch the form element
	$categoryForm = $('#categoryForm');
	
	if($categoryForm.length) {
		
		$categoryForm.validate({			
				rules: {
					name: {
						required: true,
						minlength: 3
					},
					description: {
						required: true,
						minlength: 3					
					}				
				},
				messages: {					
					name: {
						required: 'Please enter product name!',
						minlength: 'Please enter atleast five characters'
					},
					description: {
						required: 'Please enter product name!',
						minlength: 'Please enter atleast five characters'
					}					
				},
				errorElement : "em",
				errorPlacement : function(error, element) {
					errorPlacement(error, element);
				}				
			}
		
		);
		
	}
	
	/*validating the loginform*/
	
	// validating the product form element	
	// fetch the form element
	$loginForm = $('#loginForm');
	
	if($loginForm.length) {
		
		$loginForm.validate({			
				rules: {
					username: {
						required: true,
						email: true
						
					},
					password: {
						required: true
					}				
				},
				messages: {					
					username: {
						required: 'Please enter your email!',
						email: 'Please enter a valid email address!'
					},
					password: {
						required: 'Please enter your password!'
					}					
				},
				errorElement : "em",
				errorPlacement : function(error, element) {
					// Add the 'help-block' class to the error element
					error.addClass("help-block");
					
					// add the error label after the input element
					error.insertAfter(element);
				}				
			}
		
		);
		
	}
		
	
	
	/*------*/
	/* for fading out the alert message after 3 seconds */
	$alert = $('.alert');
	if($alert.length) {
		setTimeout(function() {
	    	$alert.fadeOut('slow');
		   }, 3000
		);		
	}
		
	/*------*/
	/* handle refresh cart*/	
	$('button[name="refreshCart"]').click(function(){
		var cartLineId = $(this).attr('value');
		var countField = $('#count_' + cartLineId);
		var originalCount = countField.attr('value');
		// do the checking only the count has changed
		if(countField.val() !== originalCount) {	
			// check if the quantity is within the specified range
			if(countField.val() < 1 || countField.val() > 3) {
				// set the field back to the original field
				countField.val(originalCount);
				bootbox.alert({
					size: 'medium',
			    	title: 'Error',
			    	message: 'Product Count should be minimum 1 and maximum 3!'
				});
			}
			else {
				// use the window.location.href property to send the request to the server
				var updateUrl = window.contextRoot + '/cart/' + cartLineId + '/update?count=' + countField.val();
				window.location.href = updateUrl;
			}
		}
	});			
});



/*OTHER ANIMATIONS*/


/*!

=========================================================
* Now-ui-kit - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-kit
* Copyright 2017 Creative Tim (http://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-kit/blob/master/LICENSE.md)

* Designed by www.invisionapp.com Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

var transparent = true;

var transparentDemo = true;
var fixedTop = false;

var navbar_initialized,
   backgroundOrange = false,
   toggle_initialized = false;

$(document).ready(function(){
   //  Activate the Tooltips
   $('[data-toggle="tooltip"], [rel="tooltip"]').tooltip();

   // Activate Popovers and set color for popovers
   $('[data-toggle="popover"]').each(function(){
       color_class = $(this).data('color');
       $(this).popover({
           template: '<div class="popover '+ color_class +' " role="tooltip"><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
       });
   });

   $navbar = $('.navbar[color-on-scroll]');
   scroll_distance = $navbar.attr('color-on-scroll') || 500;

   // Check if we have the class "navbar-color-on-scroll" then add the function to remove the class "navbar-transparent" so it will transform to a plain color.

   if($('.navbar[color-on-scroll]').length != 0){
       nowuiKit.checkScrollForTransparentNavbar();
       $(window).on('scroll', nowuiKit.checkScrollForTransparentNavbar)
   }

   $('.form-control').on("focus", function(){
       $(this).parent('.input-group').addClass("input-group-focus");
   }).on("blur", function(){
       $(this).parent(".input-group").removeClass("input-group-focus");
   });

   // Activate bootstrapSwitch
   $('.bootstrap-switch').each(function(){
       $this = $(this);
       data_on_label = $this.data('on-label') || '';
       data_off_label = $this.data('off-label') || '';

       $this.bootstrapSwitch({
           onText: data_on_label,
           offText: data_off_label
       });
   });

   if( $(window).width() < 992 ){
       nowuiKit.initRightMenu();
   }

   if ($(window).width() >= 992){
       big_image = $('.page-header-image[data-parallax="true"]');

       $(window).on('scroll', nowuiKitDemo.checkScrollForParallax);
   }

   // Activate Carousel
	$('.carousel').carousel({
       interval: 4000
   });

   $('.date-picker').each(function(){
       $(this).datepicker({
           templates:{
               leftArrow: '<i class="now-ui-icons arrows-1_minimal-left"></i>',
               rightArrow: '<i class="now-ui-icons arrows-1_minimal-right"></i>'
           }
       }).on('show', function() {
               $('.datepicker').addClass('open');

               datepicker_color = $(this).data('datepicker-color');
               if( datepicker_color.length != 0){
                   $('.datepicker').addClass('datepicker-'+ datepicker_color +'');
               }
           }).on('hide', function() {
               $('.datepicker').removeClass('open');
           });
   });


});

$(window).resize(function(){
   if( $(window).width() < 992 ){
       nowuiKit.initRightMenu();
   }
});

nowuiKit = {
   misc:{
       navbar_menu_visible: 0
   },

   checkScrollForTransparentNavbar: debounce(function() {
           if($(document).scrollTop() > scroll_distance ) {
               if(transparent) {
                   transparent = false;
                   $('.navbar[color-on-scroll]').removeClass('navbar-transparent');
               }
           } else {
               if( !transparent ) {
                   transparent = true;
                   $('.navbar[color-on-scroll]').addClass('navbar-transparent');
               }
           }
   }, 17),

   initRightMenu: function(){
       if(!toggle_initialized){
           $toggle = $('.navbar-toggler');

           $toggle.click(function (){
               if(nowuiKit.misc.navbar_menu_visible == 1) {
                   $('html').removeClass('nav-open');
                  nowuiKit.misc.navbar_menu_visible = 0;
                   setTimeout(function(){
                      $toggle.removeClass('toggled');
                      $('#bodyClick').remove();
                  }, 550);

               } else {

                  setTimeout(function(){
                      $toggle.addClass('toggled');
                  }, 580);

                  $navbar = $(this).parent('.navbar-translate').siblings('.navbar-collapse');
                  background_image = $navbar.data('nav-image');
                  if(background_image != undefined){
                     $navbar.css('background',"url('" + background_image + "')")
                            .removeAttr('data-nav-image')
                            .css('background-size',"cover")
                            .addClass('has-image');
                  }

                  div = '<div id="bodyClick"></div>';
                  $(div).appendTo('body').click(function() {
                      $('html').removeClass('nav-open');
                      nowuiKit.misc.navbar_menu_visible = 0;
                       setTimeout(function(){
                          $toggle.removeClass('toggled');
                          $('#bodyClick').remove();
                       }, 550);
                  });

                 $('html').addClass('nav-open');
                  nowuiKit.misc.navbar_menu_visible = 1;

               }
           });
           toggle_initialized = true;
       }
   },

   initSliders: function(){
       // Sliders for demo purpose in refine cards section
       var slider = document.getElementById('sliderRegular');

       noUiSlider.create(slider, {
           start: 40,
           connect: [true,false],
           range: {
               min: 0,
               max: 100
           }
       });

       var slider2 = document.getElementById('sliderDouble');

       noUiSlider.create(slider2, {
           start: [ 20, 60 ],
           connect: true,
           range: {
               min:  0,
               max:  100
           }
       });
   }
}


var big_image;

//Javascript just for Demo purpose, remove it from your project
nowuiKitDemo = {
   checkScrollForParallax: debounce(function(){
       var current_scroll = $(this).scrollTop();

       oVal = ($(window).scrollTop() / 3);
       big_image.css({
           'transform':'translate3d(0,' + oVal +'px,0)',
           '-webkit-transform':'translate3d(0,' + oVal +'px,0)',
           '-ms-transform':'translate3d(0,' + oVal +'px,0)',
           '-o-transform':'translate3d(0,' + oVal +'px,0)'
       });

   }, 6)

}

//Returns a function, that, as long as it continues to be invoked, will not
//be triggered. The function will be called after it stops being called for
//N milliseconds. If `immediate` is passed, trigger the function on the
//leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
};
