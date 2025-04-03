
import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useHelper, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Types
type ConicType = 'circle' | 'ellipse' | 'parabola' | 'hyperbola';

interface ConicParams {
  a: number;
  b: number;
  c: number;
  h: number;
  k: number;
}

interface ConicSectionProps {
  type: ConicType;
  params: ConicParams;
  color?: string;
}

// Helper function to generate points for conics
const generateConicPoints = (type: ConicType, params: ConicParams, segments = 100): THREE.Vector3[] => {
  const { a, b, c, h, k } = params;
  const points: THREE.Vector3[] = [];
  
  switch (type) {
    case 'circle':
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = h + a * Math.cos(theta);
        const z = k + a * Math.sin(theta);
        points.push(new THREE.Vector3(x, 0, z));
      }
      break;
      
    case 'ellipse':
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = h + a * Math.cos(theta);
        const z = k + b * Math.sin(theta);
        points.push(new THREE.Vector3(x, 0, z));
      }
      break;
      
    case 'parabola':
      for (let i = -segments/2; i <= segments/2; i++) {
        const x = (i / (segments/4)) * a;
        const z = k + (x - h) * (x - h) / (4 * a);
        points.push(new THREE.Vector3(x, 0, z));
      }
      break;
      
    case 'hyperbola':
      // First branch
      for (let i = 0; i <= segments/2; i++) {
        const t = -2 + (i / (segments/4)) * 4; // Parametric range
        const x = h + a * Math.cosh(t);
        const z = k + b * Math.sinh(t);
        points.push(new THREE.Vector3(x, 0, z));
      }
      
      // Second branch
      for (let i = segments/2; i >= 0; i--) {
        const t = -2 + (i / (segments/4)) * 4; // Parametric range
        const x = h - a * Math.cosh(t);
        const z = k - b * Math.sinh(t);
        points.push(new THREE.Vector3(x, 0, z));
      }
      break;
  }
  
  return points;
};

