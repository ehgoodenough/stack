import Preact from "preact"
import Nimble from "library/Nimble"

import "views/Config.view.less"
import Game from "views/Game.view.js"
import Channel from "library/Channel.js"

export default class Config {
    render() {
        return (
            <div className="Config">
                <section className="PlaySection">
                    <Game model={this.props.model}/>
                    <div className="WelcomeMessage">
                        <h1>{"Welcome to Snap!!"}</h1>
                        <div>{"Thank you so much for installing."}</div>
                        <p><b>{"Q: What is Snap?"}</b><div>{"A game for you to share with your viewers. Just click or tap to play!! Try to snap your blocks on top of each other."}</div></p>
                        <p><b>{"Q: Why should I put a game on my stream???"}</b><div>{"A: To build engagement and community with your viewers. If you're ever queueing up for a match, or away from keyboard, or just chilling, your viewers can entertain themselves with a little distraction."}</div></p>
                        <p><b>{"Q: Where do I put this?"}</b><div>{"A: We support panels, overlays, component overlays, and mobile. So really anywhere!"}</div></p>
                        <p><b>{"Q: What is your favorite color?"}</b><div>{"A: Probably red. Thanks for asking!"}</div></p>
                    </div>
                </section>
                <section className="LeaderboardSection">
                    <div className="LeaderboardSegment">
                        <h3>For Session</h3>
                        <div className="Leaderboard">
                            <Nimble.views.Leaderboard activity="SNAP" scope="session" doNotHighlightMe={true}/>
                        </div>
                    </div>
                    <div className="LeaderboardSegment">
                        <h3>For Channel</h3>
                        <div className="Leaderboard">
                            <Nimble.views.Leaderboard activity="SNAP" scope="channel" doNotHighlightMe={true}/>
                        </div>
                    </div>
                    <div className="LeaderboardSegment">
                        <h3>For all of Twitch</h3>
                        <div className="Leaderboard">
                            <Nimble.views.Leaderboard activity="SNAP" scope="global" doNotHighlightMe={true}/>
                        </div>
                    </div>
                </section>
                <section className="ActionSection">
                    <div className="ResetChannelSession">
                        <h3>Reset your Session Leaderboard?</h3>
                        <p>By clicking this button, you are reseting the <span className="session">session leaderboard</span>. The scores will still be preserved on your channel leaderboard and the all-of-twitch leaderboard.</p>
                        <button onClick={this.onResetChannelSession}>RESET SESSION</button>
                    </div>
                </section>
            </div>
        )
    }
    onResetChannelSession() {
        Channel.resetChannelSession()
    }
}