window.onload = function() {
	
var clicks = 0;
	$('#fistPump').click(function() {
		clicks++;
		$('#fistBadge').html(clicks);
	});
	
}