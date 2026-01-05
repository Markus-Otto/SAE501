import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';


// --- 1. Le composant qui charge l'OBJ + le MTL ---
function ClassroomModel() {
  // Chargement des matériaux (.mtl)
  const materials = useLoader(MTLLoader, '/SAE501_CHEURFA_BRUSAT_CARPENTIER.mtl');

  // Chargement de l'objet (.obj) en lui appliquant les matériaux
  const obj = useLoader(OBJLoader, '/SAE501_CHEURFA_BRUSAT_CARPENTIER.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  return <primitive object={obj} />;
}

// --- 2. Le composant principal de la scène ---
export default function Scene3D() {
  return (
    <div className="aspect-video w-full rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-2xl">
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        
        {/* IMPORTANT : Pas de balises HTML <p> ou <div> ici ! */}
        <Suspense fallback={null}> 
          <Stage 
            environment="city" 
            intensity={0.5} 
            contactShadow={{ blur: 2, opacity: 0.5 }}
            adjustCamera={true} 
          >
            <ClassroomModel />
          </Stage>
        </Suspense>

        <OrbitControls makeDefault enableDamping={true} />
      </Canvas>
    </div>
  );
}