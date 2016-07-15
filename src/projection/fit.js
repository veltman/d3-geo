import {default as geoStream} from "../stream";
import boundsStream from "../path/bounds";

function fit(project, extent, object) {
  var clip = project.clipExtent && project.clipExtent();

  if (clip != null) {
    project.clipExtent(null);
  }

  project.translate([0, 0]);

  geoStream(object, project.stream(boundsStream));

  var b = boundsStream.result(),
      w = extent[1][0] - extent[0][0],
      h = extent[1][1] - extent[0][1],
      bw = b[1][0] - b[0][0],
      bh = b[1][1] - b[0][1],
      factor = 1 / Math.max(bw / w, bh / h),
      x = +extent[0][0] - (factor * b[0][0]) + (w - bw * factor) / 2,
      y = +extent[0][1] - (factor * b[0][1]) + (h - bh * factor) / 2;

  if (clip != null) {
    project.clipExtent(clip);
  }

  return project
      .scale(project.scale() * factor)
      .translate([x, y]);
}

export function fitSize(project) {
  return function(size, object) {
    return fit(project,  [[0, 0], size], object);
  };
}

export function fitExtent(project) {
  return function(extent, object) {
    return fit(project, extent, object);
  };
}
