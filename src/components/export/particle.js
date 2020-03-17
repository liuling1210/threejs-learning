
import * as THREE from "three";
function Particle(x, y, z, mass){

    this.position = new THREE.Vector3();
    this.previous = new THREE.Vector3();
    this.original = new THREE.Vector3();
    this.a = new THREE.Vector3(0, 0, 0); // acceleration
    this.mass = mass;
    this.invMass = 1 / mass;
    this.tmp = new THREE.Vector3();
    this.tmp2 = new THREE.Vector3();
  
    var restDistance = 25;

    var xSegs = 10;
    var ySegs = 10;
    var clothFunction = plane( restDistance * xSegs, restDistance * ySegs );

    // init
    clothFunction(x, y, this.position); // position
    clothFunction(x, y, this.previous); // previous
    clothFunction(x, y, this.original);

}

function plane( width, height ) {

  return function ( u, v, target ) {

    var x = ( u - 0.5 ) * width;
    var y = ( v + 0.5 ) * height;
    var z = 0;

    target.set( x, y, z );

  };

}

export{
  Particle
}
