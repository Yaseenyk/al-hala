"use client";

import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  N8AO,
  SMAA,
} from "@react-three/postprocessing";
import { useReducedMotion } from "motion/react";
import { Suspense, useMemo, useRef } from "react";
import { MathUtils, SRGBColorSpace, type Group } from "three";

import { useBoxBuilder } from "@/store/box-builder";

/**
 * The single WebGL surface for the gift box.
 *
 * Never import this module directly from a page — it pulls in three.js (~880kB compiled)
 * and would land in the initial bundle, blocking first paint. Go through
 * `GiftBoxScene.tsx`, which wraps it in `next/dynamic({ ssr: false })`.
 */

const MONOGRAM = "/brand/alhala-monogram-1024.png";

const MIN_POLAR = Math.PI / 6;
const MAX_POLAR = Math.PI / 2.4;
const ROTATION_PER_STEP = Math.PI / 10;
const DAMPING = 3;

/**
 * The box is HOLLOW: a floor plus four walls, with a liner inside.
 * A solid cube with spheres embedded in it shows only the caps poking through the top —
 * they read as coins glued on. A gift box is a container; it has to actually be one.
 */
const W = 2.2;
const H = 1;
const T = 0.09;
const FLOOR_Y = -H / 2 + T / 2;
const INNER_FLOOR = -H / 2 + T;

/** Every edge is bevelled. A perfect 90° corner never catches a highlight, and nothing
 *  says "untextured primitive" louder than an edge with no light on it. */
const BEVEL = 0.035;
const SMOOTH = 6;

const LID_H = 0.14;
const LID_W = W + 0.16;
const LID_REST_Y = 0.95;
const LID_TILT = -0.09;

const RIBBON_T = 0.16;

export interface GiftBoxCanvasProps {
  step?: number;
  /** FIXED brand vars (never theme-swapped) naming the material colours. */
  bodyVar?: string;
  lidVar?: string;
  ribbonVar?: string;
  autoRotate?: boolean;
}

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Uneven sizes, uneven heights, two shapes. Eight identical spheres on a grid read as a
 *  marble run; sweets in a box are jumbled. `squash` flattens a piece into a pastille. */
const CANDIES: readonly {
  x: number;
  z: number;
  r: number;
  squash: number;
  tone: 0 | 1 | 2;
}[] = [
  { x: -0.56, z: -0.54, r: 0.21, squash: 0.72, tone: 0 },
  { x: 0.01, z: -0.62, r: 0.18, squash: 1, tone: 2 },
  { x: 0.58, z: -0.5, r: 0.22, squash: 0.68, tone: 1 },
  { x: -0.61, z: 0.04, r: 0.19, squash: 1, tone: 1 },
  { x: -0.02, z: 0.01, r: 0.23, squash: 0.75, tone: 0 },
  { x: 0.6, z: 0.1, r: 0.18, squash: 1, tone: 2 },
  { x: -0.42, z: 0.6, r: 0.2, squash: 0.7, tone: 2 },
  { x: 0.26, z: 0.62, r: 0.22, squash: 1, tone: 1 },
];

