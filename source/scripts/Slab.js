import Three from "three"
import LeftPad from "left-pad"

const COLOR_GRADIENT = 7 // the number of stages in each gradient between colors
const MINIMUM_SIZE = 0.3 // the smallest size of a slab that won't end the game
const BOUNCE_POINT = 13 // the position from the origin that a slab will bounce
const SNAP_POINT = 0.25 // the fuzzy difference in two slabs to trigger a snap
const SPEED = 20 // the rate per second to move the slab

var Sounds = {
    beep1: new Audio(require("../sounds/beep.wav")),
    beep2: new Audio(require("../sounds/boop.wav")),
    combo1: new Audio(require("../sounds/combo1.wav")),
    combo2: new Audio(require("../sounds/combo2.wav")),
    combo3: new Audio(require("../sounds/combo3.wav")),
    death: new Audio(require("../sounds/death.wav")),
}

for(var key in Sounds) {
    Sounds[key].volume = 0.5
}

import {Colors} from "./Colors.js"
var colors = Colors

function generateColor(y) {
    var p = y % COLOR_GRADIENT / COLOR_GRADIENT
    var w = p * 2 - 1
    var w1 = (w / 1  + 1) / 2
    var w2 = 1 - w1
    
    var color1 = colors[(Math.floor(y / COLOR_GRADIENT) + 1) % colors.length]
    var color2 = colors[(Math.floor(y / COLOR_GRADIENT)) % colors.length]
    
    return "#" + [
        LeftPad(Math.round((color1[0] * w1) + (color2[0] * w2)).toString(16), 2, 0),
        LeftPad(Math.round((color1[1] * w1) + (color2[1] * w2)).toString(16), 2, 0),
        LeftPad(Math.round((color1[2] * w1) + (color2[2] * w2)).toString(16), 2, 0),
    ].join("")
}

export class Slab extends Three.Mesh {
    constructor(slab) {
        var geometry = new Three.BoxGeometry(slab.width || 1, slab.height || 1, slab.depth || 1)
        var material = new Three.MeshLambertMaterial({color: slab.color || generateColor(slab.y || 0)})
        super(geometry, material)
        
        this.position.x += slab.x || 0
        this.position.y += slab.y || 0
        this.position.z += slab.z || 0
        
        this.width = slab.width || 1
        this.height = slab.height || 1
        this.depth = slab.depth || 1
        
        this.color = slab.color || generateColor(this.position.y)
        
        this.receiveShadow = true
        this.castShadow = true
    }
}

export class SlidingSlab extends Slab {
    constructor(slab) {
        super(slab)
        
        this.speed = slab.speed || SPEED
        this.direction = slab.direction || "x"
        
        this.position[this.direction] -= 25
    }
    update(delta, input) {
        if(input == true && this.position[this.direction] > -(BOUNCE_POINT - 1)) {
            var slab = this.parent.children.filter((child) => {
                return child instanceof Slab
            })[this.position.y - 1]
            
            var ax0 = this.position.x - (this.width / 2)
            var az0 = this.position.z - (this.depth / 2)
            var ax1 = this.position.x + (this.width / 2)
            var az1 = this.position.z + (this.depth / 2)
            
            var bx0 = slab.position.x - (slab.width / 2)
            var bz0 = slab.position.z - (slab.depth / 2)
            var bx1 = slab.position.x + (slab.width / 2)
            var bz1 = slab.position.z + (slab.depth / 2)
            
            var awesome = false
            
            // snap
            if(this.direction == "x") {
                if(Math.abs(ax0 - bx0) < SNAP_POINT
                && Math.abs(ax1 - bx1) < SNAP_POINT) {
                    awesome = true
                    ax0 = bx0
                    ax1 = bx1
                }
            }
            if(this.direction == "z") {
                if(Math.abs(az0 - bz0) < SNAP_POINT
                && Math.abs(az1 - bz1) < SNAP_POINT) {
                    awesome = true
                    az0 = bz0
                    az1 = bz1
                }
            }
            
            if(awesome == true) {
                this.parent.combo += 1
            } else {
                this.parent.combo = 0
            }
            
            // trim
            if(ax0 < bx0) {ax0 = bx0}
            if(az0 < bz0) {az0 = bz0}
            if(ax1 > bx1) {ax1 = bx1}
            if(az1 > bz1) {az1 = bz1}
            
            var width = ax1 - ax0
            var depth = az1 - az0
            var x = ax0 + (width / 2)
            var z = az0 + (depth / 2)
            var y = this.position.y
            
            if(this.parent.combo >= 3) {
                var growth = +1
                if(width < depth) {
                    if(width + growth < 7) {
                        width += growth
                        x -= growth / 2
                    }
                } else {
                    if(depth + growth < 7) {
                        depth += growth
                        z -= growth / 2
                    }
                }
            } 
            
            if(width > MINIMUM_SIZE
            && depth > MINIMUM_SIZE) {
                this.parent.add(new Slab({
                    color: this.color,
                    x: x,
                    y: y,
                    z: z,
                    width: width,
                    depth: depth,
                }))
                
                this.parent.add(new SlidingSlab({
                    x: x,
                    y: y + 1,
                    z: z,
                    width: width,
                    depth: depth,
                    direction: this.direction == "x" ? "z" : "x",
                }))
                
                for(var i = 0; i < Math.min(3, this.parent.combo); i++) {
                    this.parent.add(new Highlight({
                        x: x,
                        y: y + (0.1 * i),
                        z: z,
                        width: width - i,
                        depth: depth - i,
                        colors: ["#FFFFFF", "#EEEEEE", "#CCCCCC"][i]
                    }))
                }
                
                this.parent.score += 1
                
                if(this.parent.combo > 0) {
                    var combo = Math.min(3, this.parent.combo)
                    Sounds["combo" + combo].play()
                } else {
                    Sounds["beep" + Math.round(Math.random() + 1)].play()
                }
            } else {
                this.parent.mode = "done"
                this.parent.recordScore()
            }
            
            this.parent.remove(this)
            
        } else {
            this.position[this.direction] += this.speed * delta
            if(this.speed > 0 && this.position[this.direction] > +BOUNCE_POINT
            || this.speed < 0 && this.position[this.direction] < -BOUNCE_POINT) {
                this.speed *= -1
            }
        }
    }
}

export class Highlight extends Three.Mesh {
    constructor(highlight) {
        var geometry = new Three.BoxGeometry(highlight.width, highlight.depth)
        var material = new Three.MeshLambertMaterial({color: 0xFFFFFF, transparent: true})
        super(geometry, material)
        this.position.x = highlight.x
        this.position.y = highlight.y - 0.5
        this.position.z = highlight.z
        this.rotation.x = Math.PI / 2
    }
    update(delta) {
        this.scale.x += delta
        this.scale.y += delta
        this.material.opacity -= delta
        if(this.material.opacity <= 0) {
            this.parent.remove(this)
        }
    }
}