import './style.scss'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import p5 from 'p5';
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

let word = ''

const canvas = document.querySelector('canvas.webgl')

const containerElement = document.getElementById('p5-container');

 containerElement.style.display = 'none'

const box = document.getElementById('box')

const titular = document.getElementById('titular')

function update(){
  word = box.value

  box.blur()
  if( box.value === 'honk'){
      shaderMaterial.uniforms.uValueA.value = 0
  }else {
    shaderMaterial.uniforms.uValueA.value = 1

  }

  box.value = ''
}


titular.addEventListener('click', function (e) {
  update()

});

box.addEventListener("keypress", function(event) {

  if (event.key === "Enter") {

  update()

  }
})

const scene = new THREE.Scene()
//scene.background = new THREE.Color( 0xffffff )




const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  depthWrite: true,
  clipShadows: true,
  wireframe: false,
  side: THREE.DoubleSide,
  uniforms: {
    uFrequency: {
      value: new THREE.Vector2(10, 5)
    },
    uTime: {
      value: 0
    },

    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uPosition: {
      value: {
        x: 0
      }
    },
    uRotation: {
      value: 0



    },
    uValueA: {
      value: 1.
    },
    uValueB: {
      value: Math.random()
    },
    uValueC: {
      value: Math.random()
    },
    uValueD: {
      value: Math.random()
    }
  }
})




const gtlfLoader = new GLTFLoader()

let sceneGroup, bird, gltfVar
gtlfLoader.load(
  'birb.glb',
  (gltf) => {
    console.log(gltf)
    gltfVar = gltf
    gltf.scene.scale.set(2.,2.,2.)
    //gltf.scene.position.x = 10
    //gltf.scene.position.y -= 5
    sceneGroup = gltf.scene
    sceneGroup.needsUpdate = true
    scene.add(sceneGroup)

    sceneGroup.children[0].material = shaderMaterial



} )


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>{



  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ))


})


//P5

let p5C, p5CTex, yStart
const sketch = (p) => {



  p.preload = function(){

}


  p.setup = function() {
   p.createCanvas(800, 400);
  p.textAlign(p.TOP, p.TOP);
  p.textSize(138);
    p5C  = document.getElementById("defaultCanvas0");
    p5CTex = new THREE.CanvasTexture(p5C)
    shaderMaterial.uniforms.uTexture ={
      value: p5CTex
    }

     yStart = 200

  };

  p.draw = function() {



      p.background('rgba(255,255,255,1)')

      if(word ==='honk'){
          p.background('rgba(255,255,0,1)')

      }
      for (let y = yStart; y < 1000; y += 168) {
         p.fill('rgba(0,0,0,1)');
         p.text(word, y, y)
       }
       yStart--;

  p5CTex.needsUpdate = true



    shaderMaterial.needsUpdate = true
  };
};

let sketcHT = new p5(sketch, containerElement);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = -7
camera.position.z = 0
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2 - 0.1
//controls.enableZoom = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x000000, 1)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const light = new THREE.AmbientLight( 0x404040 )
scene.add( light )
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 )
// scene.add( directionalLight )



const clock = new THREE.Clock()

const tick = () =>{

  const elapsedTime = clock.getElapsedTime()

    shaderMaterial.uniforms.uTime.value = elapsedTime
  // Update controls
  if(sceneGroup){
    sceneGroup.rotation.x += .001
    sceneGroup.rotation.y += .001
  }
  controls.update()

  if(shaderMaterial.uniforms.uResolution.value.x === 0 && shaderMaterial.uniforms.uResolution.value.y === 0 ){
    shaderMaterial.uniforms.uResolution.value.x = renderer.domElement.width
    shaderMaterial.uniforms.uResolution.value.y = renderer.domElement.height
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
