export interface IElevationSettings {
  seed: string; // 'fdc9a9ca516c78d1f830948badf1875d88424406',
  frequency: number;
  redistribution: number;
  octave0: number;
  octave1: number;
  octave2: number;
  octave3: number;
  createIsland: boolean;
}
/* /* 
export function proceduralElevation(settings) {
    const simplex = new SimplexNoise(settings.elevationSeed);
    let elevation = [[]];
    let freq = settings.frequencyElevation;  // increase has a zoom out effect, decrease for zoom in
    for (let x = 0; x < settings.hexColums; x++) {
        elevation[x] = [];
        for (let y = 0; y < settings.hexRows; y++) {
            let nx = (x / settings.hexColums) * freq;
            let ny = (y / settings.hexRows) * freq;

            let e = settings.elevationOctaves_0 * simplex.noise2D(nx, ny)
                + settings.elevationOctaves_1 * simplex.noise2D(4*nx, 4*ny)
                + settings.elevationOctaves_2 * simplex.noise2D(8*nx, 8*ny)
                + settings.elevationOctaves_3 * simplex.noise2D(16*nx, 16*ny);
            e = (e + 1) / 2; // from -1 to 1  --> from 0 to 1

            if (settings.createIsland) {
                let xp = (x / settings.hexColums);
                let yp = (y / settings.hexRows);
                let d = Math.hypot(0.5-xp, 0.5-yp);
                e = (1 + e - (d * 3.5)) / 2;
            }

            if (e < 0) e = 0;
            if (e > 1) e = 1;

            elevation[x][y] = Math.pow(e, settings.redistributionElevation);
        }
    }

    return elevation;
} */
