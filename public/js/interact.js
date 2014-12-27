window.onload = function() {
	
var clicks = 0;
	$('#fist').click(function() {
		clicks++;
		$('#fbadge').html(clicks);
	});
	
}