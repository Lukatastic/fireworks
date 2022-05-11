import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Texture Loader
const loader = new THREE.TextureLoader()
const particle = loader.load('./star-particle.png')

// Debug
var gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 5000;

const posArray = new Float32Array(particlesCnt * 3);

for (let i = 0; i < particlesCnt * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 5)
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Current Mode
var params = {
    isMusicMode: true
};
gui.add(params, "isMusicMode").listen();
gui.open();

// Firework Sound Freq (Music Mode)
var frequency = 0.0;

//EDIT WITH ACTUAL PARTICLE START
var fwkStart = new THREE.Vector3(0,0,0)

var fwkCount = 420;
const fwkGeometry = new THREE.BufferGeometry;
// const fwkGeometry = new THREE.SphereGeometry(0.1, 32, 16);
const fwkArray = new Float32Array(fwkCount * 3);
for (let i = 0; i < fwkCount * 3; i+=3) {
    const fwkPos = new THREE.Vector3
    fwkPos.setFromSpherical(randomSpherePoint(0.025))
    fwkPos.add(fwkStart)
    fwkPos.toArray(fwkArray, i)
}

fwkGeometry.setAttribute('position', new THREE.BufferAttribute(fwkArray, 3))

const shellGeometry = new THREE.SphereGeometry(0.7, 32, 16);
// const shellLight = new THREE.PointLight(0,10,0);

// Firework Helpers
const fwk_E = 100000
const fwk_pa = 1.225
const fwk_p = 1000
const fwk_M = 0.5
const fwk_R = Math.pow((fwk_M/(1000 * fwk_p * Math.PI * (4/3))), 1/3)
const fwk_Cd = 1

const shellTime = 2
var shellVelocity = 2
var shellOffset = 110
var shellClk = new THREE.Clock()
var bloomReady = false
shellClk.getElapsedTime();


//enable fwk recursion
function setFirework() {
    //fwk go up start
    fwkStart = new THREE.Vector3(Math.random() * 20 - 10,Math.random() * 10 - 5,Math.random() * 60 - 50)
    shellClk = new THREE.Clock()
    shellVelocity = 2
    shellMesh.position.set(fwkStart.x, fwkStart.y - shellOffset, fwkStart.z)
    //shellVelocity = 10 * shellTime
    shellMesh.material.opacity = 1
    
    //shellVelocity =s
    //fwk bloom reset
}

function setFireworkFreestyle() {
    //fwk go up start
    mouseX = event.clientX
    mouseY = event.clientY
    fwkStart = new THREE.Vector3(mouseX * (1/9.3) - 103, -mouseY * (1/9.5) + 55, 0)
    shellClk = new THREE.Clock()
    shellVelocity = 2
    shellMesh.position.set(fwkStart.x, fwkStart.y - shellOffset, fwkStart.z)
    //shellVelocity = 10 * shellTime
    shellMesh.material.opacity = 1
    
    //shellVelocity =s
    //fwk bloom reset
}

function fwkBloom() {
    for (let i = 0; i < fwkCount * 3; i+=3) {
        const fwkPos = new THREE.Vector3
        fwkPos.setFromSpherical(randomSpherePoint(0.025))
        fwkPos.add(fwkStart)
        fwkPos.toArray(fwkMesh.geometry.attributes.position.array, i)
    }
    fwkMesh.material.opacity = 0.5
    bloomReady = false
    if (frequency == 440.0) {
        fwkMesh.material.color.setHex(0xe63c3c);
        return
    }
    if (frequency == 493.9) {
        fwkMesh.material.color.setHex(0xe6842e);
        return
    }
    if (frequency == 523.3) {
        fwkMesh.material.color.setHex(0xe6d72e);
        return
    }
    if (frequency == 587.3) {
        fwkMesh.material.color.setHex(0x71e62e);
        return
    }
    if (frequency == 659.3) {
        fwkMesh.material.color.setHex(0x2ee0e6);
        return
    }
    if (frequency == 698.5) {
        fwkMesh.material.color.setHex(0x2e6be6);
        return
    }
    if (frequency == 784.0) {
        fwkMesh.material.color.setHex(0x782ee6);
        return
    }
    if (frequency == 880.0) {
        fwkMesh.material.color.setHex(0xe62ee3);
        return
    } 
    fwkMesh.material.color.setHex(Math.floor(Math.random()*16777215));
}

