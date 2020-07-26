$(document).ready(function(){
	$.ajax({
		url: 'http://localhost:8100/Providers/',
		type: "get",
		dataType: 'json',
		success: function (response) {
		    $('.news-providers-tabs').empty();
		    $(".news-details-content").empty();
			$.each(response['response'], function (key, val) {
			    if (key == 0){
                    $('.news-providers-tabs').append('<li class="nav-item text-center"> \
                    <a class="active" data-toggle="tab" href="#prod_'+val["_id"]+'"> \
                      <h4>'+val["name"]+'</h4> \
                    </a></li>');
                    $('.news-details-content').append('<div id="prod_'+val["_id"]+'" class="tab-pane active"></div>');
                }
                else{
                    $('.news-providers-tabs').append('<li class="nav-item text-center"> \
                    <a data-toggle="tab" href="#prod_'+val["_id"]+'"> \
                      <h4>'+val["name"]+'</h4> \
                    </a></li>');
                    $('.news-details-content').append('<div id="prod_'+val["_id"]+'" class="tab-pane"></div>');
                }
                $('.providers-details').append('<div class="card-blog"><div class="blog-body"><h3>'+val["name"]+'</h3></a><ul class="blog-info"><li><a href="'+val["link"]+'" target="_blank">'+val["link"]+'</a></li><li><a href="javascript:;"><i class="ti-time"></i>Last Updated: '+val["Data Updated"]+'</a></li><li><a href="javascript:;"><i class="ti-time"></i>Last Attempt: </a></li></ul><a class="button button-header mr-2 mb-2 edit-prodvider-record" href="javascript:;" data-id="'+val["_id"]+'">Edit</a><a class="button button-header mb-2 delete-prodvider-record" href="javascript:;" data-id="'+val["_id"]+'">Delete</a></div></div>');
			});
			$(function(){
                "use strict";
                var nav_offset_top=$('header').height()+50;
                function navbarFixed(){
                    if($('.header_area').length){
                        $(window).scroll(function(){
                            var scroll=$(window).scrollTop();
                            if(scroll>=nav_offset_top){
                                $(".header_area").addClass("navbar_fixed");
                            }else{
                                $(".header_area").removeClass("navbar_fixed");
                            }
                        });
                    };
                };
                navbarFixed();
                function mailChimp(){
                    $('#mc_embed_signup').find('form').ajaxChimp();
                }
                mailChimp();
                $('.img-gal').magnificPopup({type:'image',gallery:{enabled:true}});
                if($('.blogCarousel').length){
                    $('.blogCarousel').owlCarousel({
                        loop:false,
                        margin:30,
                        items:1,
                        nav:true,
                        autoplay:2500,
                        smartSpeed:1500,
                        dots:false,
                        responsiveClass:true,
                        navText:["<div class='left-arrow'><i class='ti-angle-left'></i></div>","<div class='right-arrow'><i class='ti-angle-right'></i></div>"],
                        responsive:{0:{items:1},1000:{items:2}}
                    })
                }
            });
		}
	});

	$.ajax({
		url: 'http://localhost:8100/News/',
		type: "get",
		dataType: 'json',
		success: function (response) {
		    //$('.news-providers-tabs').empty();
			$.each(response['response'], function (key, val) {
			    $('#prod_'+val['provider']).append('<div class="schedule-card"><div class="row no-gutters"><div class="col-md-12 align-self-center"><div class="schedule-content"><div class="row"><p class="schedule-date">Pub Date: '+val["pubDate"]+'</p><p style="margin-left: 292px;">Updated at: '+val["Data Update"]+'</p></div><a class="schedule-title" href="#"><h3>'+val["title"]+'</h3></a><p>'+val["description"]+'</p><div class="row"><a href="'+val["link"]+'" target="_blank">Visit News page...</a><a href="javascript:;" target="_blank" class="edit-news-feeds-box" data-id="'+val["_id"]+'" style="margin-left: 635px;">Edit</a><a href="javascript:;" target="_blank" class="delete-news-feeds-box" data-id="'+val["_id"]+'" style="margin-left: 36px;">Delete</a></div></div></div></div></div>');
			});
		}
	});

	$('body').on('click','#update_feeds',function(event){
	    event.preventDefault();
	    var url ="http://localhost:8070/save_feeds";
		$.ajax({
			url: url,
		    type: "GET",
		    success: function (response) {
		    	location.reload();
		    }
		});
	});

	$('body').on('click','.delete-prodvider-record',function(event){
	    event.preventDefault();
	    var record_id = $(this).attr('data-id')
		var url ="http://localhost:8100/Providers/"+record_id;
		$.ajax({
			url: url,
		    type: "DELETE",
		    success: function (response) {
		    	location.reload();
		    }
		});
	});

	$('body').on('click','.delete-news-feeds-box',function(event){
	    event.preventDefault();
	    var record_id = $(this).attr('data-id')
		var url ="http://localhost:8100/News/"+record_id;
		$.ajax({
			url: url,
		    type: "DELETE",
		    success: function (response) {
		    	location.reload();
		    }
		});
	});

	$('#add-new-provider').on('click',function(event){
	    event.preventDefault();
	    var d = new Date();
        var date_time =d.getFullYear() +"-"+(d.getMonth() + 1) +"-"+d.getDate()+"T"+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        $('#add-provider-date-added').val(date_time);
        $('#add-provider-date-updated').val(date_time);
        $('#addNewProvider').modal('show');
	});

	$('body').on('click','.edit-prodvider-record',function(event){
	    event.preventDefault();
	    var record_id = $(this).attr('data-id');
        var url = "http://localhost:8100/Providers/"+record_id;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                $('#edit-provider-title').val(result['data']["name"]);
                $('#edit-provider-link').val(result['data']["link"]);
                var d = new Date(result['data']["Date Added"]);
                var date_time =d.getFullYear() +"-"+(d.getMonth() + 1) +"-"+d.getDate()+"T"+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                $('#edit-provider-date-added').val(date_time);
                $('#edit-provider-status').val(result['data']["Status"]);
                $('.save-edit-provider').attr('data-id',result['data']['_id'])
                $('#editProvider').modal('show');
            }
        });
	});

	$('body').on('click','.save-new-provider',function(event){
	    event.preventDefault();
	    var form_data = $('#add-provider-form').serialize();
        var url = "http://localhost:8100/Providers/";
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            success: function(result) {
                location.reload();
            }
        });
	});

	$('.save-edit-provider').on('click',function(){
        var record_id = $(this).attr('data-id');
        var d = new Date();
        var date_time =d.getFullYear() +"-"+(d.getMonth() + 1) +"-"+d.getDate()+"T"+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        var form_data = $('#edit-provider-form').serialize();
        form_data = form_data+"&Date Updated="+date_time;
        var url = "http://localhost:8100/Providers/"+record_id;
        $.ajax({
            url: url,
            type: 'PUT',
            data: form_data,
            contentType: "application/x-www-form-urlencoded",
            complete: function(result) {
                location.reload();
            }
        });
    });

    $('body').on('click','.edit-news-feeds-box',function(event){
	    event.preventDefault();
	    var record_id = $(this).attr('data-id');
        var url = "http://localhost:8100/News/"+record_id;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                $('#edit-news-title').val(result['data']["title"]);
                $('#edit-news-link').val(result['data']["link"]);
                var d = new Date(result['data']["Date Added"]);
                var date_time =d.getFullYear() +"-"+(d.getMonth() + 1) +"-"+d.getDate()+"T"+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                $('#edit-news-date-added').val(date_time);
                $('#edit-news-status').val(result['data']["status"]);
                var d = new Date(result['data']["Data Added"]);
                var date_time =d.getFullYear() +"-"+(d.getMonth() + 1) +"-"+d.getDate()+"T"+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                $('#edit-news-pub-date').val(date_time);
                $('.save-edit-news').attr('data-id',result['data']['_id'])
                $('#editFeed').modal('show');
          }
        });
	});

	$('.save-edit-news').on('click',function(){
        var record_id = $(this).attr('data-id');
        var d = new Date();
        var date_time =d.getFullYear() +"-"+(d.getMonth() + 1) +"-"+d.getDate()+"T"+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        var form_data = $('#edit-news-form').serialize();
        form_data = form_data+"&Data Updated="+date_time;
        var url = "http://localhost:8100/News/"+record_id;
        $.ajax({
            url: url,
            type: 'PUT',
            data: form_data,
            contentType: "application/x-www-form-urlencoded",
            complete: function(result) {
                location.reload();
            }
        });
    });



	$('body').on('keydown','#search-txt-box',function(event){
		if(event.keyCode==13){
			event.preventDefault();
			var value = $(this).val();
			var url ="http://localhost:81/Menus/search/"+value;
			$.ajax({
				url: url,
		    	type: "get",
		    	dataType: 'json',
		    	success: function (response) {
		    		$('.hotels-list').empty();
		    		$.each(response['response'], function (key, val) {
			        	$('.hotels-list').append('<div class="list-box clearfix"> \
							<div class="pull-left-lg pull-left-md"></div> \
							<div class="pull-left-lg pull-left-md list-box-info"> \
							<h5 class="list-box-info-title"><a href="#">'+val['name']+'</a></h5> \
							<p class="list-unstyled list-inline list-box-info-tags"> '+val['description']+'</p> \
							<ul class="list-unstyled list-inline list-box-info-links"> \
								<li><i class="fa fa-tag"></i> <a href="#">'+val['resturant']+'</a></li> \
								<li><i class="fa fa-info-circle"></i> <a href="#">'+val['type']+'</a></li> \
								<li><i class="fa fa-asterisk"></i> <a href="#">'+val['category']+'</a></li> \
							</ul> \
							</div> \
							<div class="pull-right-lg pull-right-md right-col text-right text-center-sm text-center-xs"> \
								<h6 class="sub-title">'+val['price']+' €</h6> \
								<a href="#" class="btn btn-secondary animation"> Compare <i class="fa fa-chevron-right"></i></a> \
							</div> \
						</div>');
			    	});
		    	}
			});
		}
	});

	$('body').on('click','#search-btn-box',function(event){
			event.preventDefault();
			var value = $(this).val();
			var url ="http://localhost:81/Menus/search/"+value;
			$.ajax({
				url: url,
		    	type: "get",
		    	dataType: 'json',
		    	success: function (response) {
		    		$('.hotels-list').empty();
		    		$.each(response['response'], function (key, val) {
			        	$('.hotels-list').append('<div class="list-box clearfix"> \
							<div class="pull-left-lg pull-left-md"></div> \
							<div class="pull-left-lg pull-left-md list-box-info"> \
							<h5 class="list-box-info-title"><a href="#">'+val['name']+'</a></h5> \
							<p class="list-unstyled list-inline list-box-info-tags"> '+val['description']+'</p> \
							<ul class="list-unstyled list-inline list-box-info-links"> \
								<li><i class="fa fa-tag"></i> <a href="#">'+val['resturant']+'</a></li> \
								<li><i class="fa fa-info-circle"></i> <a href="#">'+val['type']+'</a></li> \
								<li><i class="fa fa-asterisk"></i> <a href="#">'+val['category']+'</a></li> \
							</ul> \
							</div> \
							<div class="pull-right-lg pull-right-md right-col text-right text-center-sm text-center-xs"> \
								<h6 class="sub-title">'+val['price']+' €</h6> \
								<a href="#" class="btn btn-secondary animation"> Compare <i class="fa fa-chevron-right"></i></a> \
							</div> \
						</div>');
			    	});
		    	}
			});
	});

	 

	$('body').on('change','#sort_by',function(){
		var value = $(this).val();
		var url ="http://localhost:81/Menus/?order_by="+value;
		$.ajax({
			url: url,
		    type: "get",
		    dataType: 'json',
		    success: function (response) {
		    	$('.hotels-list').empty();
		    	$.each(response['response'], function (key, val) {
			        $('.hotels-list').append('<div class="list-box clearfix"> \
						<div class="pull-left-lg pull-left-md"></div> \
						<div class="pull-left-lg pull-left-md list-box-info"> \
						<h5 class="list-box-info-title"><a href="#">'+val['name']+'</a></h5> \
						<p class="list-unstyled list-inline list-box-info-tags"> '+val['description']+'</p> \
						<ul class="list-unstyled list-inline list-box-info-links"> \
							<li><i class="fa fa-tag"></i> <a href="#">'+val['resturant']+'</a></li> \
							<li><i class="fa fa-info-circle"></i> <a href="#">'+val['type']+'</a></li> \
							<li><i class="fa fa-asterisk"></i> <a href="#">'+val['category']+'</a></li> \
						</ul> \
						</div> \
						<div class="pull-right-lg pull-right-md right-col text-right text-center-sm text-center-xs"> \
							<h6 class="sub-title">'+val['price']+' €</h6> \
							<a href="#" class="btn btn-secondary animation"> Compare <i class="fa fa-chevron-right"></i></a> \
						</div> \
					</div>');
			    });
		    }
		});
	});


	$('body').on('click','.filter-by-type',function(){
		var value = $(this).val();
		$(".filter-by-type").attr("checked", false); //uncheck all checkboxes
  		$(this).attr("checked", true);  //check the clicked one
		var url =''
		if(value == 'all'){
			url ="http://localhost:81/Menus/";
		}else if(value == 'website'){
			url ="http://localhost:81/Menus/?search=type,like,"+value;
		}else if(value == 'pdf'){
			url ="http://localhost:81/Menus/?search=type,like,"+value;
		}
		$.ajax({
			url: url,
		    type: "get",
		    dataType: 'json',
		    success: function (response) {
		    	$('.hotels-list').empty();
		    	$.each(response['response'], function (key, val) {
			        $('.hotels-list').append('<div class="list-box clearfix"> \
						<div class="pull-left-lg pull-left-md"></div> \
						<div class="pull-left-lg pull-left-md list-box-info"> \
						<h5 class="list-box-info-title"><a href="#">'+val['name']+'</a></h5> \
						<p class="list-unstyled list-inline list-box-info-tags"> '+val['description']+'</p> \
						<ul class="list-unstyled list-inline list-box-info-links"> \
							<li><i class="fa fa-tag"></i> <a href="#">'+val['resturant']+'</a></li> \
							<li><i class="fa fa-info-circle"></i> <a href="#">'+val['type']+'</a></li> \
							<li><i class="fa fa-asterisk"></i> <a href="#">'+val['category']+'</a></li> \
						</ul> \
						</div> \
						<div class="pull-right-lg pull-right-md right-col text-right text-center-sm text-center-xs"> \
							<h6 class="sub-title">'+val['price']+' €</h6> \
							<a href="#" class="btn btn-secondary animation"> Compare <i class="fa fa-chevron-right"></i></a> \
						</div> \
					</div>');
			    });
		    }
		});
	});

	$('body').on('click','.filter-by-resturant',function(){
		var value = $(this).val();
		$(".filter-by-resturant").attr("checked", false); //uncheck all checkboxes
  		$(this).attr("checked", true);  //check the clicked one
		var url =''
		if(value == 'all'){
			url ="http://localhost:81/Menus/";
		}else{
			url ="http://localhost:81/Menus/?search=resturant,like,"+value;
		}
		$.ajax({
			url: url,
		    type: "get",
		    dataType: 'json',
		    success: function (response) {
		    	$('.hotels-list').empty();
		    	$.each(response['response'], function (key, val) {
			        $('.hotels-list').append('<div class="list-box clearfix"> \
						<div class="pull-left-lg pull-left-md"></div> \
						<div class="pull-left-lg pull-left-md list-box-info"> \
						<h5 class="list-box-info-title"><a href="#">'+val['name']+'</a></h5> \
						<p class="list-unstyled list-inline list-box-info-tags"> '+val['description']+'</p> \
						<ul class="list-unstyled list-inline list-box-info-links"> \
							<li><i class="fa fa-tag"></i> <a href="#">'+val['resturant']+'</a></li> \
							<li><i class="fa fa-info-circle"></i> <a href="#">'+val['type']+'</a></li> \
							<li><i class="fa fa-asterisk"></i> <a href="#">'+val['category']+'</a></li> \
						</ul> \
						</div> \
						<div class="pull-right-lg pull-right-md right-col text-right text-center-sm text-center-xs"> \
							<h6 class="sub-title">'+val['price']+' €</h6> \
							<a href="#" class="btn btn-secondary animation"> Compare <i class="fa fa-chevron-right"></i></a> \
						</div> \
					</div>');
			    });
		    }
		});
	});

	$('body').on('click','.filter-by-category',function(){
		var value = $(this).val();
		$(".filter-by-category").attr("checked", false); //uncheck all checkboxes
  		$(this).attr("checked", true);  //check the clicked one
		var url =''
		if(value == 'all'){
			url ="http://localhost:81/Menus/";
		}else{
			url ="http://localhost:81/Menus/?search=category,like,"+value;
		}
		$.ajax({
			url: url,
		    type: "get",
		    dataType: 'json',
		    success: function (response) {
		    	$('.hotels-list').empty();
		    	$.each(response['response'], function (key, val) {
			        $('.hotels-list').append('<div class="list-box clearfix"> \
						<div class="pull-left-lg pull-left-md"></div> \
						<div class="pull-left-lg pull-left-md list-box-info"> \
						<h5 class="list-box-info-title"><a href="#">'+val['name']+'</a></h5> \
						<p class="list-unstyled list-inline list-box-info-tags"> '+val['description']+'</p> \
						<ul class="list-unstyled list-inline list-box-info-links"> \
							<li><i class="fa fa-tag"></i> <a href="#">'+val['resturant']+'</a></li> \
							<li><i class="fa fa-info-circle"></i> <a href="#">'+val['type']+'</a></li> \
							<li><i class="fa fa-asterisk"></i> <a href="#">'+val['category']+'</a></li> \
						</ul> \
						</div> \
						<div class="pull-right-lg pull-right-md right-col text-right text-center-sm text-center-xs"> \
							<h6 class="sub-title">'+val['price']+' €</h6> \
							<a href="#" class="btn btn-secondary animation"> Compare <i class="fa fa-chevron-right"></i></a> \
						</div> \
					</div>');
			    });
		    }
		});
	});

	$('body').on('click','.compare-me',function(){
		var value = $(this).attr('data-name');
		var url =url ="http://localhost:81/Menus/?search=name,like,"+value;
		$.ajax({
			url: url,
		    type: "get",
		    dataType: 'json',
		    success: function (response) {
		    	$('.hotels-list').empty();
		    	$.each(response['response'], function (key, val) {
			        $('.hotels-list').append('<div class="list-box clearfix"> \
						<div class="pull-left-lg pull-left-md"></div> \
						<div class="pull-left-lg pull-left-md list-box-info"> \
						<h5 class="list-box-info-title"><a href="#">'+val['name']+'</a></h5> \
						<p class="list-unstyled list-inline list-box-info-tags"> '+val['description']+'</p> \
						<ul class="list-unstyled list-inline list-box-info-links"> \
							<li><i class="fa fa-tag"></i> <a href="#">'+val['resturant']+'</a></li> \
							<li><i class="fa fa-info-circle"></i> <a href="#">'+val['type']+'</a></li> \
							<li><i class="fa fa-asterisk"></i> <a href="#">'+val['category']+'</a></li> \
						</ul> \
						</div> \
						<div class="pull-right-lg pull-right-md right-col text-right text-center-sm text-center-xs"> \
							<h6 class="sub-title">'+val['price']+' €</h6> \
							<a href="#" class="btn btn-secondary animation"> Compare <i class="fa fa-chevron-right"></i></a> \
						</div> \
					</div>');
			    });
		    }
		});
	});
});

