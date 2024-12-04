let isRotating = true;
let isWireframe = false;
let scene3D, camera3D, renderer3D, shape3D, controls3D;
let scene4D, camera4D, renderer4D, shape4D, controls4D;
let scene5D, camera5D, renderer5D, shape5D, controls5D;

// Mouse interaction variables
let isDragging1D = false;
let isDragging2D = false;
let lastMouseX = 0;
let lastMouseY = 0;
let linePosition = 0;
let manualRotation2D = 0;
let rotation2D = 0;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize controls
    const resetBtn = document.getElementById('resetBtn');
    const toggleBtn = document.getElementById('toggleBtn');
    const solidBtn = document.getElementById('solidBtn');
    const wireframeBtn = document.getElementById('wireframeBtn');
    const viewModeToggle = document.getElementById('viewModeToggle');
    
    if (viewModeToggle) {
        viewModeToggle.addEventListener('change', function() {
            isWireframe = this.checked;
            updateWireframeMode();
        });
    }
    
    // Add button event listeners
    if (resetBtn) {
        resetBtn.addEventListener('click', resetViews);
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleRotation);
    }

    // Add wireframe toggle listeners
    if (solidBtn) {
        solidBtn.addEventListener('click', () => {
            isWireframe = false;
            solidBtn.classList.add('active');
            wireframeBtn.classList.remove('active');
            updateAllMaterials();
        });
    }

    if (wireframeBtn) {
        wireframeBtn.addEventListener('click', () => {
            isWireframe = true;
            wireframeBtn.classList.add('active');
            solidBtn.classList.remove('active');
            updateAllMaterials();
        });
    }

    // Function to update all materials
    function updateAllMaterials() {
        // Update 3D shapes
        if (shape3D) {
            if (shape3D.material) {
                shape3D.material.wireframe = isWireframe;
            }
        }

        // Update 4D shapes
        if (shape4D) {
            if (shape4D.outer && shape4D.outer.material) shape4D.outer.material.wireframe = isWireframe;
            if (shape4D.middle && shape4D.middle.material) shape4D.middle.material.wireframe = isWireframe;
            if (shape4D.inner && shape4D.inner.material) shape4D.inner.material.wireframe = isWireframe;
        }

        // Update 5D shapes
        if (shape5D) {
            const layers = [shape5D.outer, shape5D.middle, shape5D.inner, shape5D.core];
            layers.forEach(layer => {
                if (layer) {
                    if (layer.material) {
                        layer.material.wireframe = isWireframe;
                    } else if (layer.children) {
                        layer.children.forEach(child => {
                            if (child.material) {
                                child.material.wireframe = isWireframe;
                            }
                        });
                    }
                }
            });
        }
    }

    function updateWireframeMode() {
        // Update 3D shapes
        if (shape3D && shape3D.material) {
            shape3D.material.wireframe = isWireframe;
        }

        // Update 4D shapes
        if (shape4D) {
            if (shape4D.outer && shape4D.outer.material) shape4D.outer.material.wireframe = isWireframe;
            if (shape4D.middle && shape4D.middle.material) shape4D.middle.material.wireframe = isWireframe;
            if (shape4D.inner && shape4D.inner.material) shape4D.inner.material.wireframe = isWireframe;
        }

        // Update 5D shapes
        if (shape5D) {
            shape5D.traverse(function(child) {
                if (child.isMesh && child.material) {
                    child.material.wireframe = isWireframe;
                }
            });
        }
    }

    // Shape change handlers
    document.getElementById('shape1D').addEventListener('change', updateShape1D);
    document.getElementById('shape2D').addEventListener('change', updateShape2D);
    document.getElementById('shape3D').addEventListener('change', updateShape3D);
    document.getElementById('shape4D').addEventListener('change', updateShape4D);
    document.getElementById('shape5D').addEventListener('change', updateShape5D);

    // Initialize 1D visualization
    const canvas1D = document.getElementById('canvas1D');
    const ctx1D = canvas1D.getContext('2d');
    canvas1D.width = canvas1D.offsetWidth;
    canvas1D.height = canvas1D.offsetHeight;

    function updateShape1D() {
        const shape = document.getElementById('shape1D').value;
        draw1D(shape);
    }

    function draw1D(shape = 'line') {
        ctx1D.clearRect(0, 0, canvas1D.width, canvas1D.height);
        
        const gradient = ctx1D.createLinearGradient(
            canvas1D.width/2 - 100 + linePosition, 
            canvas1D.height/2,
            canvas1D.width/2 + 100 + linePosition, 
            canvas1D.height/2
        );
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#45a049');
        
        ctx1D.beginPath();
        
        switch(shape) {
            case 'point':
                ctx1D.arc(canvas1D.width/2 + linePosition, canvas1D.height/2, 10, 0, Math.PI * 2);
                ctx1D.fillStyle = '#4CAF50';
                ctx1D.fill();
                break;
            case 'dash':
                ctx1D.setLineDash([15, 15]);
                ctx1D.moveTo(canvas1D.width/2 - 100 + linePosition, canvas1D.height/2);
                ctx1D.lineTo(canvas1D.width/2 + 100 + linePosition, canvas1D.height/2);
                ctx1D.strokeStyle = gradient;
                ctx1D.lineWidth = 20;
                ctx1D.lineCap = 'round';
                ctx1D.stroke();
                ctx1D.setLineDash([]);
                break;
            case 'human':
                ctx1D.beginPath();
                const baseX = canvas1D.width/2 + linePosition;
                const baseY = canvas1D.height/2;
                ctx1D.moveTo(baseX, baseY - 40); // Head
                ctx1D.lineTo(baseX, baseY + 40); // Body
                ctx1D.strokeStyle = '#4CAF50';
                ctx1D.lineWidth = 4;
                ctx1D.stroke();
                ctx1D.beginPath();
                ctx1D.arc(baseX, baseY - 40, 5, 0, Math.PI * 2);
                ctx1D.fillStyle = '#4CAF50';
                ctx1D.fill();
                break;
            default: // line
                ctx1D.moveTo(canvas1D.width/2 - 100 + linePosition, canvas1D.height/2);
                ctx1D.lineTo(canvas1D.width/2 + 100 + linePosition, canvas1D.height/2);
                ctx1D.strokeStyle = gradient;
                ctx1D.lineWidth = 20;
                ctx1D.lineCap = 'round';
                ctx1D.stroke();
        }
    }

    // Initialize 2D visualization
    const canvas2D = document.getElementById('canvas2D');
    const ctx2D = canvas2D.getContext('2d');
    canvas2D.width = canvas2D.offsetWidth;
    canvas2D.height = canvas2D.offsetHeight;

    function updateShape2D() {
        const shape = document.getElementById('shape2D').value;
        draw2D(shape);
    }

    function draw2D(shape = 'square') {
        ctx2D.clearRect(0, 0, canvas2D.width, canvas2D.height);
        ctx2D.save();
        ctx2D.translate(canvas2D.width/2, canvas2D.height/2);
        ctx2D.rotate(manualRotation2D + (isRotating ? rotation2D : 0));
        
        const gradient = ctx2D.createLinearGradient(-50, -50, 50, 50);
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#45a049');
        ctx2D.fillStyle = gradient;
        
        switch(shape) {
            case 'circle':
                ctx2D.beginPath();
                ctx2D.arc(0, 0, 50, 0, Math.PI * 2);
                ctx2D.fill();
                break;
            case 'triangle':
                ctx2D.beginPath();
                ctx2D.moveTo(0, -50);
                ctx2D.lineTo(50, 50);
                ctx2D.lineTo(-50, 50);
                ctx2D.closePath();
                ctx2D.fill();
                break;
            case 'pentagon':
                ctx2D.beginPath();
                for(let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI / 5) - Math.PI/2;
                    const x = 50 * Math.cos(angle);
                    const y = 50 * Math.sin(angle);
                    if(i === 0) ctx2D.moveTo(x, y);
                    else ctx2D.lineTo(x, y);
                }
                ctx2D.closePath();
                ctx2D.fill();
                break;
            case 'star':
                ctx2D.beginPath();
                for(let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI / 5) - Math.PI/2;
                    const x1 = 50 * Math.cos(angle);
                    const y1 = 50 * Math.sin(angle);
                    const x2 = 25 * Math.cos(angle + Math.PI/5);
                    const y2 = 25 * Math.sin(angle + Math.PI/5);
                    if(i === 0) ctx2D.moveTo(x1, y1);
                    else ctx2D.lineTo(x1, y1);
                    ctx2D.lineTo(x2, y2);
                }
                ctx2D.closePath();
                ctx2D.fill();
                break;
            case 'human':
                ctx2D.beginPath();
                ctx2D.arc(0, -25, 10, 0, Math.PI * 2); // Head
                ctx2D.moveTo(0, -15); // Neck
                ctx2D.lineTo(0, 15); // Body
                ctx2D.moveTo(-20, 0); // Arms
                ctx2D.lineTo(20, 0);
                ctx2D.moveTo(0, 15); // Legs
                ctx2D.lineTo(-15, 40);
                ctx2D.moveTo(0, 15);
                ctx2D.lineTo(15, 40);
                ctx2D.strokeStyle = gradient;
                ctx2D.lineWidth = 3;
                ctx2D.stroke();
                ctx2D.fill();
                break;
            default: // square
                ctx2D.fillRect(-50, -50, 100, 100);
        }
        
        ctx2D.restore();
    }

    // Initialize 3D visualization
    function init3D() {
        scene3D = new THREE.Scene();
        camera3D = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        renderer3D = new THREE.WebGLRenderer({ antialias: true });
        renderer3D.setSize(400, 400);
        renderer3D.setClearColor(0x2a2a2a);
        document.getElementById('canvas3D').appendChild(renderer3D.domElement);

        controls3D = new THREE.OrbitControls(camera3D, renderer3D.domElement);
        controls3D.enableDamping = true;
        controls3D.dampingFactor = 0.05;
        controls3D.rotateSpeed = 0.5;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene3D.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene3D.add(directionalLight);

        updateShape3D();
        camera3D.position.z = 3;
    }

    function updateShape3D() {
        const shape = document.getElementById('shape3D').value;
        if (shape3D) scene3D.remove(shape3D);
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x4CAF50,
            shininess: 100,
            wireframe: isWireframe
        });

        let geometry;
        switch(shape) {
            case 'human':
                // Create a simple humanoid shape using cylinders and spheres
                const group = new THREE.Group();
                
                // Head
                const head = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 32, 32),
                    material
                );
                head.position.y = 0.6;
                group.add(head);
                
                // Body
                const body = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.2, 0.2, 0.6, 32),
                    material
                );
                body.position.y = 0.1;
                group.add(body);
                
                // Arms
                const leftArm = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.05, 0.05, 0.4, 32),
                    material
                );
                leftArm.position.set(-0.3, 0.3, 0);
                leftArm.rotation.z = Math.PI / 2;
                group.add(leftArm);
                
                const rightArm = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.05, 0.05, 0.4, 32),
                    material
                );
                rightArm.position.set(0.3, 0.3, 0);
                rightArm.rotation.z = -Math.PI / 2;
                group.add(rightArm);
                
                // Legs
                const leftLeg = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.07, 0.07, 0.5, 32),
                    material
                );
                leftLeg.position.set(-0.1, -0.2, 0);
                group.add(leftLeg);
                
                const rightLeg = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.07, 0.07, 0.5, 32),
                    material
                );
                rightLeg.position.set(0.1, -0.2, 0);
                group.add(rightLeg);
                
                shape3D = group;
                scene3D.add(shape3D);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(0.7, 32, 32);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(0.7, 1.5, 32);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
                break;
            case 'pyramid':
                geometry = new THREE.ConeGeometry(0.7, 1.5, 4);
                break;
            default: // cube
                geometry = new THREE.BoxGeometry(1, 1, 1);
        }
        
        if (shape !== 'human') {
            shape3D = new THREE.Mesh(geometry, material);
            scene3D.add(shape3D);
        }
    }

    // Initialize 4D visualization
    function init4D() {
        scene4D = new THREE.Scene();
        camera4D = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        renderer4D = new THREE.WebGLRenderer({ antialias: true });
        renderer4D.setSize(400, 400);
        renderer4D.setClearColor(0x2a2a2a);
        document.getElementById('canvas4D').appendChild(renderer4D.domElement);

        controls4D = new THREE.OrbitControls(camera4D, renderer4D.domElement);
        controls4D.enableDamping = true;
        controls4D.dampingFactor = 0.05;
        controls4D.rotateSpeed = 0.5;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene4D.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene4D.add(directionalLight);

        updateShape4D();
        camera4D.position.z = 3;
    }

    function updateShape4D() {
        const shape = document.getElementById('shape4D').value;
        if (shape4D) {
            if (shape4D.outer) scene4D.remove(shape4D.outer);
            if (shape4D.middle) scene4D.remove(shape4D.middle);
            if (shape4D.inner) scene4D.remove(shape4D.inner);
        }
        
        const commonMaterial = new THREE.MeshPhongMaterial({
            color: 0x4CAF50,
            shininess: 100,
            wireframe: isWireframe
        });

        const transparentMaterial = new THREE.MeshPhongMaterial({
            color: 0x4CAF50,
            transparent: true,
            opacity: 0.3,
            shininess: 100,
            wireframe: isWireframe
        });

        const middleMaterial = new THREE.MeshPhongMaterial({
            color: 0x4CAF50,
            transparent: true,
            opacity: 0.6,
            shininess: 100,
            wireframe: isWireframe
        });
        
        switch(shape) {
            case 'human': {
                // Create three layers to represent 4D movement
                const outerGroup = new THREE.Group();
                const middleGroup = new THREE.Group();
                const innerGroup = new THREE.Group();
                
                // Helper function to create body parts
                function createBodyPart(geometry, material, scale = 1) {
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.scale.multiplyScalar(scale);
                    return mesh;
                }

                // Create body parts for each layer
                const layers = [
                    { group: outerGroup, material: transparentMaterial, scale: 1.4 },
                    { group: middleGroup, material: middleMaterial, scale: 1.2 },
                    { group: innerGroup, material: commonMaterial, scale: 1.0 }
                ];

                layers.forEach(layer => {
                    // Head
                    const head = createBodyPart(
                        new THREE.SphereGeometry(0.2, 32, 32),
                        layer.material,
                        layer.scale
                    );
                    head.position.y = 0.6 * layer.scale;
                    layer.group.add(head);

                    // Body
                    const body = createBodyPart(
                        new THREE.CylinderGeometry(0.2, 0.2, 0.6, 32),
                        layer.material,
                        layer.scale
                    );
                    body.position.y = 0.1 * layer.scale;
                    layer.group.add(body);

                    // Arms
                    [-1, 1].forEach(side => {
                        const arm = createBodyPart(
                            new THREE.CylinderGeometry(0.05, 0.05, 0.4, 32),
                            layer.material,
                            layer.scale
                        );
                        arm.position.set(0.3 * side * layer.scale, 0.3 * layer.scale, 0);
                        arm.rotation.z = -Math.PI / 2 * side;
                        layer.group.add(arm);
                    });

                    // Legs
                    [-1, 1].forEach(side => {
                        const leg = createBodyPart(
                            new THREE.CylinderGeometry(0.07, 0.07, 0.5, 32),
                            layer.material,
                            layer.scale
                        );
                        leg.position.set(0.1 * side * layer.scale, -0.2 * layer.scale, 0);
                        layer.group.add(leg);
                    });
                });

                // Store references for animation
                shape4D = {
                    outer: outerGroup,
                    middle: middleGroup,
                    inner: innerGroup,
                    time: 0, // Add time property for animation
                    wAxis: 0 // Add w-axis position
                };

                // Add all layers to scene
                scene4D.add(outerGroup);
                scene4D.add(middleGroup);
                scene4D.add(innerGroup);
                break;
            }
            case 'hypersphere': {
                const outerGeometry = new THREE.SphereGeometry(1.2, 32, 32);
                const innerGeometry = new THREE.SphereGeometry(0.8, 32, 32);
                
                shape4D = {
                    outer: new THREE.Mesh(outerGeometry, transparentMaterial),
                    inner: new THREE.Mesh(innerGeometry, commonMaterial)
                };
                break;
            }
            case 'duocylinder': {
                const cylinder1 = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
                const cylinder2 = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
                
                shape4D = {
                    outer: new THREE.Mesh(cylinder1, commonMaterial),
                    inner: new THREE.Mesh(cylinder2, commonMaterial)
                };
                
                shape4D.inner.rotation.x = Math.PI / 2;
                break;
            }
            case 'tesseract':
                const outerCubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
                const innerCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
                
                shape4D = {
                    outer: new THREE.Mesh(outerCubeGeometry, transparentMaterial),
                    inner: new THREE.Mesh(innerCubeGeometry, commonMaterial)
                };
                break;
            default: // torus
                const outerTorusGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
                const innerTorusGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
                
                shape4D = {
                    outer: new THREE.Mesh(outerTorusGeometry, transparentMaterial),
                    inner: new THREE.Mesh(innerTorusGeometry, commonMaterial)
                };
        }
        
        scene4D.add(shape4D.outer);
        scene4D.add(shape4D.inner);
        if (shape4D.middle) scene4D.add(shape4D.middle);
    }

    // Initialize 5D visualization
    function init5D() {
        // Create scene
        scene5D = new THREE.Scene();
        
        // Create camera
        camera5D = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera5D.position.z = 3;
        
        // Create renderer
        renderer5D = new THREE.WebGLRenderer({ antialias: true });
        renderer5D.setSize(300, 300);
        renderer5D.setClearColor(0x000000, 0);
        
        // Add renderer to DOM
        const container = document.getElementById('canvas5D');
        if (container) {
            container.appendChild(renderer5D.domElement);
        }
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene5D.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene5D.add(directionalLight);
        
        // Setup controls
        controls5D = new THREE.OrbitControls(camera5D, renderer5D.domElement);
        controls5D.enableDamping = true;
        controls5D.dampingFactor = 0.05;
        
        // Create initial shape
        create5DShape('penteract');
    }

    // Create 5D shapes
    function create5DShape(type) {
        // Remove existing shape
        if (shape5D) {
            if (shape5D.outer) scene5D.remove(shape5D.outer);
            if (shape5D.middle) scene5D.remove(shape5D.middle);
            if (shape5D.inner) scene5D.remove(shape5D.inner);
            if (shape5D.core) scene5D.remove(shape5D.core);
        }

        shape5D = { time: 0, wAxis: 0, vAxis: 0 };

        switch (type) {
            case 'penteract':
                // Create nested cubes with different scales and rotations
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshPhongMaterial({
                    color: 0x4CAF50,
                    opacity: 0.3,
                    transparent: true,
                    wireframe: isWireframe,
                    side: THREE.DoubleSide,
                    shininess: 100,
                    specular: 0x4CAF50
                });

                shape5D.outer = new THREE.Mesh(geometry, material);
                shape5D.middle = new THREE.Mesh(geometry, material.clone());
                shape5D.inner = new THREE.Mesh(geometry, material.clone());
                shape5D.core = new THREE.Mesh(geometry, material.clone());

                shape5D.outer.scale.set(1.6, 1.6, 1.6);
                shape5D.middle.scale.set(1.4, 1.4, 1.4);
                shape5D.inner.scale.set(1.2, 1.2, 1.2);
                shape5D.core.scale.set(1, 1, 1);

                scene5D.add(shape5D.outer);
                scene5D.add(shape5D.middle);
                scene5D.add(shape5D.inner);
                scene5D.add(shape5D.core);
                break;

            case 'hyperhypersphere':
                // Create nested spheres with different scales
                const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                const sphereMaterial = new THREE.MeshPhongMaterial({
                    color: 0x4CAF50,
                    opacity: 0.2,
                    transparent: true,
                    wireframe: isWireframe,
                    side: THREE.DoubleSide,
                    shininess: 100,
                    specular: 0x4CAF50
                });

                shape5D.outer = new THREE.Mesh(sphereGeometry, sphereMaterial);
                shape5D.middle = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
                shape5D.inner = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
                shape5D.core = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());

                shape5D.outer.scale.set(1.6, 1.6, 1.6);
                shape5D.middle.scale.set(1.4, 1.4, 1.4);
                shape5D.inner.scale.set(1.2, 1.2, 1.2);
                shape5D.core.scale.set(1, 1, 1);

                scene5D.add(shape5D.outer);
                scene5D.add(shape5D.middle);
                scene5D.add(shape5D.inner);
                scene5D.add(shape5D.core);
                break;

            case 'hyperduocylinder':
                // Create nested cylinders
                const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
                const cylinderMaterial = new THREE.MeshPhongMaterial({
                    color: 0x4CAF50,
                    opacity: 0.2,
                    transparent: true,
                    wireframe: isWireframe,
                    side: THREE.DoubleSide,
                    shininess: 100,
                    specular: 0x4CAF50
                });

                shape5D.outer = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
                shape5D.middle = new THREE.Mesh(cylinderGeometry, cylinderMaterial.clone());
                shape5D.inner = new THREE.Mesh(cylinderGeometry, cylinderMaterial.clone());
                shape5D.core = new THREE.Mesh(cylinderGeometry, cylinderMaterial.clone());

                shape5D.outer.scale.set(1.6, 1.6, 1.6);
                shape5D.middle.scale.set(1.4, 1.4, 1.4);
                shape5D.inner.scale.set(1.2, 1.2, 1.2);
                shape5D.core.scale.set(1, 1, 1);

                scene5D.add(shape5D.outer);
                scene5D.add(shape5D.middle);
                scene5D.add(shape5D.inner);
                scene5D.add(shape5D.core);
                break;

            case 'human':
                // Create a complex nested human representation in 5D
                const humanGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
                const humanMaterial = new THREE.MeshPhongMaterial({
                    color: 0x4CAF50,
                    opacity: 0.2,
                    transparent: true,
                    wireframe: isWireframe,
                    side: THREE.DoubleSide,
                    shininess: 100,
                    specular: 0x4CAF50
                });

                shape5D.outer = new THREE.Group();
                shape5D.middle = new THREE.Group();
                shape5D.inner = new THREE.Group();
                shape5D.core = new THREE.Group();

                // Create body parts for each layer
                const layers = [shape5D.outer, shape5D.middle, shape5D.inner, shape5D.core];
                const scales = [1.6, 1.4, 1.2, 1];

                layers.forEach((layer, index) => {
                    const scale = scales[index];
                    
                    // Body
                    const body = new THREE.Mesh(humanGeometry, humanMaterial.clone());
                    body.scale.set(scale, scale, scale);
                    layer.add(body);

                    // Head
                    const head = new THREE.Mesh(
                        new THREE.SphereGeometry(0.2, 32, 32),
                        humanMaterial.clone()
                    );
                    head.position.y = 0.6 * scale;
                    head.scale.set(scale, scale, scale);
                    layer.add(head);

                    // Arms
                    const leftArm = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.1, 0.1, 0.6, 32),
                        humanMaterial.clone()
                    );
                    leftArm.rotation.z = Math.PI / 3;
                    leftArm.position.set(-0.3 * scale, 0.2 * scale, 0);
                    leftArm.scale.set(scale, scale, scale);
                    layer.add(leftArm);

                    const rightArm = leftArm.clone();
                    rightArm.rotation.z = -Math.PI / 3;
                    rightArm.position.set(0.3 * scale, 0.2 * scale, 0);
                    layer.add(rightArm);

                    scene5D.add(layer);
                });
                break;
        }
    }

    // Update 5D shape
    function update5DShape() {
        if (!shape5D) return;

        const time = Date.now() * 0.001;
        shape5D.time = time;

        if (isRotating) {
            // Update w-axis and v-axis rotation
            shape5D.wAxis = (shape5D.wAxis + 0.01) % (Math.PI * 2);
            shape5D.vAxis = (shape5D.vAxis + 0.005) % (Math.PI * 2);

            const layers = [shape5D.outer, shape5D.middle, shape5D.inner, shape5D.core];
            layers.forEach((layer, index) => {
                if (!layer) return;

                // Apply complex 5D transformations
                const phase = index * Math.PI / 2;
                const wScale = Math.sin(shape5D.wAxis + phase) * 0.2 + 1;
                const vScale = Math.cos(shape5D.vAxis + phase) * 0.2 + 1;

                // Rotate around multiple axes
                layer.rotation.x = time * (0.2 + index * 0.1);
                layer.rotation.y = time * (0.3 + index * 0.1);
                layer.rotation.z = time * (0.1 + index * 0.1);

                // Apply 5D scaling effects
                layer.scale.x = layer.scale.y = layer.scale.z = 
                    (index === 0 ? 1.6 : index === 1 ? 1.4 : index === 2 ? 1.2 : 1) * wScale * vScale;
            });
        }
    }

    // Update shape selection handler
    function updateShape5D() {
        const selectedShape = document.getElementById('shape5D').value;
        create5DShape(selectedShape);
    }

    // Mouse events for 1D
    canvas1D.addEventListener('mousedown', (e) => {
        isDragging1D = true;
        lastMouseX = e.clientX;
    });

    canvas1D.addEventListener('mousemove', (e) => {
        if (isDragging1D) {
            const dx = e.clientX - lastMouseX;
            linePosition = Math.max(-50, Math.min(50, linePosition + dx * 0.5));
            lastMouseX = e.clientX;
            draw1D(document.getElementById('shape1D').value);
        }
    });

    canvas1D.addEventListener('mouseup', () => isDragging1D = false);
    canvas1D.addEventListener('mouseleave', () => isDragging1D = false);

    // Mouse events for 2D
    canvas2D.addEventListener('mousedown', (e) => {
        isDragging2D = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    canvas2D.addEventListener('mousemove', (e) => {
        if (isDragging2D) {
            const dx = e.clientX - lastMouseX;
            const dy = e.clientY - lastMouseY;
            manualRotation2D += (dx + dy) * 0.01;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            draw2D(document.getElementById('shape2D').value);
        }
    });

    canvas2D.addEventListener('mouseup', () => isDragging2D = false);
    canvas2D.addEventListener('mouseleave', () => isDragging2D = false);

    function animate() {
        requestAnimationFrame(animate);
        
        if (isRotating) {
            rotation2D += 0.02;
            
            if (shape3D) {
                shape3D.rotation.x += 0.01;
                shape3D.rotation.y += 0.01;
            }
            
            if (shape4D) {
                // Enhanced 4D animations
                if (shape4D.outer && shape4D.middle && shape4D.inner && document.getElementById('shape4D').value === 'human') {
                    shape4D.time += 0.02;
                    
                    // W-axis movement simulation
                    shape4D.wAxis = Math.sin(shape4D.time * 0.5) * 0.5;
                    
                    // Simulate 4D rotations and transformations
                    const wScale = Math.cos(shape4D.time * 0.5) * 0.2 + 1;
                    
                    // Outer layer rotation
                    shape4D.outer.rotation.x = Math.sin(shape4D.time * 0.7) * 0.3;
                    shape4D.outer.rotation.y = Math.cos(shape4D.time * 0.5) * 0.3;
                    shape4D.outer.scale.setScalar(1 + Math.sin(shape4D.time * 0.3) * 0.1);
                    
                    // Middle layer rotation with phase difference
                    shape4D.middle.rotation.x = Math.sin(shape4D.time * 0.7 + Math.PI/3) * 0.3;
                    shape4D.middle.rotation.y = Math.cos(shape4D.time * 0.5 + Math.PI/3) * 0.3;
                    shape4D.middle.scale.setScalar(1 + Math.sin(shape4D.time * 0.3 + Math.PI/3) * 0.1);
                    
                    // Inner layer rotation with different phase
                    shape4D.inner.rotation.x = Math.sin(shape4D.time * 0.7 + Math.PI*2/3) * 0.3;
                    shape4D.inner.rotation.y = Math.cos(shape4D.time * 0.5 + Math.PI*2/3) * 0.3;
                    shape4D.inner.scale.setScalar(1 + Math.sin(shape4D.time * 0.3 + Math.PI*2/3) * 0.1);
                    
                    // Apply w-axis movement effect
                    [shape4D.outer, shape4D.middle, shape4D.inner].forEach((layer, i) => {
                        const offset = (i - 1) * 0.2; // Spacing between layers
                        layer.position.z = shape4D.wAxis + offset;
                        
                        // Scale based on w-axis position to simulate perspective in 4D
                        const wDistance = Math.abs(shape4D.wAxis + offset);
                        const perspectiveScale = 1 / (1 + wDistance * 0.3);
                        layer.scale.multiplyScalar(perspectiveScale);
                    });
                } else {
                    // Original rotation for non-human 4D shapes
                    shape4D.outer.rotation.x += 0.01;
                    shape4D.outer.rotation.y += 0.01;
                    shape4D.inner.rotation.x -= 0.01;
                    shape4D.inner.rotation.y -= 0.01;
                }
            }
            
            if (shape5D) {
                update5DShape();
            }
        }
        
        draw2D(document.getElementById('shape2D').value);
        controls3D.update();
        controls4D.update();
        controls5D.update();
        renderer3D.render(scene3D, camera3D);
        renderer4D.render(scene4D, camera4D);
        renderer5D.render(scene5D, camera5D);
    }

    function resetViews() {
        console.log('Resetting views...'); // Debug log
        
        // Reset 1D
        linePosition = 0;
        draw1D(document.getElementById('shape1D').value);
        
        // Reset 2D
        rotation2D = 0;
        manualRotation2D = 0;
        draw2D(document.getElementById('shape2D').value);
        
        // Reset 3D
        if (shape3D) {
            shape3D.rotation.set(0, 0, 0);
            shape3D.position.set(0, 0, 0);
            camera3D.position.set(0, 0, 3);
            camera3D.lookAt(0, 0, 0);
            controls3D.target.set(0, 0, 0);
            controls3D.update();
        }
        
        // Reset 4D
        if (shape4D) {
            if (shape4D.outer && shape4D.middle && shape4D.inner) {
                shape4D.outer.rotation.set(0, 0, 0);
                shape4D.outer.position.set(0, 0, 0);
                shape4D.outer.scale.set(1.4, 1.4, 1.4);

                shape4D.middle.rotation.set(0, 0, 0);
                shape4D.middle.position.set(0, 0, 0);
                shape4D.middle.scale.set(1.2, 1.2, 1.2);

                shape4D.inner.rotation.set(0, 0, 0);
                shape4D.inner.position.set(0, 0, 0);
                shape4D.inner.scale.set(1, 1, 1);

                shape4D.time = 0;
                shape4D.wAxis = 0;
            } else {
                if (shape4D.outer) {
                    shape4D.outer.rotation.set(0, 0, 0);
                    shape4D.outer.position.set(0, 0, 0);
                    shape4D.outer.scale.set(1, 1, 1);
                }
                if (shape4D.inner) {
                    shape4D.inner.rotation.set(0, 0, 0);
                    shape4D.inner.position.set(0, 0, 0);
                    shape4D.inner.scale.set(1, 1, 1);
                }
            }
            camera4D.position.set(0, 0, 3);
            camera4D.lookAt(0, 0, 0);
            controls4D.target.set(0, 0, 0);
            controls4D.update();
        }
        
        // Reset 5D
        if (shape5D) {
            const layers = [shape5D.outer, shape5D.middle, shape5D.inner, shape5D.core];
            layers.forEach(layer => {
                if (layer) {
                    layer.rotation.set(0, 0, 0);
                    layer.position.set(0, 0, 0);
                }
            });
            
            shape5D.time = 0;
            shape5D.wAxis = 0;
            shape5D.vAxis = 0;
            
            camera5D.position.set(0, 0, 3);
            camera5D.lookAt(0, 0, 0);
            controls5D.target.set(0, 0, 0);
            controls5D.update();
        }
    }

    function toggleRotation() {
        console.log('Toggling rotation...'); // Debug log
        isRotating = !isRotating;
        console.log('Rotation is now:', isRotating ? 'ON' : 'OFF');
    }

    // Mobile controls handling
    const controlsTab = document.querySelector('.controls-tab');
    const controlPanel = document.querySelector('.control-panel');
    let isPanelOpen = false;

    if (controlsTab && controlPanel) {
        controlsTab.addEventListener('click', function() {
            isPanelOpen = !isPanelOpen;
            controlPanel.classList.toggle('active', isPanelOpen);
            controlsTab.textContent = isPanelOpen ? 'Controls ▼' : 'Controls ▲';
        });

        // Close panel when clicking outside
        document.addEventListener('click', function(e) {
            if (!controlPanel.contains(e.target) && !controlsTab.contains(e.target) && isPanelOpen) {
                isPanelOpen = false;
                controlPanel.classList.remove('active');
                controlsTab.textContent = 'Controls ▲';
            }
        });

        // Prevent panel from closing when clicking inside
        controlPanel.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Handle touch events for better mobile interaction
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });
    });

    // Initialize everything
    init3D();
    init4D();
    init5D();
    draw1D();
    draw2D();
    create5DShape('penteract');
    animate();
});

