$(document).ready(function(){

var context = new AudioContext();
var url = "https://cf-media.sndcdn.com/ytZhThaRcOAv.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20veXRaaFRoYVJjT0F2LjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE0Mjg0MDUzNTZ9fX1dfQ__&Signature=mOUOYDpd4G9sMKWPho~TY6nVvLeU43DTbw0xAeMaE67UIZVyPj~prELZiwafftLXihdK9d2fUAcflPj5HNY5cPOcCeQur4qMjCpvHD5ue3YjULSsasYKaGj3HDT~0nh9xxaNOL5q4Mx2N-a5Q5UU5HxKZ6-D0aklLb-WFtz2kgsmPPYqAqhsPdV7bRNRRY9yVbzLd4XtbXpMizXAF7jRhx9FyV362Keitn8Axl-ElaV1eI7lqTK~5wa25RmKX1fo5iOEWwnIHPPN6kGE0HIEKyI4D~UhDe7-EFV~eeDapBGmq-N-QiaaQNPIFCg2J7KH0H~RyJGzTPwmXaqjc9ww4g__&Key-Pair-Id=APKAJAGZ7VMH2PFPW6UQ";
var audio = new Audio(url);

// Overkill - if we've got Web Audio API, surely we've got requestAnimationFrame. Surely?...
// requestAnimationFrame polyfill by Erik M�ller
// fixes from Paul Irish and Tino Zijdel
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () { callback(currTime + timeToCall); },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };

var analyser = context.createAnalyser();

var frequencyData = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(frequencyData);


audio.addEventListener("canplay", function() {
    var source = context.createMediaElementSource(audio);

    // Connect the output of the source to the input of the analyser
    source.connect(analyser);

    // Connect the output of the analyser to the destination
    analyser.connect(context.destination);


	//console.log(analyser.fftSize); // 2048 by default
	//console.log(analyser.frequencyBinCount); // will give us 1024 data points

	analyser.fftSize = 128;
	//console.log(analyser.frequencyBinCount); // fftSize/2 = 32 data points

	audio.play();
});


function update() {
    // Schedule the next update
    requestAnimationFrame(update);

    // Get the new frequency data
    analyser.getByteFrequencyData(frequencyData);

    // Update the visualisation
    $('.smallcircle').each(function (index, bar) {
    	//console.log(frequencyData[index]);
        //bar.style.height = frequencyData[index] + 'px';
        console.log(frequencyData[index]);
    	$(bar).css({'top': '-'+frequencyData[index]+'px', 'height': frequencyData[index]/7, 'width': frequencyData[index]/7, 'border-radius': frequencyData[index]/14});
    });
};

// Kick it off...
update();

$('button#stop').on('click', function(){
	audio.pause();
})

});