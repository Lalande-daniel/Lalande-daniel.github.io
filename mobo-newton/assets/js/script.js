const matterContainer = document.querySelector('#matter-container');
const THICCNESS = 60;
const SVG_PATH_SELECTOR = "#matter-path"
const SVG_WIDTH_IN_PX = 300
const SVG_WIDTH_AS_PERCENT_OF_CONTAINER_WIDTH= 0.3
const gravity = 1



// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;
    Body = Matter.Body;
    Svg = Matter.Svg;
    Vector = Matter.Vector;
    Vertices = Matter.Vertices;
    Events = Matter.Events;

// create an engine
var engine = Engine.create({ gravity: { y: gravity} });

// create a renderer
var render = Render.create({
    element: matterContainer,
    engine: engine,
    options: {
        width :matterContainer.clientWidth,
        height :matterContainer.clientHeight,
        wireframes: false,
        background: 'transparent',
        showAngleIndicator: false,

    },
});

// for (let i = 0; i < 2000 ; i++){
//     var circles = Bodies.circle(i, 100, 10, {
//         friction: 0.3,
//         frictionAir: 0.00001,
//         restitution: 0.8,
//     });
//     Composite.add(engine.world, [circles]);
// }

createSvgBodies();


// LIMITS
var ground = Bodies.rectangle(
    matterContainer.clientWidth / 2, 
    matterContainer.clientHeight + THICCNESS / 2, 
    10000, 
    THICCNESS, 
    { isStatic: true,
    render : {
        fillStyle : "transparent"
    } });

var leftWall = Bodies.rectangle(
    0 - THICCNESS / 2, 
    matterContainer.clientHeight / 2, 
    THICCNESS, 
    matterContainer.clientHeight * 5, 
    { isStatic: true,
    render : {
        fillStyle : "transparent"
    } });

var rightWall = Bodies.rectangle(
    matterContainer.clientWidth + THICCNESS / 2, 
    matterContainer.clientHeight / 2, 
    THICCNESS, 
    matterContainer.clientHeight * 5, 
    { isStatic: true,
    render : {
        fillStyle : "transparent"
    } });



// add all of the bodies to the world
Composite.add(engine.world, [ground, leftWall, rightWall]);

// Créer un corps statique pour hero__title
var heroTitle = document.querySelector('.hero__title');
var titleRect = heroTitle.getBoundingClientRect();

var heroTitleBody = Bodies.rectangle(
    titleRect.left + (titleRect.width / 2) + window.scrollX, 
    titleRect.top + (titleRect.height / 2) + window.scrollY, 
    titleRect.width, 
    titleRect.height, 
    { 
        isStatic: true,
        render: {
            visible: false 
        }
    }
);

Composite.add(engine.world, [heroTitleBody]);



let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
})
Composite.add(engine.world, mouseConstraint);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create({

});

// run the engine
Runner.run(runner, engine);



// CUSTOM SHAPES
function createSvgBodies() {
    const paths = document.querySelectorAll(SVG_PATH_SELECTOR);
    const colors = ['#ff98e5', '#ffd84e', '#ef4b40', '#cb46e8', '#47c9ee', '#48ee6c', '#ef6b49']; 
    
    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function getRandomNumber() {
        return Math.floor(Math.random() * (SVG_WIDTH_IN_PX + 1)) - SVG_WIDTH_IN_PX * 4;
    }

    paths.forEach((path, index) => {
        let vertices = Svg.pathToVertices(path);
        let scaleFactor = (matterContainer.clientWidth * SVG_WIDTH_AS_PERCENT_OF_CONTAINER_WIDTH) / SVG_WIDTH_IN_PX
        vertices = Vertices.scale(vertices, scaleFactor, scaleFactor)
        let randomColor = getRandomColor(); 
        let randomY = getRandomNumber(); 

        let circleBody = Bodies.circle(index * SVG_WIDTH_IN_PX , randomY + SVG_WIDTH_IN_PX, SVG_WIDTH_IN_PX / 3, {
            // mass: 0.001, // Définissez une masse plus faible
            // density: 0.001, // Définissez une densité plus faible
            // frictionAir: 0.000001, // Réduire la friction de l'air pour moins de résistance
            // restitution: 0.8, // Augmentez la restitution pour plus de rebond
            // friction: 0.0001, // Réduire la friction pour moins de résistance au mouvement
            render : {
                fillStyle: randomColor,
                strokeStyle: randomColor,
            } 
        })

        let svgBody = Bodies.fromVertices(index * SVG_WIDTH_IN_PX / 2, randomY + SVG_WIDTH_IN_PX, [vertices], {
            // mass: 0.001, // Définissez une masse plus faible
            // density: 0.001, // Définissez une densité plus faible
            // frictionAir: 0.000001, // Réduire la friction de l'air pour moins de résistance
            // restitution: 10, // Augmentez la restitution pour plus de rebond
            // friction: 0, // Réduire la friction pour moins de résistance au mouvement
            render : {
                fillStyle: randomColor,
                strokeStyle: randomColor,
                lineWidth: 1,
                showAngleIndicator: false
            }

        
        });
        Composite.add(engine.world, [svgBody, circleBody]) 
    });
   
}