function GiftBox({
  step,
  bodyVar = "--brand-deep",
  lidVar = "--brand-cream",
  ribbonVar = "--brand-saffron",
}: GiftBoxCanvasProps) {
  const group = useRef<Group>(null);
  const lid = useRef<Group>(null);
  const storeStep = useBoxBuilder((state) => state.currentStep);
  const reduceMotion = useReducedMotion();

  const driver = step ?? storeStep;

  const monogram = useTexture(MONOGRAM, (texture) => {
    // Without this the artwork renders washed out — three assumes linear, the PNG is sRGB.
    texture.colorSpace = SRGBColorSpace;
  });

  const colors = useMemo(
    () => ({
      body: readToken(bodyVar),
      lid: readToken(lidVar),
      ribbon: readToken(ribbonVar),
      candy: [
        readToken("--brand-saffron"),
        readToken("--brand-saffron-soft"),
        readToken("--brand-cream"),
      ],
    }),
    [bodyVar, lidVar, ribbonVar],
  );

  useFrame((_, delta) => {
    if (group.current === null || lid.current === null) return;

    const targetRotation = (driver - 1) * ROTATION_PER_STEP;
    const targetLift = LID_REST_Y + Math.min(Math.max(driver - 1, 0), 3) * 0.08;

    if (reduceMotion) {
      group.current.rotation.y = targetRotation;
      lid.current.position.y = targetLift;
      return;
    }

    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      targetRotation,
      DAMPING,
      delta,
    );
    lid.current.position.y = MathUtils.damp(
      lid.current.position.y,
      targetLift,
      DAMPING,
      delta,
    );
  });

  const walls = [
    [0, W / 2 - T / 2, W, T],
    [0, -(W / 2 - T / 2), W, T],
    [W / 2 - T / 2, 0, T, W - 2 * T],
    [-(W / 2 - T / 2), 0, T, W - 2 * T],
  ] as const;

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      {/* Floor */}
      <RoundedBox
        args={[W, T, W]}
        radius={BEVEL}
        smoothness={SMOOTH}
        position={[0, FLOOR_Y, 0]}
        castShadow
        receiveShadow
      >
        {/* `sheen` is the whole point here: it is the faint velvety rim-light that fabric
            and uncoated card have and plastic does not. Without it, cream card renders as
            a shiny toy. */}
        <meshPhysicalMaterial
          color={colors.body}
          roughness={0.9}
          metalness={0}
          sheen={0.5}
          sheenRoughness={0.7}
          sheenColor={colors.lid}
        />
      </RoundedBox>

      {/* Four walls */}
      {walls.map(([x, z, sx, sz]) => (
        <RoundedBox
          key={`${x}-${z}`}
          args={[sx, H, sz]}
          radius={BEVEL}
          smoothness={SMOOTH}
          position={[x, 0, z]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color={colors.body}
            roughness={0.9}
            metalness={0}
            sheen={0.5}
            sheenRoughness={0.7}
            sheenColor={colors.lid}
          />
        </RoundedBox>
      ))}

      {/* Liner. A pale inner skin, inset a hair from the walls — real boxes are lined, and
          the light band it puts around the cavity is what gives the interior depth. */}
      <RoundedBox
        args={[W - 2 * T - 0.01, H - T - 0.02, W - 2 * T - 0.01]}
        radius={0.02}
        smoothness={SMOOTH}
        position={[0, 0.06, 0]}
        receiveShadow
      >
        <meshPhysicalMaterial
          color={colors.lid}
          roughness={0.95}
          metalness={0}
          sheen={0.6}
          sheenColor={colors.lid}
          side={1}
        />
      </RoundedBox>

      {/* The sweets, sitting on the floor of an actual cavity. */}
      {CANDIES.map((candy) => (
        <mesh
          key={`${candy.x}-${candy.z}`}
          position={[candy.x, INNER_FLOOR + candy.r * candy.squash * 0.92, candy.z]}
          scale={[1, candy.squash, 1]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[candy.r, 32, 32]} />
          {/* Clearcoat is the sugar glaze — a thin glossy layer OVER a duller base. It is
              what separates a confection from a billiard ball. */}
          <meshPhysicalMaterial
            color={colors.candy[candy.tone]}
            roughness={0.45}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
        </mesh>
      ))}

      {/* Ribbon, wrapping the body only. A lifted lid has nothing to wrap. */}
      <RoundedBox
        args={[RIBBON_T, H + 0.02, W + 0.025]}
        radius={0.02}
        smoothness={SMOOTH}
        castShadow
      >
        <meshPhysicalMaterial
          color={colors.ribbon}
          roughness={0.2}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>
      <RoundedBox
        args={[W + 0.025, H + 0.02, RIBBON_T]}
        radius={0.02}
        smoothness={SMOOTH}
        castShadow
      >
        <meshPhysicalMaterial
          color={colors.ribbon}
          roughness={0.2}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Lid: a slab plus a SKIRT — the lip that drops over the body. A lid without a skirt
          is a floating tile, which is exactly what the last one looked like. */}
      <group ref={lid} position={[0, LID_REST_Y, 0]} rotation={[0, 0, LID_TILT]}>
        <RoundedBox
          args={[LID_W, LID_H, LID_W]}
          radius={BEVEL}
          smoothness={SMOOTH}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color={colors.lid}
            roughness={0.85}
            metalness={0}
            sheen={0.5}
            sheenRoughness={0.7}
            sheenColor={colors.lid}
          />
        </RoundedBox>

        {[
          [0, LID_W / 2 - T / 2, LID_W, T],
          [0, -(LID_W / 2 - T / 2), LID_W, T],
          [LID_W / 2 - T / 2, 0, T, LID_W - 2 * T],
          [-(LID_W / 2 - T / 2), 0, T, LID_W - 2 * T],
        ].map(([x, z, sx, sz]) => (
          <RoundedBox
            key={`skirt-${x}-${z}`}
            args={[sx!, 0.2, sz!]}
            radius={0.02}
            smoothness={SMOOTH}
            position={[x!, -LID_H / 2 - 0.09, z!]}
            castShadow
          >
            <meshPhysicalMaterial
              color={colors.lid}
              roughness={0.85}
              metalness={0}
              sheen={0.5}
              sheenColor={colors.lid}
            />
          </RoundedBox>
        ))}

        {/* Gold rule inset from the lid edge — the one detail that reads as "finished". */}
        <mesh position={[0, LID_H / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[LID_W / 2 - 0.14, LID_W / 2 - 0.12, 4, 1, Math.PI / 4]} />
          <meshPhysicalMaterial color={colors.ribbon} roughness={0.25} metalness={1} />
        </mesh>

        {/* The mark, laid on the lid. Square plane on a square asset — aspect preserved,
            never recoloured or stretched. Brand kit, §RULES. */}
        <mesh position={[0, LID_H / 2 + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.35, 1.35]} />
          <meshStandardMaterial map={monogram} transparent roughness={0.8} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}

