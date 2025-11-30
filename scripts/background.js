const ALARM_NAME = "jumpscareAlarm"
const CHECK_INTERVAL_MINUTES = 1
const JUMPSCARE_CHANCE = 0.05

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
        checkAndTriggerJumpscare()
    }
})

async function checkAndTriggerJumpscare() {
    const data = await chrome.storage.sync.get("jumpscareEnabled")
    if (!data.jumpscareEnabled) return

    const randomValue = Math.random()
    if (randomValue < JUMPSCARE_CHANCE) {
        console.log("Jumpscare triggered!")
        // Send message to active tab only
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0 && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "trigger_jumpscare" })
                    .catch((error) => {
                        console.log("Could not send message to tab:", error.message);
                    });
            }
        });
    }
    else console.log("No jumpscare this time.")
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "start_timer") {
        chrome.alarms.create(ALARM_NAME, { periodInMinutes: CHECK_INTERVAL_MINUTES })
        console.log("Jumpscare timer started.")
    } else if (message.type === "stop_timer") {
        chrome.alarms.clear(ALARM_NAME)
        console.log("Jumpscare timer stopped.")
    }
})

// Check if alarm should be running on startup
chrome.storage.sync.get("jumpscareEnabled", (data) => {
    if (data.jumpscareEnabled) {
        chrome.alarms.create(ALARM_NAME, {
            periodInMinutes: CHECK_INTERVAL_MINUTES
        });
    }
});