// RESPONSIVE ELEMENTS
function scaleBodies() {
    const allBodies = Composite.allBodies(engine.world);

    allBodies.forEach((body) => {
        if (body.isStatic === true) return; //DON'T SCALL WALLS & GROUND

        const {min, max} = body.bounds;
        const bodyWidth = max.x - min.x;
        let scaleFactor = (matterContainer.clientWidth * SVG_WIDTH_AS_PERCENT_OF_CONTAINER_WIDTH) / bodyWidth /2;

        Body.scale(body, scaleFactor, scaleFactor)
    });
}

function handleResize(matterContainer) {
    // Canvas responsive
    render.canvas.width = matterContainer.clientWidth
    render.canvas.height = matterContainer.clientHeight


    // Ground responsive
    Matter.Body.setPosition(
        ground,
        Matter.Vector.create(
            matterContainer.clientWidth / 2,
            matterContainer.clientHeight + THICCNESS / 2
        )
    );

    // walls responsive
    Matter.Body.setPosition(
        rightWall,
        Matter.Vector.create(
            matterContainer.clientWidth + THICCNESS / 2,
            matterContainer.clientHeight / 2
        )
    );

    scaleBodies();
}

function updateHeroTitleBodyPosition() {
    var titleRect = heroTitle.getBoundingClientRect();
    var currentWidth = heroTitleBody.bounds.max.x - heroTitleBody.bounds.min.x;
    var currentHeight = heroTitleBody.bounds.max.y - heroTitleBody.bounds.min.y;
    
    var scaleX = titleRect.width / currentWidth;
    var scaleY = titleRect.height / currentHeight;

    
    Body.scale(heroTitleBody, scaleX, scaleY);
    Body.setPosition(heroTitleBody, {
        x: titleRect.left + (titleRect.width / 2) + window.scrollX, 
        y: titleRect.top + (titleRect.height / 2) + window.scrollY,

    });
    
    console.log(scaleX, scaleY)
}



window.addEventListener("resize", () => {
    handleResize(matterContainer);
    updateHeroTitleBodyPosition();
});



mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);


window.onload = () => {
    updateHeroTitleBodyPosition();
    createMouseFollower();
};





// let mouseCircle;

// function createMouseFollower() {
//     mouseCircle = Bodies.circle(0, 0, 40, {
//         isStatic: true,
//         mass: 0, // Définissez une masse plus faible
//         density: 0.001, // Définissez une densité plus faible
//         frictionAir: 0.001, // Réduire la friction de l'air pour moins de résistance
//         restitution: 1.2, // Augmentez la restitution pour plus de rebond
//         friction: 0.0001, // Réduire la friction pour moins de résistance au mouvement
//     });
//     Composite.add(engine.world, mouseCircle);
// }


// if (mouse && mouse.element) {
//     mouse.element.addEventListener('mousemove', function(event) {
//         // Vérifiez que mouseCircle est défini avant de définir sa position
//         if (mouseCircle) {
//             var mousePosition = {
//                 x: event.pageX,
//                 y: event.pageY
//             };
//             Body.setPosition(mouseCircle, mousePosition);
//         }
//     });
// }




















































// SVG NOIRS


// var canvas = document.getElementById("canvas");
// var ctx = canvas.getContext("2d");

// // Ajustez le canvas pour remplir la fenêtre
// function resizeCanvas() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// }
// window.addEventListener('resize', resizeCanvas);
// resizeCanvas();

// var scaleFactor = 50; // Facteur d'échelle pour les coordonnées du monde physique
// var gravity = new b2Vec2(0, 100);
// var world = new b2World(gravity);