function randomSpherePoint(radius){
   //pick numbers between 0 and 1
   var u = Math.random();
   var v = Math.random();
   // create random spherical coordinate
   var theta = 2 * Math.PI * u;
   var phi = Math.acos(2 * v - 1);
   return new THREE.Spherical(radius, phi, theta)
}
//fwk non-recursive end

// Materials

const material = new THREE.PointsMaterial({
    size: 0.005
})

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    transparent: true,
    color: 'blue'
})

const shellMaterial = new THREE.MeshBasicMaterial({
    size: 4,
    //map: particle,
    //transparent: true,
    opacity: 0.5,
    color: 'white',
    alphaTest: 0.01
})

const fwkMaterial = new THREE.PointsMaterial({
    size: 4,
    map: particle,
    transparent: true,
    opacity: 0.5,
    color: 'red',
    alphaTest: 0.01
})

//material.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
const fwkMesh = new THREE.Points(fwkGeometry, fwkMaterial)
const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial)
shellMesh.position.set(0, -91.5, 0)
scene.add(sphere, particlesMesh, fwkMesh, shellMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

camera.position.set(0,0,69)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#21282a'), 1)

// Mouse
document.addEventListener('mousemove', animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(event) {
    mouseX = event.clientX
    mouseY = event.clientY
}


/**
 * Animate
 */

const clock = new THREE.Clock()

//setInterval(setFirework, 8000);

const tick = () =>
{
    fwkMesh.geometry.attributes.position.needsUpdate = true;
    shellMesh.position.needsUpdate = true;
    const fwk_dt = clock.getDelta();
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    //particlesMesh.rotation.y = -0.5 * elapsedTime
    if (mouseX > 0) { 
    particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008)
    particlesMesh.rotation.y = mouseX + (elapsedTime * 0.00008)
    }

    //fwk shell physics

    //shellVelocity = shellVelocity + -0.05 * Math.pow(shellClk.getElapsedTime(), 1.5)
    shellVelocity = shellVelocity + -0.05 * Math.pow(shellClk.getElapsedTime(), 1.5)
    shellMesh.position.set(shellMesh.position.x, shellMesh.position.y + shellVelocity, shellMesh.position.z);

    if (shellVelocity < 0 && shellMesh.material.opacity != 0) {
        shellMesh.material.opacity = 0
        bloomReady = true
    }

    if (bloomReady == true) {
        fwkBloom()
    }


    //fwk bloom physics
    const fwkPositions = fwkMesh.geometry.attributes.position.array
    for (let i = 0; i < fwkCount * 3; i+=3) {
        var currParticle = new THREE.Vector3()
        currParticle.fromArray(fwkPositions, i)
        var distToCtr = currParticle.distanceTo(fwkStart)
        var normie = new THREE.Vector3()
        normie.copy(currParticle)
        normie.sub(fwkStart)
        normie.normalize()
        var v_in = Math.sqrt((2 * fwk_E)/fwk_M) * Math.pow(Math.E, -((3*fwk_Cd*fwk_pa)/(8*fwk_p*fwk_R)) * distToCtr)
        normie.multiplyScalar(v_in)
        normie.multiplyScalar(0.002)
        currParticle.add(normie)
        if (distToCtr > 38) {
            fwkMesh.material.opacity = fwkMesh.material.opacity - 0.00002
        } else {}
        
        // var modi = new THREE.Vector3((Math.random() - 0.5)/1000, Math.random()/1000, Math.random()/1000)
        // currParticle.add(modi)
        currParticle.toArray(fwkPositions, i)
    }

    //     if (mouseX > 0) { 
    // fwkMesh.rotation.x = -mouseX * (elapsedTime * 0.0000008)
    // fwkMesh.rotation.y = mouseY + (elapsedTime * 0.0000008)
    // }

    // fwkMesh.rotation.x = -0.1 * elapsedTime
    // fwkMesh.rotation.y = 0.1 * elapsedTime


    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// A4
addEventListener('keydown', (e)=> {
    if (e.keyCode === 65 && params.isMusicMode) {
        e.preventDefault();
        frequency = 440.0
        setFirework()
        var context = new AudioContext()
        var o = context.createOscillator()
        var g = context.createGain()
        o.frequency.value = frequency
        o.connect(g)
        g.connect(context.destination)
        o.start(0)
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5)
    }
})

// B4
addEventListener('keydown', (e)=> {
    if (e.keyCode === 83 && params.isMusicMode) {
        e.preventDefault();
        frequency = 493.9
        setFirework()
        var context = new AudioContext()
        var o = context.createOscillator()
        var g = context.createGain()
        o.frequency.value = frequency
        o.connect(g)
        g.connect(context.destination)
        o.start(0)
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5)
    }
})

