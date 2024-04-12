document.addEventListener("DOMContentLoaded", function() {
    const cake = document.querySelector(".cake");
    const candleCountDisplay = document.getElementById("candleCount");
    const birthdayText = document.getElementById("birthdayText");
    let candles = [];
    let audioContext;
    let analyser;
    let microphone;
    let audio = new Audio("./audio/Disney Pixar's Inside Out - 01 - Bundle Of Joy.mp3");

    function updateCandleCount() {
        const activeCandles = candles.filter(
            (candle) => !candle.classList.contains("out")
        ).length;
        candleCountDisplay.textContent = activeCandles;

        if (activeCandles === 0) {
            birthdayText.style.display = "block"; // Mostra o texto "Happy Birthday"
            audio.play(); // Inicia a reprodução da música
        }
    }

    function addCandle(left, top) {
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.style.left = left + "px";
        candle.style.top = top + "px";

        const flame = document.createElement("div");
        flame.className = "flame";
        candle.appendChild(flame);

        cake.appendChild(candle);
        candles.push(candle);
        updateCandleCount();
    }

    // Adiciona 14 velas ao bolo
    for (let i = 0; i < 14; i++) {
        const left = Math.random() * 200 + 25; // Posição X aleatória dentro do bolo
        const top = Math.random() * 50 + 10; // Posição Y aleatória dentro do bolo
        addCandle(left, top);
    }

    function isBlowing() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        let average = sum / bufferLength;

        return average > 40; //
    }

    function blowOutCandles() {
        let blownOut = 0;

        if (isBlowing()) {
            candles.forEach((candle) => {
                if (!candle.classList.contains("out") && Math.random() > 0.5) {
                    candle.classList.add("out");
                    blownOut++;
                }
            });
        }

        if (blownOut > 0) {
            updateCandleCount();
        }
    }

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function(stream) {
                audioContext = new(window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;
                setInterval(blowOutCandles, 200);
            })
            .catch(function(err) {
                console.log("Unable to access microphone: " + err);
            });
    } else {
        console.log("getUserMedia not supported on your browser!");
    }
});