// // Création du système de particules
// var psd = new b2ParticleSystemDef();
// radius = 0.3; // Radius des particules
// var visualRadiusScale = 0.5; // Échelle du radius pour le rendu visuel (80% du radius physique pour le "padding")
// psd.radius = radius;
// psd.dampingStrength = 1.5; // Augmentez cette valeur pour plus d'amortissement


// var particleSystem = world.CreateParticleSystem(psd);

// // Création du récipient de particules
// var groundBodyDef = new b2BodyDef();
// var groundBody = world.CreateBody(groundBodyDef);
// var shape = new b2PolygonShape();
// var pd = new b2ParticleGroupDef();
// pd.flags = b2_waterParticle;



// var wallsCreated = false; // Variable globale pour suivre l'état de création des murs
// var wallFixtures = []; // Stocker les références aux fixtures des murs

// function adjustWalls() {
//     var wallThickness = 0.1;
//     var wallPositions = [
//         { x: 0, y: canvas.height / scaleFactor / 2, width: wallThickness, height: canvas.height / scaleFactor }, // Gauche
//         { x: canvas.width / scaleFactor - wallThickness / 2, y: canvas.height / scaleFactor / 2, width: wallThickness, height: canvas.height / scaleFactor }, // Droite
//         { x: canvas.width / scaleFactor / 2, y: canvas.height / scaleFactor - wallThickness / 2, width: canvas.width / scaleFactor, height: wallThickness } // Bas
//     ];

//     var fixture = groundBody.GetFixtureList();
//     for (var i = 0; fixture && i < wallPositions.length; i++) {
//         var wall = wallPositions[i];
//         var shape = new b2PolygonShape();
//         shape.SetAsBoxXYCenterAngle(wall.width, wall.height, new b2Vec2(wall.x, wall.y), 0);
//         fixture.GetShape().Copy(shape);
//         fixture = fixture.GetNext();
//     }
// }

// function createWalls() {
    
//         var wallThickness = 0.1;
//         var walls = [{
//                 x: 0,
//                 y: canvas.height / scaleFactor / 2,
//                 width: wallThickness,
//                 height: canvas.height / scaleFactor
//             }, // Gauche
//             {
//                 x: canvas.width / scaleFactor - wallThickness / 2,
//                 y: canvas.height / scaleFactor / 2,
//                 width: wallThickness,
//                 height: canvas.height / scaleFactor
//             }, // Droite
//             {
//                 x: canvas.width / scaleFactor / 2,
//                 y: canvas.height / scaleFactor - wallThickness / 2,
//                 width: canvas.width / scaleFactor,
//                 height: wallThickness
//             } // Bas
//         ];

//         // Détruire les anciennes fixtures des murs si elles existent
//         wallFixtures.forEach(function(fixture) {
//             groundBody.DestroyFixture(fixture);
//         });
//         wallFixtures = []; // Réinitialiser le tableau des fixtures des murs

//         // Créer de nouvelles fixtures des murs et stocker leurs références
//         walls.forEach(function(wall) {
//             shape.SetAsBoxXYCenterAngle(wall.width, wall.height, new b2Vec2(wall.x, wall.y), 0);
//             var fixture = groundBody.CreateFixtureFromShape(shape, 0);
//             wallFixtures.push(fixture); // Stocker la référence à la fixture
//         });
    
// }

// // Appelez createWalls initialement pour créer les murs
// createWalls();


// // Lorsque la fenêtre est redimensionnée
// window.addEventListener('resize', function() {
//     resizeCanvas();
//     createWalls(); // Cela va détruire et recréer les murs
// });

// var blocNumberX = 11; // Nombre de blocs horizontaux
// var blocNumberY = 4; // Nombre de blocs verticaux

// // Ajout des particules dans le récipient
// shape.SetAsBoxXYCenterAngle(blocNumberX, blocNumberY, new b2Vec2(15, 10), 0);
// pd.shape = shape;
// particleSystem.CreateParticleGroup(pd);


// var mousePosition = new b2Vec2(0, 0); // Position initiale de la souris dans le monde
// var lastMousePosition = new b2Vec2(0, 0); // Dernière position connue de la souris dans le monde
// var mouseVelocity = new b2Vec2(0, 0); // Vitesse de déplacement de la souris

