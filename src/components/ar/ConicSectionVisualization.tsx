
import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Cone, Circle, Box } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  showPerimeter?: boolean;
  isIntersection?: boolean;
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

// Component to render a 3D cone
const ConeModel = ({ height = 8, radius = 4 }) => {
  const coneGeometry = useMemo(() => new THREE.ConeGeometry(radius, height, 32), [radius, height]);
  
  return (
    <mesh position={[0, height/2, 0]} rotation={[0, 0, Math.PI]}>
      <primitive object={coneGeometry} />
      <meshStandardMaterial color="#888888" transparent opacity={0.7} wireframe={false} />
    </mesh>
  );
};

// Component to render a cutting plane
const CuttingPlane = ({ 
  type, 
  planeAngle = 0,
  planeSize = 10, 
  planePosition = 0,
  color = "#1E88E5"
}: {
  type: ConicType;
  planeAngle?: number;
  planeSize?: number;
  planePosition?: number;
  color?: string;
}) => {
  // Calculate position and rotation based on conic type and angle
  const [position, rotation] = useMemo(() => {
    // Base position for the plane (centered on cone axis)
    const pos: [number, number, number] = [0, 4 + planePosition, 0];
    
    let rot: [number, number, number];
    
    switch (type) {
      case 'circle':
        // Perpendicular to cone axis
        rot = [0, 0, 0];
        break;
      case 'ellipse':
        // Angled cut but not parallel to generator
        rot = [Math.PI / 6 + planeAngle, 0, 0];
        break;
      case 'parabola':
        // Parallel to one generator line
        rot = [Math.PI / 4, 0, 0];
        break;
      case 'hyperbola':
        // Steeper angle to intersect both nappes
        rot = [Math.PI / 2.5 - planeAngle, 0, 0];
        break;
      default:
        rot = [0, 0, 0];
    }
    
    return [pos, rot];
  }, [type, planeAngle, planePosition]);
  
  // Calculate the intersection curve for highlighting
  const intersectionPoints = useMemo(() => {
    // This is a simplified calculation - in a real implementation
    // we would calculate the actual intersection curve based on
    // the cone and plane equations
    return generateConicPoints(type, { a: 2, b: 1, c: 0, h: 0, k: 0 });
  }, [type]);
  
  return (
    <>
      <mesh position={position as THREE.Vector3} rotation={rotation as unknown as THREE.Euler}>
        <planeGeometry args={[planeSize, planeSize]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Highlight the intersection */}
      <group position={[0, -5, 0]}>
        <line>
          <bufferGeometry>
            <float32BufferAttribute
              attach="attributes-position"
              array={new Float32Array(intersectionPoints.flatMap(p => [p.x, p.y, p.z]))}
              count={intersectionPoints.length}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#FFD700" linewidth={3} />
        </line>
      </group>
    </>
  );
};

