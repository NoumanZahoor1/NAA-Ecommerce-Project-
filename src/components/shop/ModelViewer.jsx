import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html } from '@react-three/drei';
import { FaCube } from 'react-icons/fa';

const Model = ({ url }) => {
    const { scene } = useGLTF(url);
    const ref = useRef();

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.003; // Slow rotation
        }
    });

    return <primitive object={scene} ref={ref} />;
};

const Loader = () => {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2 text-black dark:text-white">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black dark:border-zinc-800 dark:border-t-white rounded-full animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest">Loading 3D Model</span>
            </div>
        </Html>
    );
};

const ModelViewer = ({ modelUrl, poster }) => {
    // Preload the model
    useGLTF.preload(modelUrl);

    return (
        <div className="w-full h-full relative bg-gray-50 dark:bg-zinc-900 rounded-sm overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 dark:bg-black/90 px-3 py-1.5 rounded-full backdrop-blur-md">
                <FaCube className="text-indigo-600" size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Interactive 3D</span>
            </div>

            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                <Suspense fallback={<Loader />}>
                    <Stage environment="city" intensity={0.6}>
                        <Model url={modelUrl} />
                    </Stage>
                    <OrbitControls autoRotate autoRotateSpeed={0.5} makeDefault />
                </Suspense>
            </Canvas>

            <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/50 dark:bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    Drag to Rotate
                </span>
            </div>
        </div>
    );
};

export default ModelViewer;