// var mouseBodyDef = new b2BodyDef();
// mouseBodyDef.type = b2_dynamicBody;
// var mouseBody = world.CreateBody(mouseBodyDef);
// var mouseShape = new b2CircleShape();
// mouseShape.radius = 0.2; // Rayon initial pour l'interaction avec les particules
// var mouseFixture = mouseBody.CreateFixtureFromShape(mouseShape, 1);

// // Mettre à jour la position stockée de la souris
// function updateMousePosition(event) {
//     var rect = canvas.getBoundingClientRect();
//     var position = {
//         x: (event.clientX - rect.left) / scaleFactor,
//         y: (event.clientY - rect.top) / scaleFactor
//     };

//     // Mettre à jour la vitesse de la souris
//     mouseVelocity.Set(position.x - mousePosition.x, position.y - mousePosition.y);

//     // Mettre à jour la position de la souris
//     mousePosition.Set(position.x, position.y);
// }

// // Écouteurs d'événements pour la position de la souris
// canvas.addEventListener('mousemove', updateMousePosition);
// canvas.addEventListener('mouseenter', updateMousePosition);

// function getCanvasRelativePosition(event) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: event.clientX - rect.left,
//         y: event.clientY - rect.top
//     };
// }

// // Fonction pour mettre à jour le rayon du corps de la souris
// function updateMouseRadius(newRadius) {
//     // Détruire la fixture existante
//     mouseBody.DestroyFixture(mouseFixture);

//     // Créer une nouvelle forme avec le nouveau rayon
//     mouseShape = new b2CircleShape();
//     mouseShape.radius = newRadius;

//     // Attacher la nouvelle forme au corps de la souris
//     mouseFixture = mouseBody.CreateFixtureFromShape(mouseShape, 1);
// }




// const colors = ['#ff98e5', '#ffd84e', '#ef4b40', '#cb46e8', '#47c9ee', '#48ee6c', '#ef6b49'];  
// function getRandomColor() {
//     return colors[Math.floor(Math.random() * colors.length)];
// }
// var randomParticleColor = getRandomColor();



// var svgImage = new Image();
// svgImage.onload = function() {
//     // Une fois l'image chargée, commencez la boucle de mise à jour
//     requestAnimationFrame(step);
// };
// svgImage.src = 'assets/img/svg-colored-4.svg'; // Chemin corrigé pour le SVG



// var currentRotation = []; // Tableau pour stocker la rotation actuelle de chaque particule

// // Initialisez le tableau de rotation actuelle
// for (var i = 0; i < particleSystem.GetParticleCount(); ++i) {
//     currentRotation[i] = 0;
// }

// var rotationSpeed = 0.03; // Vitesse de rotation pour l'interpolation
// var minSpeedTolerance = 0.2; // Vitesse minimale pour la rotation
// var maxAngleChange = Math.PI / 2; // Changement maximal d'angle autorisé par mise à jour

// function normalizeAngle(angle) {
//     while (angle > Math.PI) angle -= 2 * Math.PI;
//     while (angle < -Math.PI) angle += 2 * Math.PI;
//     return angle;
// }

// function getParticleDirection(index) {
//     var velocities = particleSystem.GetVelocityBuffer();
//     var vx = velocities[index * 2];
//     var vy = velocities[index * 2 + 1];
//     var speed = Math.sqrt(vx * vx + vy * vy);

//     // Normaliser la direction horizontale
//     var direction = vx >= 0 ? 1 : -1; // 1 pour droite, -1 pour gauche

//     var targetRotation = Math.atan2(vy, Math.abs(vx)) * direction;

//     // Normalisation de l'angle cible
//     targetRotation = normalizeAngle(targetRotation);

//     // Appliquer un seuil de vitesse
//     if (speed < minSpeedTolerance) {
//         targetRotation = currentRotation[index];
//     }

//     // Calcul de la différence d'angle et normalisation
//     var angleDifference = normalizeAngle(targetRotation - currentRotation[index]);

//     // Limiter le changement d'angle à 'maxAngleChange'
//     angleDifference = Math.min(Math.max(angleDifference, -maxAngleChange), maxAngleChange);

//     // Interpolation pour une rotation douce
//     currentRotation[index] += angleDifference * rotationSpeed;

//     return normalizeAngle(currentRotation[index]);
// }


// // Fonction pour dessiner une image avec rotation
// function drawRotatedImage(image, x, y, angle, width, height) {
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.rotate(angle);
//     ctx.drawImage(image, -width / 2, -height / 2, width, height);
//     ctx.restore();
// }





