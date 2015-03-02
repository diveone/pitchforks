window.onload = function() {
	
	var clicks = 0;
	$('#fistPump').click(function() {
		clicks++;

		$.post("/pump",
		{ support: clicks },
		function(data, textStatus, jqXHR){});

		$('#fistBadge').html(clicks);
	});

	
}