// Component to render a conic section
const ConicSection = ({ type, params, color = "#0EA5E9", showPerimeter = true, isIntersection = false }: ConicSectionProps) => {
  const points = useMemo(() => generateConicPoints(type, params), [type, params]);
  
  // Create positions array for the buffer geometry
  const positions = useMemo(() => {
    return new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
  }, [points]);
  
  // Create indices for line segments (connecting points)
  const indices = useMemo(() => {
    const idx = [];
    for (let i = 0; i < points.length - 1; i++) {
      idx.push(i, i + 1);
    }
    if (type !== 'parabola') {
      // Connect the last and first point to close the loop
      idx.push(points.length - 1, 0);
    }
    return new Uint16Array(idx);
  }, [points, type]);
  
  return (
    <>
      <group>
        {/* Perimeter outline */}
        {showPerimeter && (
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={positions}
                itemSize={3}
              />
              <bufferAttribute
                attach="index"
                array={indices}
                itemSize={1}
              />
            </bufferGeometry>
            <lineBasicMaterial color={isIntersection ? "#FFD700" : "#000000"} linewidth={isIntersection ? 3 : 2} />
          </line>
        )}
        
        {/* Filled shape */}
        <mesh>
          <shapeGeometry args={[new THREE.Shape(points.map(p => new THREE.Vector2(p.x, p.z)))]} />
          <meshBasicMaterial color={color} opacity={0.5} transparent side={THREE.DoubleSide} />
        </mesh>
        
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
      </group>
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
      <OrbitControls makeDefault />
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
  const [viewMode, setViewMode] = useState<'standard' | '3d-cone'>('3d-cone');
  const [showCuttingPlane, setShowCuttingPlane] = useState(true);
  const [planePosition, setPlanePosition] = useState(0);
  const [planeAngle, setPlaneAngle] = useState(0);
  
  // Effect to update params when type changes to show correct shape
  useEffect(() => {
    handleTypeChange(type);
  }, [type]);

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
        setPlaneAngle(0);
        break;
      case 'ellipse':
        setParams({ a: 3, b: 2, c: 0, h: 0, k: 0 });
        setPlaneAngle(0.3);
        break;
      case 'parabola':
        setParams({ a: 1, b: 0, c: 0, h: 0, k: 0 });
        setPlaneAngle(0.5);
        break;
      case 'hyperbola':
        setParams({ a: 2, b: 1, c: 0, h: 0, k: 0 });
        setPlaneAngle(0.7);
        break;
    }
  };

  // Tooltip content for each control
  const getTooltipContent = (controlType: string) => {
    switch (controlType) {
      case 'circle':
        return "A circle is formed when a plane intersects a cone perpendicular to its axis";
      case 'ellipse':
        return "An ellipse is formed when a plane intersects a cone at an angle to its axis";
      case 'parabola':
        return "A parabola is formed when a plane intersects a cone parallel to a generator line";
      case 'hyperbola':
        return "A hyperbola is formed when a plane intersects both nappes of a cone";
      case 'plane-position':
        return "Adjust the height of the cutting plane";
      case 'plane-angle':
        return "Adjust the angle of the cutting plane";
      case 'radius':
        return "Adjust the radius of the circle";
      case 'semi-major':
        return "Adjust the semi-major axis length";
      case 'semi-minor':
        return "Adjust the semi-minor axis length";
      case 'parameter':
        return "Adjust the parameter of the parabola";
      default:
        return "";
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Card className="w-full md:w-64 shadow-lg ar-card">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-4">Visualization Type</h3>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'standard' | '3d-cone')} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="standard">Standard</TabsTrigger>
                  <TabsTrigger value="3d-cone">3D Cone</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <h3 className="text-lg font-bold mb-4">Conic Section Type</h3>
              <div className="flex flex-col space-y-2 mb-6">
                {(['circle', 'ellipse', 'parabola', 'hyperbola'] as ConicType[]).map((t) => (
                  <Tooltip key={t}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={type === t ? "default" : "outline"}
                        className={`w-full ${type === t ? 'bg-ar-blue text-white' : ''}`}
                        onClick={() => handleTypeChange(t)}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {getTooltipContent(t)}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              
              {viewMode === '3d-cone' && (
                <div className="space-y-4">
                  <div className="flex items-center mb-2">
                    <label className="text-sm font-medium flex-1">Cutting Plane</label>
                    <Button 
                      size="sm" 
                      variant={showCuttingPlane ? "default" : "outline"}
                      onClick={() => setShowCuttingPlane(!showCuttingPlane)}
                      className="ml-2"
                    >
                      {showCuttingPlane ? "Hide" : "Show"}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="text-sm font-medium">Plane Position</label>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getTooltipContent('plane-position')}
                      </TooltipContent>
                    </Tooltip>
                    <Slider
                      value={[planePosition]}
                      min={-4}
                      max={4}
                      step={0.1}
                      onValueChange={(values) => setPlanePosition(values[0])}
                    />
                    <div className="text-xs text-right">{planePosition.toFixed(1)}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="text-sm font-medium">Plane Angle</label>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getTooltipContent('plane-angle')}
                      </TooltipContent>
                    </Tooltip>
                    <Slider
                      value={[planeAngle]}
                      min={0}
                      max={1.5}
                      step={0.05}
                      onValueChange={(values) => setPlaneAngle(values[0])}
                    />
                    <div className="text-xs text-right">{planeAngle.toFixed(2)}</div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-bold mb-2">Shape Parameters</h3>
                
                {type === 'circle' && (
                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="text-sm font-medium">Radius (a)</label>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getTooltipContent('radius')}
                      </TooltipContent>
                    </Tooltip>
                    <Slider
                      value={[params.a]}
                      min={0.5}
                      max={5}
                      step={0.1}
                      onValueChange={(values) => setParams({...params, a: values[0], b: values[0]})}
                    />
                    <div className="text-xs text-right">{params.a.toFixed(1)}</div>
                  </div>
                )}
                
                {type === 'ellipse' && (
                  <>
                    <div className="space-y-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <label className="text-sm font-medium">Semi-major axis (a)</label>
                        </TooltipTrigger>
                        <TooltipContent>
                          {getTooltipContent('semi-major')}
                        </TooltipContent>
                      </Tooltip>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <label className="text-sm font-medium">Semi-minor axis (b)</label>
                        </TooltipTrigger>
                        <TooltipContent>
                          {getTooltipContent('semi-minor')}
                        </TooltipContent>
                      </Tooltip>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="text-sm font-medium">Parameter (a)</label>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getTooltipContent('parameter')}
                      </TooltipContent>
                    </Tooltip>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <label className="text-sm font-medium">Semi-major axis (a)</label>
                        </TooltipTrigger>
                        <TooltipContent>
                          {getTooltipContent('semi-major')}
                        </TooltipContent>
                      </Tooltip>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <label className="text-sm font-medium">Semi-minor axis (b)</label>
                        </TooltipTrigger>
                        <TooltipContent>
                          {getTooltipContent('semi-minor')}
                        </TooltipContent>
                      </Tooltip>
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
              <Canvas camera={{ position: viewMode === '3d-cone' ? [6, 3, 6] : [0, 5, 5], fov: 50 }}>
                <Scene>
                  {viewMode === 'standard' ? (
                    <ConicSection type={type} params={params} showPerimeter={true} />
                  ) : (
                    <>
                      <ConeModel />
                      {showCuttingPlane && (
                        <CuttingPlane 
                          type={type} 
                          planePosition={planePosition}
                          planeAngle={planeAngle}
                        />
                      )}
                      {/* Also display the resulting conic section */}
                      <group position={[0, -5, 0]}>
                        <ConicSection type={type} params={params} isIntersection={true} />
                      </group>
                    </>
                  )}
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
              <p>A circle is the set of all points in a plane that are at a constant distance (radius) from a fixed point (center). It is formed by a plane cutting a cone perpendicular to its axis.</p>
            )}
            {type === 'ellipse' && (
              <p>An ellipse is the set of all points in a plane such that the sum of distances from two fixed points (foci) is constant. It is formed when a plane cuts a cone at an angle to its axis (not parallel to any generator).</p>
            )}
            {type === 'parabola' && (
              <p>A parabola is the set of all points in a plane that are equidistant from a fixed point (focus) and a fixed line (directrix). It is formed when a plane cuts a cone parallel to exactly one generator line of the cone.</p>
            )}
            {type === 'hyperbola' && (
              <p>A hyperbola is the set of all points in a plane such that the absolute difference of distances from two fixed points (foci) is constant. It forms when a plane cuts both nappes of a cone in a steep angle relative to the axis.</p>
            )}
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
}
