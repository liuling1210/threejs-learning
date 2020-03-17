
import { Particle } from "../export/particle";
function  Cloth(w, h) {
    w = w || 10;
    h = h || 10;
    var w = w;
    var h = h;
    var MASS = 0.1;

    var particles = [];
    var constraints = [];

    var u, v;

    // Create particles
    for (v = 0; v <= h; v++) {
      for (u = 0; u <= w; u++) {
        particles.push(new Particle(u / w, v / h, 0, MASS));
      }
    }
    // Structural

    for (v = 0; v < h; v++) {
      for (u = 0; u < w; u++) {
        constraints.push([
          particles[index(u, v)],
          particles[index(u, v + 1)],
          this.restDistance
        ]);

        constraints.push([
          particles[index(u, v)],
          particles[index(u + 1, v)],
          this.restDistance
        ]);
      }
    }

    for (u = w, v = 0; v < h; v++) {
      constraints.push([
        particles[index(u, v)],
        particles[index(u, v + 1)],
        this.restDistance
      ]);
    }

    for (v = h, u = 0; u < w; u++) {
      constraints.push([
        particles[index(u, v)],
        particles[index(u + 1, v)],
        this.restDistance
      ]);
    }

    // While many systems use shear and bend springs,
    // the relaxed constraints model seems to be just fine
    // using structural springs.
    // Shear
    // var diagonalDist = Math.sqrt(restDistance * restDistance * 2);

    // for (v=0;v<h;v++) {
    // 	for (u=0;u<w;u++) {

    // 		constraints.push([
    // 			particles[index(u, v)],
    // 			particles[index(u+1, v+1)],
    // 			diagonalDist
    // 		]);

    // 		constraints.push([
    // 			particles[index(u+1, v)],
    // 			particles[index(u, v+1)],
    // 			diagonalDist
    // 		]);

    // 	}
    // }

    this.particles = particles;
    this.constraints = constraints;

    function index(u, v) {
      return u + v * (w + 1);
    }
    this.index = index;
  }

export{
    Cloth
}
