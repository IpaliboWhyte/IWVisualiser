$(document).ready(function(){

var context = new AudioContext();
var url = 'http://anything2mp3.com/system/temporary/mp3/Becky%20G%20-%20Can%27t%20Stop%20Dancing%20%28Audio%29_soundcloud_172763951.mp3?download=1';
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