// // Fonction de mise à jour
// function step() {
//     world.Step(1 / 144, 8, 3);

//     ctx.clearRect(0, 0, canvas.width, canvas.height);


//     /// Calculer la nouvelle vitesse de la souris et mettre à jour le rayon
//     mouseVelocity.Set(mousePosition.x - lastMousePosition.x, mousePosition.y - lastMousePosition.y);
//     lastMousePosition.Set(mousePosition.x, mousePosition.y);

//     // Calculer le nouveau rayon basé sur la vitesse de la souris
//     var speed = mouseVelocity.Length();
//     var newRadius = 0.2 + speed * 0.25; // Ajustez ces valeurs selon les besoins
//     newRadius = Math.min(Math.max(newRadius, 0.2), 1); // Min et max pour le rayon

//     // Appliquer le nouveau rayon si différent de l'actuel
//     if (mouseShape.m_radius !== newRadius) {
//         updateMouseRadius(newRadius);
//     }

//     // Mettre à jour la position du corps de la souris
//     mouseBody.SetTransform(mousePosition, 0);
//     // console.log(mouseShape.radius)


//     // Rendu des particules
//     var particles = particleSystem.GetPositionBuffer();
//     var particleColor = randomParticleColor; // Définir la couleur de remplissage des particules
//     ctx.fillStyle = particleColor;

//     // Calcul du radius visuel basé sur le radius physique des particules
//     var particleRadius = psd.radius * scaleFactor;
//     var visualRadius = particleRadius * visualRadiusScale;
//     for (var i = 0; i < particles.length / 2; ++i) {
//         var x = particles[2 * i] * scaleFactor;
//         var y = particles[2 * i + 1] * scaleFactor;
//         var angle = getParticleDirection(i);
    
//         if (svgImage.complete && svgImage.naturalWidth !== 0) {
//             drawRotatedImage(svgImage, x, y, angle, visualRadius * 2, visualRadius * 2);
//         }
//     }

//     createWalls();
//     requestAnimationFrame(step);
// }

// // Démarrer la boucle de mise à jour
// requestAnimationFrame(step);


























// // PAPER JS

// // DRAW

// paper.install(window);
// window.onload = function() {    
//     var canvas = document.getElementById("myCanvas");
//     paper.setup(canvas);
//     // Ajustez le canvas pour remplir la fenêtre

// function resizeCanvas() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     console.log(canvas.width, canvas.height)
// }
// resizeCanvas();
// window.addEventListener('resize', resizeCanvas);

//  // Customize this part for the splash effect
//  var tool = new Tool();
//  var minDistance = 10;
//  var maxDistance = 20;

//  // Group to hold circle segments
//  var path;



// function onResize(event) {
//     // Whenever the window is resized, recenter the path:
//     path.position = view.center;
// }

// const colors = ['#ff98e5', '#ffd84e', '#ef4b40', '#cb46e8', '#47c9ee', '#48ee6c', '#ef6b49'];  
// function getRandomColor() {
//     return colors[Math.floor(Math.random() * colors.length)];
// }
// var randomParticleColor = getRandomColor();

//  // Style for the stroke
//  var style = {
//      fillColor: getRandomColor(),
//      strokeColor: getRandomColor(),
//      strokeWidth: 10
//  };

 

//  // Define the tool's onMouseDown event handler
//  tool.onMouseDown = function(event) {
//      // Every time the mouse is clicked, create a new path
//      path = new Group();
     
//  };

//  // Define the tool's onMouseDrag event handler
//  tool.onMouseDrag = function(event) {
//      var step = event.delta;
//      step.angle += 90;
     
//      var top = event.middlePoint.add(step.normalize(maxDistance).multiply(1.5));
//      var bottom = event.middlePoint.subtract(step.normalize(maxDistance).multiply(1.5));
     
//      var line = new Path();
//      line.add(top);
//      line.lineBy(step.normalize(maxDistance).multiply(-3));
//      line.style = style;
//      path.addChild(line);
     
//      // Smooth the segments of the path to create the splash effect
//      if (event.delta.length > minDistance) {
//          for(var i = 0; i < path.children.length; i++) {
//              path.children[i].smooth();
//          }
//      }
//  };
// };














// WAVE    

// paper.install(window);