function animate() {
    requestAnimationFrame(animate);
    
    if (isRotating) {
        // Update 2D rotation
        rotation2D += 0.01;
        
        // Update 3D shape
        if (shape3D) {
            shape3D.rotation.x += 0.01;
            shape3D.rotation.y += 0.01;
        }
        
        // Update 4D shape
        if (shape4D) {
            if (shape4D.outer) shape4D.outer.rotation.y += 0.01;
            if (shape4D.middle) shape4D.middle.rotation.y -= 0.005;
            if (shape4D.inner) shape4D.inner.rotation.y += 0.015;
        }
        
        // Update 5D shape
        if (shape5D) {
            update5DShape();
        }
    }
    
    // Draw/render all dimensions
    draw1D(document.getElementById('shape1D').value);
    draw2D(document.getElementById('shape2D').value);
    
    // Update controls
    if (controls3D) controls3D.update();
    if (controls4D) controls4D.update();
    if (controls5D) controls5D.update();
    
    // Render 3D scenes
    if (renderer3D && scene3D && camera3D) renderer3D.render(scene3D, camera3D);
    if (renderer4D && scene4D && camera4D) renderer4D.render(scene4D, camera4D);
    if (renderer5D && scene5D && camera5D) renderer5D.render(scene5D, camera5D);
}

// Control buttons scroll behavior
function updateControlsPosition() {
    const controls = document.getElementById('controls');
    const aboutSection = document.querySelector('.about-me');
    const aboutTop = aboutSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    // Make controls sticky when scrolling
    if (scrollPosition > 100) {
        controls.classList.add('sticky');
    } else {
        controls.classList.remove('sticky');
        controls.classList.remove('above-about');
        return;
    }
    
    // When about section is approaching, stick controls above it
    if (aboutTop <= windowHeight - 100) {
        controls.classList.add('above-about');
    } else {
        controls.classList.remove('above-about');
    }
}

window.addEventListener('scroll', updateControlsPosition);
window.addEventListener('resize', updateControlsPosition);
// Initial position
document.addEventListener('DOMContentLoaded', updateControlsPosition);
