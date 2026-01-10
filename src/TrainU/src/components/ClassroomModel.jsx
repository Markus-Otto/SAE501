import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

// Affiche la progression du téléchargement du fichier .glb
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ 
        color: 'white', 
        background: 'rgba(15, 23, 42, 0.9)', 
        padding: '15px 25px', 
        borderRadius: '12px', 
        border: '1px solid #38bdf8',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>Chargement de la salle 3D</p>
        <p style={{ margin: '5px 0 0 0', color: '#38bdf8', fontSize: '1.2em' }}>{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

function ClassroomModel() {
  // Chargement du fichier GLB
  const { scene } = useGLTF("/SAE501_CHEURFA_BRUSAT_CARPENTIER.glb");

  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Condition stricte : on cherche l'objet dont le nom est exactement "Cube" 
        // Cela exclut Cube001, Cube002, etc.
        if (child.name === "Cube") {
          child.material.transparent = true;
          child.material.opacity = 0.3; // Rendu plus léger pour les murs
          child.material.side = THREE.DoubleSide; // Visible de partout
          child.material.depthWrite = true;
          
          // Optionnel : donner une légère teinte bleutée aux murs transparents
          child.material.color.set("#e2e8f0");
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

export default function Scene3D() {
  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800">
      <Canvas
        camera={{ position: [15, 12, 15], fov: 35 }}
        dpr={[1, 2]} 
        gl={{ 
            antialias: true,
            outputColorSpace: THREE.SRGBColorSpace 
        }}
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 15, 10]} intensity={2} />
        <directionalLight position={[-10, 10, 5]} intensity={1} />

        <Suspense fallback={<Loader />}>
          <ClassroomModel />
        </Suspense>

        <OrbitControls 
            enableDamping={true} 
            dampingFactor={0.05}
            minDistance={8}
            maxDistance={40}
            makeDefault 
        />
      </Canvas>
    </div>
  );
}