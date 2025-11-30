const toggle = document.getElementById("jumpscareToggle");

toggle.addEventListener("change", (e) => {
    chrome.storage.sync.set({ jumpscareEnabled: toggle.checked });
    console.log(`Jumpscare Enabled: ${toggle.checked}`);
    if (toggle.checked) {
        startTimer()
    }
    else stopTimer()
});

// Initialize the toggle based on stored value
chrome.storage.sync.get("jumpscareEnabled", (data) => {
    toggle.checked = data.jumpscareEnabled ?? false;
});

function startTimer() {
    chrome.runtime.sendMessage({ type: "start_timer" });
}

function stopTimer() {
    chrome.runtime.sendMessage({ type: "stop_timer" });
}