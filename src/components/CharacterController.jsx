import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { Vector3, Quaternion, Euler } from "three";
import { useControls } from "@/hooks/useControls";
import { usePlayer } from "@/context/PlayerContext";

/* ── Constants ───────────────────────────────────────────── */
const MOVE_SPEED    = 7;
const CAMERA_OFFSET = new Vector3(0, 5.5, 9);
const CAMERA_LERP   = 0.08;
const ROT_LERP      = 0.14;

/* ── Pre-allocated working objects ──────────────────────── */
const _vel   = new Vector3();
const _dir   = new Vector3();
const _camP  = new Vector3();
const _camT  = new Vector3();
const _euler = new Euler(0, 0, 0, "YXZ");

/**
 * CharacterController
 *
 * Physics-based player capsule. Each frame it:
 *  1. Reads unified input (keyboard + gamepad) from useControls
 *  2. Applies camera-relative velocity to the Rapier RigidBody
 *  3. Slerps the visual avatar mesh toward movement direction
 *  4. Tracks the fixed camera behind and above the player
 *  5. Publishes player position into PlayerContext for InteractableProp proximity checks
 *
 * The visual group (ref: avatarRef) can be replaced with a GLTF model.
 */
export default function CharacterController({ dialogueOpen }) {
  const rigidBodyRef = useRef();
  const avatarRef    = useRef();

  const localInputRef = useControls();    // polls keyboard + gamepad each frame
  const { playerPosRef, inputRef } = usePlayer();
  const { camera } = useThree();

  // ── Camera Rotation State ────────────────────────────────
  // theta = horizontal (yaw), phi = vertical (pitch)
  const cameraRot = useRef({ theta: 0, phi: 0.16 });
  const CAMERA_DISTANCE = 10.5;

  useFrame((state, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    const input    = localInputRef.current;
    const { movement, look, interact } = input;

    // ── Update Camera Rotation Angles ──
    const SENSITIVITY = 1.8;
    cameraRot.current.theta -= look.x * SENSITIVITY * delta;
    cameraRot.current.phi   = Math.max(
      -0.2, 
      Math.min(1.2, cameraRot.current.phi + look.y * SENSITIVITY * delta)
    );

    // ── Publish to shared context ──
    const pos = rb.translation();
    playerPosRef.current.x = pos.x;
    playerPosRef.current.y = pos.y;
    playerPosRef.current.z = pos.z;

    // Publish input as well so InteractableProp can read it
    inputRef.current.movement.x = movement.x;
    inputRef.current.movement.z = movement.z;
    inputRef.current.interact   = interact;

    const hasMovement = Math.abs(movement.x) > 0.01 || Math.abs(movement.z) > 0.01;

    /* ── 1. Velocity ──────────────────────────────────────── */
    if (dialogueOpen) {
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    } else {
      // Camera-relative movement — strip pitch, apply yaw only
      _euler.setFromQuaternion(camera.quaternion, "YXZ");
      _euler.x = 0;
      _euler.z = 0;
      const yawQ = new Quaternion().setFromEuler(_euler);

      _dir.set(movement.x, 0, movement.z).normalize().applyQuaternion(yawQ);
      const linvel = rb.linvel();
      _vel.set(_dir.x * MOVE_SPEED, linvel.y, _dir.z * MOVE_SPEED);
      rb.setLinvel({ x: _vel.x, y: _vel.y, z: _vel.z }, true);
    }

    /* ── 2. Avatar rotation ───────────────────────────────── */
    if (hasMovement && !dialogueOpen && avatarRef.current) {
      _euler.setFromQuaternion(camera.quaternion, "YXZ");
      _euler.x = 0;
      _euler.z = 0;
      const yawQ = new Quaternion().setFromEuler(_euler);
      _dir.set(movement.x, 0, movement.z).normalize().applyQuaternion(yawQ);

      const targetQ = new Quaternion().setFromEuler(
        new Euler(0, Math.atan2(_dir.x, _dir.z), 0)
      );
      avatarRef.current.quaternion.slerp(targetQ, ROT_LERP);
    }

    /* ── 3. Dynamic Rotating Camera ───────────────────────── */
    const { theta, phi } = cameraRot.current;
    
    // Calculate relative offset using spherical coordinates
    const offX = CAMERA_DISTANCE * Math.sin(theta) * Math.cos(phi);
    const offY = CAMERA_DISTANCE * Math.sin(phi);
    const offZ = CAMERA_DISTANCE * Math.cos(theta) * Math.cos(phi);

    _camP.set(pos.x + offX, pos.y + offY + 1.2, pos.z + offZ);
    camera.position.lerp(_camP, CAMERA_LERP);
    
    _camT.set(pos.x, pos.y + 1.6, pos.z);
    camera.lookAt(_camT);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={5}
      angularDamping={1}
      colliders={false}
    >
      <CapsuleCollider args={[0.55, 0.38]} />

      {/*
       * ── Visual Avatar ─────────────────────────────────────
       * Swap the contents of this group with:
       *   <primitive object={gltf.scene} />
       * to use a rigged character model.
       */}
      <group ref={avatarRef}>
        {/* Bright jacket body */}
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.38, 1.2, 16]} />
          <meshStandardMaterial color="#ff7b00" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Jacket hem */}
        <mesh castShadow position={[0, -0.68, 0]}>
          <cylinderGeometry args={[0.35, 0.42, 0.22, 16]} />
          <meshStandardMaterial color="#e66e00" roughness={0.5} />
        </mesh>
        {/* Neck */}
        <mesh castShadow position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.22, 12]} />
          <meshStandardMaterial color="#c8a87a" roughness={0.7} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.27, 16, 16]} />
          <meshStandardMaterial color="#c8a87a" roughness={0.65} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.09, 1.05, 0.23]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#1a1209" />
        </mesh>
        <mesh position={[-0.09, 1.05, 0.23]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#1a1209" />
        </mesh>
        {/* Collar accent - white for high contrast */}
        <mesh castShadow position={[0, 0.55, 0.15]}>
          <boxGeometry args={[0.28, 0.18, 0.08]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>
    </RigidBody>
  );
}
