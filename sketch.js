const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Render=Matter.Render;
const Mouse=Matter.Mouse;
const MouseConstraint=Matter.MouseConstraint;
const Composites=Matter.Composites;
const Common=Matter.Common;

var engine,world,render;
var ground,boxA,boxB;
var mouse,mouseConstraint,stack,platform;

function setup(){
    engine=Engine.create();
    world=engine.world;
    Engine.run(engine);

    render=Render.create({
        element:document.body,
        engine:engine,
        options:{
            width:1600,
            height:800,
            wireframe:false
        }
    });

    //ground = Bodies.rectangle(400,600,810,60,{ isStatic: true});

    platform = Bodies.rectangle(1200, 500, 300, 20, { isStatic: true });
    stack = Composites.stack(1100, 270, 4, 4, 0, 0, function(x, y) {
        return Matter.Bodies.polygon(x, y, 8, 30);
    });
     
    mouse = Mouse.create(render.canvas);
    mouseConstraint = MouseConstraint.create(engine,{
        mouse:mouse,
        constraint:{
            render:false,
        }
    });

    ball = Bodies.circle(300, 600,30);
    sling = Constraint.create({ 
      pointA: { x: 300, y: 600 }, 
      bodyB: ball, 
      stiffness: 0.05
    });

    var firing = false;
    Matter.Events.on(mouseConstraint,'enddrag', function(e) {
        if(e.body === ball){
            firing = true;
        }
    });

    Matter.Events.on(engine,'afterUpdate', function() {
        var pos=ball.position;
        if (firing && Math.abs(pos.x-300) < 20 && Math.abs(ball.position.y-600) < 20) {
            ball = Bodies.circle(300, 600, 30);
            World.add(world, ball);
            sling.bodyB = ball;
            firing = false;
        }
    });
   
    
    World.add(world,[stack,platform,mouseConstraint,ball,sling]);
    Render.run(render);
}

function draw(){
}