// // Fonction pour redimensionner le canvas
// function resizeCanvas() {
//     var canvas = document.getElementById('myCanvas');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     if (paper && paper.view) {
//         paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
//         paper.view.draw();
//     }
// }

// window.addEventListener('resize', resizeCanvas);

// window.onload = function() {    
//     var canvas = document.getElementById("myCanvas");
//     paper.setup(canvas);

//     var values = {
//         friction: 0.8,
//         timeStep: 0.01,
//         amount: 15,
//         mass: 2,
//         count: 0,
//         invMass: 1 / 2 // Ici, vous pouvez calculer directement 1 / mass.

//     };



    
//     var path, springs;
//     var size = view.size.multiply([1.2, 1]); // Utilisez multiply pour les objets Size.

    
//     var Spring = function(a, b, strength, restLength) {
//         this.a = a;
//         this.b = b;
//         this.restLength = restLength || 80;
//         this.strength = strength || 0.55;
//         this.mamb = values.invMass * values.invMass;
//     };
    
//     Spring.prototype.update = function() {
//         var delta = this.b.subtract(this.a);
//         var dist = delta.length;
//         var normDistStrength = (dist - this.restLength) /
//                 (dist * this.mamb) * this.strength;
//         delta = delta.normalize().multiply(normDistStrength * values.invMass * 0.2);
//         if (!this.a.fixed)
//             this.a.y += delta.y;
//         if (!this.b.fixed)
//             this.b.y -= delta.y;
//     };



//     function createPath(strength) {
//         var path = new Path({
//             fillColor: 'black'
//         });
//         springs = [];
//         for (var i = 0; i <= values.amount; i++) {
//             var segment = path.add(new Point(i / values.amount, 0.5) * size);
//             var point = segment.point;
//             if (i == 0 || i == values.amount)
//                 point.y += size.height;
//             point.px = point.x;
//             point.py = point.y;
//             // The first two and last two points are fixed:
//             point.fixed = i < 2 || i > values.amount - 2;
//             if (i > 0) {
//                 var spring = new Spring(segment.previous.point, point, strength);
//                 springs.push(spring);
//             }
//         }
//         path.position.x -= size.width / 4;
//         return path;
//     }


//     function updateWave(path) {
//         var force = 1 - values.friction * values.timeStep * values.timeStep;
//         for (var i = 0, l = path.segments.length; i < l; i++) {
//             var point = path.segments[i].point;
//             var dy = (point.y - point.py) * force;
//             point.py = point.y;
//             point.y = Math.max(point.y + dy, 0);
//         }
    
//         for (var j = 0, l = springs.length; j < l; j++) {
//             springs[j].update();
//         }
//         path.smooth({ type: 'continuous' });
//     }

    

//     function onFrame(event) {
//         updateWave(path);
//     }



//     function onMouseMove(event) {
//         // Vérifiez d'abord si `path` est défini
//         if (path) {
//             var location = path.getNearestLocation(event.point);
//             // Ensuite, vérifiez si `location` n'est pas nul
//             if (location && location.segment) {
//                 var segment = location.segment;
//                 var point = segment.point;
    
//                 if (!point.fixed && location.distance < size.height / 4) {
//                     var y = event.point.y;
//                     point.y += (y - point.y) / 6;
//                     if (segment.previous && !segment.previous.fixed) {
//                         var previous = segment.previous.point;
//                         previous.y += (y - previous.y) / 24;
//                     }
//                     if (segment.next && !segment.next.fixed) {
//                         var next = segment.next.point;
//                         next.y += (y - next.y) / 24;
//                     }
//                 }
//             }
//         }
//     }


//     function onResize() {
//         if (path)
//             path.remove();
//         size = view.bounds.size * [2, 1];
//         path = createPath(0.1);
//     }


//     function onKeyDown(event) {
//         if (event.key == 'space') {
//             path.fullySelected = !path.fullySelected;
//             path.fillColor = path.fullySelected ? null : 'black';
//         }
//     }
    

//     // Attachez les événements aux vues de Paper.js
//     view.onFrame = onFrame;
//     view.onMouseMove = onMouseMove;
//     view.onResize = onResize;
//     view.onKeyDown = onKeyDown;

//      // Initialisez tout ce qui est nécessaire après le chargement
//      path = createPath(0.1); // Cela appellera `createPath` avec la force initiale
//      resizeCanvas(); // Cela ajustera le canvas à la taille de la fenêtre

// };






























  






  