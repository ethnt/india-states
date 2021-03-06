$(function() {
	/**
	 * On page load check for hash based url settings
	 * @return {string} Returns pagination container contents and pagination bar
	 */
	 function paginationCheckHash() {
	 	if($(".pagination-posts-container").length == 0) {
	 		return;
	 	}
	 	
	 	var hash = window.location.hash.replace("#", "");
	 	var current_page = 1;
	 	var subsector, sort_field, sort_order;

	 	if(hash) {
			// Get Hash values
			subsector = hash.substr(hash.indexOf('subsector=')).split('&')[0].split('=')[1];
			sort_field = hash.substr(hash.indexOf('sort=')).split('&')[0].split('=')[1];
			sort_order = hash.substr(hash.indexOf('order=')).split('&')[0].split('=')[1];
			current_page = hash.substr(hash.indexOf('page=')).split('&')[0].split('=')[1];

            // Set Active Sort Filter and replace subsector with hash subsector value
            if(subsector) {
            	$("a.sort-attribute").each(function() {
					var href = $(this).attr("href");
					var sortType = $(this).data("sort");
					var newHash = "#subsector="+subsector+"&"+sortType;
					$(this).attr("href", href.replace(href, newHash));
				});

				$(".subsector-link").removeClass("active");
				$(".subsector-link[data-show-subsector='"+subsector+"']").first().addClass("active");

            }

            $("a.sort-attribute").removeClass("active");
            $("a.sort-attribute[data-sort='sort="+sort_field+"&order="+sort_order+"']").addClass("active");
        }
        else {
        	// Set "All" button to active
        	$(".subsector-link[data-show-subsector='all']").addClass("active");
        }

        // Set Date Desc as active by default if nothing else specified
        if(!sort_field) {
        	$(".sort-attribute").removeClass("active");
            $("a.sort-attribute[data-sort='sort=date&order=desc']").addClass("active");
        }

		// Set Active Page in Pagination Bar based on hash, or default to 1
		$(".pagination-pagesContainer a").removeClass("active");
		$('.pagination-pagesContainer a[data-page="'+current_page+'"]').addClass('active');

        // Calculate the pagination settings based on hash values
        paginationCalculation(subsector, sort_field, sort_order, current_page);
    }

    /**
     * Run paginationCheckHash() on window's on hash change event and initial run of function
     */
    window.onhashchange = paginationCheckHash;
	paginationCheckHash();

	// Drop down menu for mobile
	if($(".sort-dropdown").length) {
		$('.sort-dropdown').on('change', function () {
	        var url = $(this).val(); // get selected value
			window.location = url; // redirect
	    });
	}

	/**
	 * Calculates the total items, start item, end item, and sorts the chosen post array
	 * @param  {String} sort_field   The field to sort the post array by
	 * @param  {String} sort_order   The direction to sort the post array by: asc or desc
	 * @param  {Number} current_page The current page the user is on
	 * @return {string}              Renders the posts to be shown on this page and the pagination bar
	 */
	function paginationCalculation(subsector, sort_field, sort_order, current_page) {
		// Default Values
		sort_field = sort_field || "date";
		sort_order = sort_order || "desc";
		current_page = current_page || 1;

		// Calculate the start/end items based on the total items and the posts per page
		var total_items = 0;

		// Set Default Subsector Field if applicable
		if(subsectorFiltering !== 'undefined' && subsectorFiltering == true && !subsector) {
			subsector = "all";
		}

		// Get the start and end indicies of posts to display
		if(current_page > 1) {
			var start_item = posts_per_page * (current_page - 1);
			var end_item = (posts_per_page * current_page) - 1;
		}
		else {
			var start_item = 0;
			var end_item = posts_per_page - 1;
		}

		// Empty's pagination container of previous posts
		$(".pagination-posts-container").empty();

		// Choose which post object we want to use based on sort_field
		var posts;
		if(sort_field == "date") {
			if(subsector) {
				posts = postsPaginateMainObject[subsector];

			}
			else {
				posts = postsPaginateMain;
			}
			showSubheaders = false;

		}
		else {
			if(subsector) {
				posts = postsPaginateSecondaryObject[subsector];
			}
			else {
				posts = postsPaginateSecondary;
			}
			showSubheaders = true;
		}

		// Render Subsector Info
		if(subsectorFiltering == true && subsector != "all") {
			$(".subsectorFiltering-subsectorTitle").html(subsectorInfoObject[subsector].title);
			$(".subsectorFiltering-subsectorTitle").show("fast");
			$(".subsectorFiltering-subsectorInfo span").html($.parseHTML(unescape(subsectorInfoObject[subsector].content)));
			$(".subsectorFiltering-subsectorInfo").show("fast");
		}
		else if(subsector == "all") {
			$(".subsectorFiltering-subsectorTitle").hide("fast");
			$(".subsectorFiltering-subsectorInfo").hide("fast");
		}

		// If we have no results, display no results message
		if(posts == undefined || posts.length == 0) {
			paginationNoResults();
		}
		else {

			// Reverse the sort_field to pass to our dynamic sorter function
			if(sort_order == "desc") {
				posts.sort(dynamicSort("-"+sort_field));
			}
			else {
				posts.sort(dynamicSort(sort_field));
			}

			// Total Count
			total_items = posts.length;

			// Render the Posts for this page
			var postsArray = posts.slice(start_item, (end_item + 1));
			paginationPostRender(postsArray, showSubheaders, subsector);

			// Render Pagination
			paginationRender(total_items, end_item, subsector, sort_field, sort_order, current_page);
		}
	}

	/**
	 * Renders each post from the post array
	 * @param  {Array} posts          The post array to loop through
	 * @param  {Boolean} showSubheaders Whether or not to display a subheader above the post (State Names or Sector Names)
	 * @return {String}                The post template
	 */
	function paginationPostRender(posts, showSubheaders, subsector) {
		$.each(posts, function(index, post) {
			// Check if we want to display subheaders. If we do, we only want to show it once per page
			if(post.state) {
				var stateID = post.state.replace(" ", "");
				if(showSubheaders && $("#"+stateID).length == 0) {
					if(subsectorFiltering) {
						total = postsPaginateSecondaryTotal[post.state][subsector]
					}
					else {
						total = postsPaginateSecondaryTotal[post.state]
					}
					$(".pagination-posts-container").append("<h3 class='sectionTitle pagination-sectionTitle' id='"+stateID+"'>"+post.state+"</h3>");
				}
			}
			else if(post.sector) {
				var sectorID = post.sector.replace(" ", "");
				if(showSubheaders && $("#"+sectorID).length == 0) {
					$(".pagination-posts-container").append("<h3 class='sectionTitle pagination-sectionTitle' id='"+sectorID+"'>"+post.sector+"</h3>");
				}
			}

		    // Render post
		    $('.pagination-posts-container').append($.parseHTML(unescape(post.postHtml)));

		});
	}

	/**
	 * Renders the pagination block, including page numbers & next & previous links
	 * @param  {Number} total_items  Total number of items in the posts array
	 * @param  {Number} end_item     The index of the last item to render
	 * @param  {String} sort_field   The field to sort the post array by
	 * @param  {String} sort_order   The direction to sort the post array by: asc or desc
	 * @param  {Number} current_page The current page the user is on
	 * @return {string}              The pagination block template
	 */
	function paginationRender(total_items, end_item, subsector, sort_field, sort_order, current_page) {
		var total_pages = Math.ceil(total_items / posts_per_page );
		$(".pagination-pagesContainer").empty();

		// Only show the pagination bar if we have more than 1 page
		if(total_pages > 1) {
			// Create the hash link based on the sorted field and date
			if(subsector) {
				var hash = "#subsector="+subsector+"&amp;sort="+sort_field+"&amp;order="+sort_order+"&amp;page=";
			}
			else {
				var hash = "#sort="+sort_field+"&amp;order="+sort_order+"&amp;page=";
			}

			// Convert current page to integer
			current_page = parseInt(current_page);

			// First & Previous Button
			if(current_page > 1) {
				$(".pagination-pagesContainer").append("<a href='"+hash+"1' data-page='1' class='next-prev'>«</a>");

				var previousPage = current_page - 1;
				$(".pagination-pagesContainer").append("<a href='"+hash+previousPage+"' data-page='"+previousPage+"' class='next-prev'>&#8249; Previous</a>");
			}

			// Render each page button
			if(total_pages > 5 && current_page >= 4 ) {
				var startPoint = current_page - 2;
				if(current_page + 2 > total_pages){
					var endPoint = total_pages;
				}
				else {
					var endPoint = current_page + 2;
				}
			}
			else if (total_pages > 5 && current_page < 4) {
				var startPoint = 1;
				var endPoint = 5;
			}
			else {
				var startPoint = 1;
				var endPoint = total_pages;
			}

			for (var i = startPoint; i <= endPoint; i++) {
				if(i == current_page) {
					var activeClass = "active";
				}
				else {
					var activeClass = "";
				}
				$(".pagination-pagesContainer").append("<a href='"+hash+i+"' class='"+activeClass+"' data-page='"+i+"'><button class='btn-gray'>"+i+"</button></a>");
			}

			// Last & Next Button
			if(current_page < total_pages) {
				var nextPage = current_page + 1;
				$(".pagination-pagesContainer").append("<a href='"+hash+nextPage+"' data-page='"+nextPage+"' class='next-prev'>Next &#8250;</a>");
				$(".pagination-pagesContainer").append("<a href='"+hash+total_pages+"' data-page='"+total_pages+"' class='next-prev'>»</a>");
			}
		}

		// Total Results and Current Page/Total Pages
		$(".pagination-totalResults").html(total_items+" total results | Page "+current_page+" of "+total_pages);
	}

	function paginationNoResults() {
		$(".pagination-totalResults").html("0 total results");
		$(".pagination-posts-container").html("<p class='noResults'>There are currently no related articles in this subsector.</p>");
		$(".pagination-pagesContainer").empty();
	}

	// Click on Paginate Links & Scroll to top
	$(".pagination-pagesContainer").on("click", "a", function() {
		var top = $(".pagination-sortByContainer").offset().top - $(".site-header").outerHeight();
		$('html, body').scrollTop(top);
	});

	/**
	 * Dynamically Sort an array based on any given property
	 * @param  {String} property The array property to sort by. Can be Field or -Field depending on sort direction
	 * @return {Array}          The sorted array
	 */
	function dynamicSort(property) {
		var sortOrder = 1;
		var featured = [];
		if(property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a,b) {
				if (!a['is_featured'] && b['is_featured'])
				    return 1;
				if (a['is_featured'] && !b['is_featured'])
				    return -1;
				var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	}

});