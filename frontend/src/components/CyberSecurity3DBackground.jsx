import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const CyberSecurity3DBackground = () => {
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);
  const gridHelperRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current || !tooltipRef.current) return;

    // -- THREE.JS SETUP -- //
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05010a, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 1. Perspective Cyber Grid Floor
    const gridHelper = new THREE.GridHelper(200, 100, 0x9333ea, 0x4c1d95);
    gridHelper.position.y = -10;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    gridHelper.visible = theme !== 'light';
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xa855f7, 2, 100);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // 3. Floating Ambient Particles (Data Dust)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth > 768 ? 700 : 300;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const createGlowTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(216, 180, 254, 1)');
        gradient.addColorStop(1, 'rgba(216, 180, 254, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createGlowTexture();
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.3,
        map: particleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Network Nodes
    const nodesGroup = new THREE.Group();
    const connectionsGroup = new THREE.Group();
    scene.add(nodesGroup);
    scene.add(connectionsGroup);

    const nodes = [];
    const connections = [];

    // Geometries
    const serverGeo = new THREE.BoxGeometry(2, 2, 2);
    const encryptGeo = new THREE.OctahedronGeometry(1.5);
    const firewallGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 6);

    const nodeTypes = [
        { geo: serverGeo, name: 'SERVER_CLUSTER' },
        { geo: encryptGeo, name: 'ENCRYPTION_KEY' },
        { geo: firewallGeo, name: 'FIREWALL_GATEWAY' }
    ];

    // Shared Materials
    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2e1065,
        emissive: 0x7e22ce,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xd8b4fe,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const nodeCount = window.innerWidth > 768 ? 25 : 15;
    
    for (let i = 0; i < nodeCount; i++) {
        const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        
        const wireMesh = new THREE.Mesh(type.geo, wireMaterial);
        const coreMesh = new THREE.Mesh(type.geo, coreMaterial.clone());
        coreMesh.scale.set(0.8, 0.8, 0.8);

        const nodeGroup = new THREE.Group();
        nodeGroup.add(wireMesh);
        nodeGroup.add(coreMesh);

        // Random positioning
        const theta = Math.random() * Math.PI * 2;
        const radius = Math.random() * 25;
        const y = (Math.random() - 0.5) * 15;
        
        nodeGroup.position.set(
            Math.cos(theta) * radius,
            y,
            Math.sin(theta) * radius
        );

        nodeGroup.userData = {
            id: 'N-' + Math.floor(Math.random() * 9000 + 1000),
            type: type.name,
            isThreat: false,
            coreMesh: coreMesh,
            wireMesh: wireMesh,
            originalEmissive: coreMesh.material.emissive.getHex()
        };

        nodesGroup.add(nodeGroup);
        nodes.push(nodeGroup);
    }

    // Connections based on distance
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x9333ea,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });

    nodes.forEach((nodeA, i) => {
        nodes.forEach((nodeB, j) => {
            if (i < j) {
                const distance = nodeA.position.distanceTo(nodeB.position);
                if (distance < 12) {
                    const points = [nodeA.position, nodeB.position];
                    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(lineGeo, lineMaterial.clone());
                    
                    connectionsGroup.add(line);
                    connections.push({ line, nodeA, nodeB });
                }
            }
        });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredNode = null;

    // Mouse Parallax & Raycaster positioning
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const tooltip = tooltipRef.current;

    const onMouseMove = (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        tooltip.style.left = event.clientX + 'px';
        tooltip.style.top = event.clientY + 'px';
    };

    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);
    
    // Background Threat Simulation Loop
    let activeThreatNode = null;
    let threatTimeout = null;
    let threatInterval = null;

    function triggerThreat() {
        if (activeThreatNode || nodes.length === 0) return; 
        const targetIndex = Math.floor(Math.random() * nodes.length);
        activeThreatNode = nodes[targetIndex];
        activeThreatNode.userData.isThreat = true;

        // Turn RED
        activeThreatNode.userData.coreMesh.material.emissive.setHex(0xff0000);
        activeThreatNode.userData.coreMesh.material.color.setHex(0x550000);
        activeThreatNode.userData.wireMesh.material.color.setHex(0xff5555);
        activeThreatNode.scale.set(1.5, 1.5, 1.5);

        threatTimeout = setTimeout(resolveThreat, 3000);
    }

    function resolveThreat() {
        if (!activeThreatNode) return;
        // Revert colors
        activeThreatNode.userData.isThreat = false;
        activeThreatNode.userData.coreMesh.material.emissive.setHex(activeThreatNode.userData.originalEmissive);
        activeThreatNode.userData.coreMesh.material.color.setHex(0x2e1065);
        activeThreatNode.userData.wireMesh.material.color.setHex(0xd8b4fe);
        activeThreatNode.scale.set(1, 1, 1);
        activeThreatNode = null;
    }

    threatInterval = setInterval(() => {
        if(Math.random() > 0.3) triggerThreat();
    }, 5000);

    const clock = new THREE.Clock();
    let animationFrameId;

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth Camera Parallax
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y + 15) * 0.05;
        camera.lookAt(0, 0, 0);

        // Light Movement for dynamic feel
        pointLight.position.x = Math.sin(elapsedTime * 0.5) * 30;
        pointLight.position.z = Math.cos(elapsedTime * 0.3) * 30;

        // Animate Particles
        particlesMesh.rotation.y = elapsedTime * 0.02;
        particlesMesh.rotation.x = elapsedTime * 0.01;

        // Animate Nodes
        nodes.forEach(node => {
            node.rotation.y += 0.01;
            node.rotation.x += 0.005;
            node.position.y += Math.sin(elapsedTime * 2 + node.position.x) * 0.01; 
            
            if (node !== hoveredNode && !node.userData.isThreat) {
                node.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        });

        // Raycasting for Hover Detection
        raycaster.setFromCamera(mouse, camera);
        const targetMeshes = nodes.map(n => n.userData.wireMesh); 
        const intersects = raycaster.intersectObjects(targetMeshes);

        if (intersects.length > 0) {
            const hitObject = intersects[0].object;
            const parentNode = hitObject.parent;

            if (hoveredNode !== parentNode) {
                hoveredNode = parentNode;
                
                document.getElementById('tt-type').textContent = hoveredNode.userData.type;
                document.getElementById('tt-id').textContent = hoveredNode.userData.id;
                
                const statusEl = document.getElementById('tt-status');
                const indicatorEl = document.getElementById('tt-indicator');
                
                if (hoveredNode.userData.isThreat) {
                    statusEl.textContent = "BREACHED";
                    statusEl.className = "breached-text";
                    indicatorEl.className = "status-dot breached-dot";
                } else {
                    statusEl.textContent = "SECURE";
                    statusEl.className = "secure-text";
                    indicatorEl.className = "status-dot secure-dot";
                }

                tooltip.style.opacity = '1';
            }
            
            if (!parentNode.userData.isThreat) {
                parentNode.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
            }
            
        } else {
            if (hoveredNode) {
                tooltip.style.opacity = '0';
                hoveredNode = null;
            }
        }

        renderer.render(scene, camera);
    }

    animate();

    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        clearTimeout(threatTimeout);
        clearInterval(threatInterval);
        cancelAnimationFrame(animationFrameId);
        
        // Dispose
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        particleTexture.dispose();
        gridHelper.geometry.dispose();
        gridHelper.material.dispose();
        serverGeo.dispose();
        encryptGeo.dispose();
        firewallGeo.dispose();
        coreMaterial.dispose();
        wireMaterial.dispose();
        
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = theme !== 'light';
    }
  }, [theme]);

  return (
    <>
      <div 
        ref={mountRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      <div 
        ref={tooltipRef}
        id="node-tooltip" 
        style={{
            position: 'fixed',
            background: 'rgba(20, 10, 40, 0.85)',
            border: '1px solid rgba(216, 180, 254, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            pointerEvents: 'none',
            opacity: 0,
            transform: 'translate(15px, 15px)',
            zIndex: 9999,
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
            transition: 'opacity 0.2s ease',
            fontFamily: 'monospace'
        }}
      >
        <div className="tooltip-title" id="tt-type" style={{ color: '#d8b4fe', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px', letterSpacing: '1px' }}>ASSET</div>
        <div className="tooltip-id" style={{ color: '#ccc', fontSize: '11px', marginBottom: '6px' }}>ID: <span id="tt-id" style={{ color: 'white' }}>...</span></div>
        <div className="tooltip-status" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold' }}>
            <span id="tt-indicator" className="status-dot secure-dot"></span>
            <span id="tt-status" className="secure-text">SECURE</span>
        </div>
      </div>
      <style>{`
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .secure-dot { background-color: #22c55e; }
        .breached-dot { background-color: #ef4444; box-shadow: 0 0 8px #ef4444; animation: pulse 1s infinite; }
        
        .secure-text { color: #4ade80; }
        .breached-text { color: #f87171; }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default CyberSecurity3DBackground;
