if(window.DeviceOrientationEvent) { //Do something }
	console.log("Supporting DeviceOrientationEvent");
	var devOri = document.getElementById('devOri');
	//console.log(devOri);
	
	window.addEventListener('deviceorientation', function(event) {
		var alpha = event.alpha;
		var beta = event.beta;
		var gamma = event.gamma;
		// Do something
		var orientation;
		if (alpha < 45 && alpha > 0 || alpha > 315 && alpha < 360) {
			orientation = 'north';
		} else if (alpha > 45 && alpha < 135) {
			orientation = 'west';
		} else if (alpha > 135 && alpha < 225) {
			orientation = 'south';
		} else if (alpha > 225 && alpha < 315) {
			orientation = 'east';
		}
		devOri.innerHTML = orientation;
	}, false);

	

	// if(event.webkitCompassHeading){
	// 	console.log("yo");
	// 	orientation=event.webkitCompassHeading;
	// } else{
	// 	console.log("yeah");
	// 	orientation=event.alpha;
	// }
}

