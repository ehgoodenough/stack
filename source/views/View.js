import React from "react"

export default class View extends React.Component {
    render() {
        return (
            <div className="stack">
                <Camera camera={this.props.system.game.camera}>
                    {this.props.system.game.slabs.map((slab, key) => (
                        <Slab slab={slab} key={key}/>
                    ))}
                </Camera>
            </div>
        )
    }
}

function Camera(props) {
    return (
        <div className="camera" style={{
            transform: [
                "rotateX(65deg)",
                "rotateZ(45deg)",
                `translateZ(${-1 * props.camera.pan}em)`,
                `scale3d(${props.camera.zoom}, ${props.camera.zoom}, ${props.camera.zoom})`
            ].join(" ")
        }}>
            {props.children}
        </div>
    )
}

class Slab extends React.Component {
    render() {
        return (
            <div className="slab" style={{
                opacity: this.props.slab.isBroken ? 0 : 1,
                transform: [
                    `translateX(${this.props.slab.position.x || 0}em)`,
                    `translateY(${this.props.slab.position.y || 0}em)`,
                    `translateZ(${(this.props.slab.position.z || 0) - (this.props.slab.size.z/2)}em)`,
                ].join(" ")
            }}>
                <div className="front face" style={{
                    width: this.props.slab.size.x + "em",
                    height: this.props.slab.size.y + "em",
                    transform: `translateZ(${this.props.slab.size.z/2}em)`,
                    backgroundColor: this.props.slab.color || "#C00",
                }}/>
                <div className="right face" style={{
                    width: this.props.slab.size.z + "em",
                    height: this.props.slab.size.y + "em",
                    transform: `rotateY(90deg) translateZ(${this.props.slab.size.x - (this.props.slab.size.z/2)}em)`,
                    backgroundColor: this.props.slab.darkerColor || "#0C0",
                }}/>
                <div className="bottom face" style={{
                    width: this.props.slab.size.x + "em",
                    height: this.props.slab.size.z + "em",
                    transform: `rotateX(-90deg) translateZ(${this.props.slab.size.y - (this.props.slab.size.z/2)}em)`,
                    backgroundColor: this.props.slab.darkererColor || "#00C",
                }}/>
            </div>
        )
    }
}
