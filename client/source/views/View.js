import Preact from "preact"
import QueryString from "query-string"

import Experience from "models/Experience.js"

import Slab from "views/Slab.view.js"
import Score from "views/Score.view.js"
import Frame from "views/Frame.view.js"
import Camera from "views/Camera.view.js"
import Version from "views/Version.view.js"
import Title from "views/Title.view.js"
import Prompt from "views/Prompt.view.js"
import Leaderboards from "views/Leaderboards.view.js"

import "views/View.less"

let query = QueryString.parse(location.search)

export default function View(props) {
    return (
        <div id="view" className={`anchored-as-${query.anchor || "self"}`}>
            <Frame>
                <div className="Game">
                    <Version/>
                    <Title game={Experience.game}/>
                    <Prompt game={Experience.game}/>
                    <Score game={Experience.game}/>
                    <Leaderboards game={Experience.game}/>
                    <Camera camera={Experience.game.camera} key={Experience.game.key}>
                        {Experience.game.slabs.map((slab, key) => (
                            <Slab slab={slab} key={key}/>
                        ))}
                    </Camera>
                </div>
            </Frame>
        </div>
    )
}

// TODO: Refactor the X and Z to be horizontal and Y to be vertical.
// TODO: Why are we offseting z/2 for the upwards transform, and not the others?
// TODO: Why is the x/y origin in the top left?
