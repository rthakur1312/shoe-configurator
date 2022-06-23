import './App.css';
import { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {ContactShadows, Environment, useGLTF, OrbitControls} from '@react-three/drei'
import {HexColorPicker} from 'react-colorful'
import { proxy, useSnapshot } from 'valtio'

const state = proxy({
  current: null,
  items: {
    laces: "#ff000",
    mesh: "#ffffff",
    caps: "#ffffff",
    inner: "#ffffff",
    sole: "#ffffff",
    stripes: "#ffffff",
    band: "#ffffff",
    patch: "#ffffff",
  },
})


function Shoe(props) {

  const group = useRef()
  const snap = useSnapshot(state)
  const {nodes, materials} = useGLTF('shoe-draco.glb')
  const {hovered, set} = useState(null)



  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20
    group.current.rotation.x = Math.cos(t / 4) / 8
    group.current.rotation.y = Math.sin(t / 4) / 8
    group.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })

  

  return (
      <group
        ref={group} {...props} dispose={null}
        onPointerOver={(e) => (e.stopPropagation(), set(e.object.material.name))}
        onPointerOut={(e) => e.intersections.length === 0 && set(null)}
        onPointerMissed={() => (state.current = null)}
        onPointerDown={(e) => (e.stopPropagation(), (state.current = e.object.material.name))}
        >
        <mesh geometry={nodes.shoe.geometry} material={materials.laces} material-color={snap.items.laces} />
      <mesh geometry={nodes.shoe_1.geometry} material={materials.mesh} material-color={snap.items.mesh} />
      <mesh geometry={nodes.shoe_2.geometry} material={materials.caps} material-color={snap.items.caps} />
      <mesh geometry={nodes.shoe_3.geometry} material={materials.inner} material-color={snap.items.inner} />
      <mesh geometry={nodes.shoe_4.geometry} material={materials.sole} material-color={snap.items.sole} />
      <mesh geometry={nodes.shoe_5.geometry} material={materials.stripes} material-color={snap.items.stripes} />
      <mesh geometry={nodes.shoe_6.geometry} material={materials.band} material-color={snap.items.band} />
      <mesh geometry={nodes.shoe_7.geometry} material={materials.patch} material-color={snap.items.patch} />
      </group>
    )
}

function Picker() {
  const snap = useSnapshot(state)
  return (
    <div  className = "picker-container">
      <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
      <h1>{snap.current} </h1>
    </div>
  )
}

function App() {
  return (
    <>
    <Picker />
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.3} angle={0.1} penumbra={1} position={[5, 25, 20]} />
      <Suspense fallback = {null}>
        <Shoe />
        <Environment files="royal_esplanade_1k.hdr" />
        <ContactShadows rotation-x={Math.PI / 2} position={[0, -0.8, 0]} opacity={0.25} width={10} height={10} blur={2} far={1} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} />
      {/* minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} */}
    </Canvas>
    
    </>
  );
}

export default App;
