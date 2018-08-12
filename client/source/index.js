import Preact from "preact"
import Yaafloop from "yaafloop"
import Keyb from "keyb"
import QueryString from "query-string"
import Nimble from "library/Nimble"

import View from "views/View.js"
import Experience from "models/Experience.js"

let query = QueryString.parse(location.search)
if(query.state === "testing") {
    console.clear()
}

Nimble.twitch.onAuthorized((authorization) => {
    let experience = new Experience()

    let mount = Preact.render(<View experience={experience}/>, document.body)

    let loop = new Yaafloop((delta) => {
        experience.update(delta)
        Preact.render(<View experience={experience}/>, document.body, mount)
    })

    Nimble.sparks.initialize().then(() => {
        const GLOBAL_LEADERBOARD = "GlobalHighScores.activity.SNAP"
        const CHANNEL_LEADERBOARD = `ChannelHighScores.activity.SNAP.channelId.${Nimble.twitch.streamer.channelId}`
        Nimble.sparks.listenToLeaderboard("SNAP/channel", CHANNEL_LEADERBOARD)
        Nimble.sparks.listenToLeaderboard("SNAP/global", GLOBAL_LEADERBOARD)
    })
})

// Disable the Twitch Fullscreen double-click shortcut listener.
document.body.addEventListener("dblclick", function(event) {
    event.stopPropagation()
})

// Disable the Twitch keyboard shortcut listeners.
document.addEventListener("keydown", function(event) {
    event.preventDefault()
})
