$(document).ready(function () {
	$("#map-btn").on("click", function () {
		$("#table-div").hide();
		$("#map-div, #map").show();
		createMap();
	});

	$("#list-btn").on("click", function () {
		$("#table-div").show();
		$("#map-div, #map").hide();
	});


	function createMap() {
		mapboxgl.accessToken = mapboxToken;

		var mapOptions = {
			container: 'map', style: 'mapbox://styles/mapbox/streets-v9',
			zoom: 10,
			center: [-98.4916, 29.4252],
			touchZoomRotate: false,
			refreshExpiredTiles: false,
		}

		//creates map
		var map = new mapboxgl.Map(mapOptions);

		//adds map controls
		map.addControl(new mapboxgl.NavigationControl());

		runPopupMarkerLoop(map);
	}

	function runPopupMarkerLoop(map) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].latlng !== null) {
				createPopupAndMarker(data[i], map);
			}
		}
	}

	function createPopupAndMarker(place, map) {
		var popup = createPopup(place)
		var marker = createMarker(popup, place, map)
	}

	function createPopup(place) {
		var html = createPopupHtml(place);
		return new mapboxgl.Popup()
			.setHTML(html);
	}

	function createPopupHtml(place){
		var html = "";

		if(place.html !== null && place.name !== null){
			html = '<a target="_blank" rel="noopener" href="http://www.' + place.website + '"><h5>' + place.name + '</h5></a>';
		} else {
			html += '<h5>' + place.name +'</h5>'
		}

		html += '<p>'
		if(place.phoneNumber !== null){
			 html += place.phoneNumber + '<br>';
		}

		if(place.streetAddress !== null){
			html += place.streetAddress + '<br>';
		}

		html += '</p>'

		if(place.description !== null){
			html += '<p>' + place.description + '</p>';
		}

		return html;
	}

	function createMarker(popup, place, map) {
		var markerOption = {
			color: "#FF0000"
		}

		return new mapboxgl.Marker(markerOption)
			.setLngLat({lng: place.latlng[1], lat: place.latlng[0]})
			.setPopup(popup)
			.addTo(map);
	}


	//Creates dataTable table
	$('#example').DataTable({
		data: data, responsive: true,
		pageLength: 50,
		order: [[ 0, "desc"]],
		columns: [
			{
				width: "5%",
				data: "dateAdded"
			},
			{
				width: "15%",
				data: "name"
			},
			{
				width: "45%", data: "description"
			},
			{
				orderable: false,
				data: null,
				render: function (data, type, row) {
					return createContactHtml(data);
				}
			},
			{
				data: null,
				render:
					function (data, type, row) {
						return createSourceHtml(data);
				}
			}
		]
	});


	function createContactHtml(data){
		var html = "";
		html += '<div>';
		if (data.streetAddress !== null && data.city !== null) {
			html += '<span><strong>Address:</strong> ' + data.streetAddress + ", " + data.city + '</span><br>';
		} else if (data.streetAddress !== null){
			html += '<span><strong>Address:</strong> ' + data.streetAddress +  '</span><br>';

		}

		if (data.phoneNumber !== null) {
			html += '<span><strong>Phone:</strong> ' + data.phoneNumber + '</span><br>';
		}

		if (data.website !== null) {
				html += '<span><strong>Website:</strong> </span><a href="http://' + data.website + '" target="_blank" rel="noopener">' + data.website + '</a></span><br>';
		}

		if (data.facebook !== null) {
			html += '<span><strong>Facebook:</strong> </span><a href="http://facebook.com/' + data.facebook + '" target="_blank" rel="noopener">@' + data.facebook + '</a></span><br>';
		}
		html += '</div>';

		return html;
	}

	function createSourceHtml(data){
		//https://stackoverflow.com/questions/44308685/want-to-split-a-string-after-a-certain-word
		var html = "";
		if (data.source !== null) {
			(data.source).forEach(function (source, index) {
				var url = new URL(source);
				// var baseUrl = "www." + (url.origin).split("www.")[1];
				html += '<p><a href="' + url.href + '" target="_blank" rel="noopener">' + url.hostname + '</a></p>';
			})
		}

		return html;
	}
});