// C5
addEventListener('keydown', (e)=> {
    if (e.keyCode === 68 && params.isMusicMode) {
        e.preventDefault();
        frequency = 523.3
        setFirework()
        var context = new AudioContext()
        var o = context.createOscillator()
        var g = context.createGain()
        o.frequency.value = frequency
        o.connect(g)
        g.connect(context.destination)
        o.start(0)
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5)
    }
})

// D5
addEventListener('keydown', (e)=> {
    if (e.keyCode === 70 && params.isMusicMode) {
        e.preventDefault();
        frequency = 587.3
        setFirework()
        var context = new AudioContext()
        var o = context.createOscillator()
        var g = context.createGain()
        o.frequency.value = frequency
        o.connect(g)
        g.connect(context.destination)
        o.start(0)
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5)
    }
})

// E5
addEventListener('keydown', (e)=> {
    if (e.keyCode === 71 && params.isMusicMode) {
        e.preventDefault();
        frequency = 659.3
        setFirework()
        var context = new AudioContext()
        var o = context.createOscillator()
        var g = context.createGain()
        o.frequency.value = frequency
        o.connect(g)
        g.connect(context.destination)
        o.start(0)
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5)
    }
})

// F5
addEventListener('keydown', (e)=> {
    if (e.keyCode === 72 && params.isMusicMode) {
        e.preventDefault();
        frequency = 698.5
        setFirework()
        var context = new AudioContext()
        var o = context.createOscillator()
        var g = context.createGain()
        o.frequency.value = frequency
        o.connect(g)
        g.connect(context.destination)
        o.start(0)
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5)
    }
})

// G5
addEventListener('keydown', (e)=> {
    if (e.keyCode === 74 && params.isMusicMode) {
        e.preventDefault();
        frequency = 784.0
        setFirework()
        var context = new AudioContext()
        var o = context.createOscillator()
        var g = context.createGain()
        o.frequency.value = frequency
        o.connect(g)
        g.connect(context.destination)
        o.start(0)
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5)
    }
})

// A5
addEventListener('keydown', (e)=> {
    if (e.keyCode === 75 && params.isMusicMode) {
        e.preventDefault();
        frequency = 880.0
        setFirework()
        var context = new AudioContext()
        var o = context.createOscillator()
        var g = context.createGain()
        o.frequency.value = frequency
        o.connect(g)
        g.connect(context.destination)
        o.start(0)
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5)
    }
})

// Freestyle Mode
addEventListener('click', (e)=> {
    if (!params.isMusicMode) {
        setFireworkFreestyle()
    }
})

// Switch Modes (Music/Freestyle)
addEventListener('keydown', (e)=> {
    if (e.keyCode === 13) {
        params.isMusicMode = !params.isMusicMode
        if (!params.isMusicMode) {
            frequency = 0.0
        }
    }
})