export default function GiftBoxCanvas({
  step,
  bodyVar,
  lidVar,
  ribbonVar = "--brand-saffron",
  autoRotate = false,
}: GiftBoxCanvasProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2, 5.6], fov: 32 }}
      // Decorative — the builder's real controls are DOM. Without this a screen reader
      // announces an unlabelled interactive region it cannot operate.
      aria-hidden
      className="size-full"
    >
      {/*
        THE ENVIRONMENT IS THE FIX FOR THE GOLD.

        A metal is pure reflection — `metalness: 1` means the surface shows its
        surroundings and nothing else. With no environment it reflects black, and gold
        renders as flat muddy brown. That was the bug.

        Built from Lightformers rather than an HDRI preset on purpose: `preset="studio"`
        fetches a multi-megabyte .hdr from a CDN at runtime — a third-party request and a
        hard dependency on someone else's uptime. These are local geometry.
      */}
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 4, -4]} scale={[10, 6, 1]} />
        <Lightformer
          intensity={2.2}
          position={[-5, 1, 1]}
          scale={[10, 3, 1]}
          rotation-y={Math.PI / 2}
        />
        <Lightformer
          intensity={1.5}
          position={[5, 0, 1]}
          scale={[10, 3, 1]}
          rotation-y={-Math.PI / 2}
        />
        <Lightformer intensity={0.8} position={[0, -3, 3]} scale={[8, 3, 1]} />
      </Environment>

      <ambientLight intensity={0.2} />
      {/* One shadow caster. One shadow reads as one sun; two read as a mistake. */}
      <directionalLight
        position={[4, 7, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      />

      <Suspense fallback={null}>
        <GiftBox step={step} bodyVar={bodyVar} lidVar={lidVar} ribbonVar={ribbonVar} />
      </Suspense>

      <ContactShadows
        position={[0, -0.62, 0]}
        opacity={0.45}
        scale={8}
        blur={2.4}
        far={2.5}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={MIN_POLAR}
        maxPolarAngle={MAX_POLAR}
        // Idle drift is motion the user never asked for and cannot scroll away from.
        autoRotate={autoRotate && !reduceMotion}
        autoRotateSpeed={0.45}
        enableDamping
      />

      {/*
        POSTPROCESSING — this is what separates "rendered" from "photographed".

        N8AO (ambient occlusion) is the big one: it darkens the crevices where surfaces
        meet — under the lid skirt, between the sweets, in the corners of the cavity. Real
        light cannot reach those places. Raster lighting alone never darkens them, which is
        precisely why untouched CG looks flat and plastic.

        DepthOfField is the reference's signature: the subject sharp, everything else
        falling away. Bloom lets the gold specular actually bloom instead of clipping.
        SMAA cleans the bevel edges, which alias badly at this size.
      */}
      {!reduceMotion && (
        <EffectComposer enableNormalPass multisampling={0}>
          <N8AO aoRadius={0.5} intensity={2.2} distanceFalloff={0.6} halfRes />
          <DepthOfField focusDistance={0.012} focalLength={0.05} bokehScale={3} />
          <Bloom intensity={0.35} luminanceThreshold={0.75} luminanceSmoothing={0.3} mipmapBlur />
          <SMAA />
        </EffectComposer>
      )}
    </Canvas>
  );
}
