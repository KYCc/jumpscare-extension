const preloadedAudio = new Audio();
preloadedAudio.src = chrome.runtime.getURL("assets/jumpscare_sound.wav");
preloadedAudio.load();

function showJumpscare() {
    fetch(chrome.runtime.getURL("html/jumpscare.html"))
        .then(response => response.text())
        .then(html => {
            const container = document.createElement("div");
            container.innerHTML = html;
            document.body.appendChild(container);

             // Set the gif source using the correct URL
            const img = container.querySelector("#jumpscareImage");
            if (img) {
                img.src = chrome.runtime.getURL("assets/foxy-jumpscare.gif");
            }

            preloadedAudio.currentTime = 0;
            preloadedAudio.play().catch((error) => {
                console.log("Could not play jumpscare sound:", error.message);
            });

            // Remove after 3 seconds
            setTimeout(() => {
                container.remove();
            }, 830);
        })
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "trigger_jumpscare") {
        console.log("Received jumpscare trigger message.")
        showJumpscare()
    }
})