// Component to render a conic section
const ConicSection = ({ type, params, color = "#0EA5E9" }: ConicSectionProps) => {
  const points = generateConicPoints(type, params);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <>
      <line>
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial attach="material" color={color} linewidth={2} />
      </line>
      
      {/* Plot the focus points for ellipse, parabola and hyperbola */}
      {type !== 'circle' && (
        <>
          {type === 'ellipse' && (
            <>
              <mesh position={[params.h + Math.sqrt(params.a*params.a - params.b*params.b), 0, params.k]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#F97316" />
              </mesh>
              <mesh position={[params.h - Math.sqrt(params.a*params.a - params.b*params.b), 0, params.k]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#F97316" />
              </mesh>
            </>
          )}
          
          {type === 'hyperbola' && (
            <>
              <mesh position={[params.h + Math.sqrt(params.a*params.a + params.b*params.b), 0, params.k]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#F97316" />
              </mesh>
              <mesh position={[params.h - Math.sqrt(params.a*params.a + params.b*params.b), 0, params.k]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#F97316" />
              </mesh>
            </>
          )}
          
          {type === 'parabola' && (
            <mesh position={[params.h, 0, params.k + params.a]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#F97316" />
            </mesh>
          )}
        </>
      )}
    </>
  );
};

// Scene component with grid and lighting
const Scene = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={1}
        cellColor="#6b7280"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#9ca3af"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      {children}
      <OrbitControls />
    </>
  );
};

// Main visualization component
export default function ConicSectionVisualization() {
  const [type, setType] = useState<ConicType>('circle');
  const [params, setParams] = useState<ConicParams>({ 
    a: 2, 
    b: 1, 
    c: 0, 
    h: 0, 
    k: 0 
  });

  // Get equation string based on conic type
  const getEquation = () => {
    const { a, b, h, k } = params;
    
    switch (type) {
      case 'circle':
        return `(x - ${h})² + (y - ${k})² = ${a*a}`;
      case 'ellipse':
        return `\\frac{(x - ${h})^2}{${a*a}} + \\frac{(y - ${k})^2}{${b*b}} = 1`;
      case 'parabola':
        return `(y - ${k}) = \\frac{1}{4a}(x - ${h})^2`;
      case 'hyperbola':
        return `\\frac{(x - ${h})^2}{${a*a}} - \\frac{(y - ${k})^2}{${b*b}} = 1`;
      default:
        return '';
    }
  };

  const handleTypeChange = (newType: ConicType) => {
    setType(newType);
    
    // Reset parameters based on type
    switch (newType) {
      case 'circle':
        setParams({ a: 2, b: 2, c: 0, h: 0, k: 0 });
        break;
      case 'ellipse':
        setParams({ a: 3, b: 2, c: 0, h: 0, k: 0 });
        break;
      case 'parabola':
        setParams({ a: 1, b: 0, c: 0, h: 0, k: 0 });
        break;
      case 'hyperbola':
        setParams({ a: 2, b: 1, c: 0, h: 0, k: 0 });
        break;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Card className="w-full md:w-64 shadow-lg ar-card">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-4">Conic Section Type</h3>
            <div className="flex flex-col space-y-2 mb-6">
              {(['circle', 'ellipse', 'parabola', 'hyperbola'] as ConicType[]).map((t) => (
                <Button
                  key={t}
                  variant={type === t ? "default" : "outline"}
                  className={`w-full ${type === t ? 'bg-ar-blue text-white' : ''}`}
                  onClick={() => handleTypeChange(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
            
            <div className="space-y-4">
              {type === 'circle' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Radius (a)</label>
                  <Slider
                    value={[params.a]}
                    min={0.5}
                    max={5}
                    step={0.1}
                    onValueChange={(values) => setParams({...params, a: values[0]})}
                  />
                  <div className="text-xs text-right">{params.a.toFixed(1)}</div>
                </div>
              )}
              
              {type === 'ellipse' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Semi-major axis (a)</label>
                    <Slider
                      value={[params.a]}
                      min={0.5}
                      max={5}
                      step={0.1}
                      onValueChange={(values) => {
                        const newA = values[0];
                        setParams({
                          ...params, 
                          a: newA,
                          b: Math.min(params.b, newA) // Ensure b ≤ a
                        });
                      }}
                    />
                    <div className="text-xs text-right">{params.a.toFixed(1)}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Semi-minor axis (b)</label>
                    <Slider
                      value={[params.b]}
                      min={0.5}
                      max={Math.min(5, params.a)}
                      step={0.1}
                      onValueChange={(values) => setParams({...params, b: values[0]})}
                    />
                    <div className="text-xs text-right">{params.b.toFixed(1)}</div>
                  </div>
                </>
              )}
              
              {type === 'parabola' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parameter (a)</label>
                  <Slider
                    value={[params.a]}
                    min={0.5}
                    max={5}
                    step={0.1}
                    onValueChange={(values) => setParams({...params, a: values[0]})}
                  />
                  <div className="text-xs text-right">{params.a.toFixed(1)}</div>
                </div>
              )}
              
              {type === 'hyperbola' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Semi-major axis (a)</label>
                    <Slider
                      value={[params.a]}
                      min={0.5}
                      max={5}
                      step={0.1}
                      onValueChange={(values) => setParams({...params, a: values[0]})}
                    />
                    <div className="text-xs text-right">{params.a.toFixed(1)}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Semi-minor axis (b)</label>
                    <Slider
                      value={[params.b]}
                      min={0.5}
                      max={5}
                      step={0.1}
                      onValueChange={(values) => setParams({...params, b: values[0]})}
                    />
                    <div className="text-xs text-right">{params.b.toFixed(1)}</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-1 w-full">
          <Card className="h-[480px] shadow-lg overflow-hidden ar-card">
            <Canvas camera={{ position: [0, 5, 5], fov: 50 }}>
              <Scene>
                <ConicSection type={type} params={params} />
              </Scene>
            </Canvas>
          </Card>
        </div>
      </div>
      
      <Card className="w-full p-4 shadow-lg ar-card">
        <h3 className="font-bold text-lg mb-2">Equation</h3>
        <div className="math-formula text-lg">
          {getEquation()}
        </div>
        
        <div className="mt-4">
          <h3 className="font-bold text-lg mb-2">Properties</h3>
          {type === 'circle' && (
            <p>A circle is the set of all points in a plane that are at a constant distance (radius) from a fixed point (center).</p>
          )}
          {type === 'ellipse' && (
            <p>An ellipse is the set of all points in a plane such that the sum of distances from two fixed points (foci) is constant.</p>
          )}
          {type === 'parabola' && (
            <p>A parabola is the set of all points in a plane that are equidistant from a fixed point (focus) and a fixed line (directrix).</p>
          )}
          {type === 'hyperbola' && (
            <p>A hyperbola is the set of all points in a plane such that the absolute difference of distances from two fixed points (foci) is constant.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
