(function(exports) {
  "use strict";

  exports = exports || window;

  var textureCount = 0;

  exports.initializeTexture = function(gl, texture, src) {
    texture.image = new Image();
    texture.image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        texture.image
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // Animate once textures load.
      if (++textureCount === 6) {
        animate();
      }
    };
    texture.image.crossOrigin = "anonymous";
    texture.image.src = src;
  };

  exports.initCubeTextrue = function(gl, texture, faces) {
    for (var i = 0; i < faces.length; i++) {
      var face = faces[i][0];
      var image = new Image();
      image.onload = (function(texture, face, image) {
        return function() {
          //connect the cube map and return as one texture
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(
            gl.TEXTURE_CUBE_MAP,
            gl.TEXTURE_MIN_FILTER,
            gl.LINEAR
          );
          gl.texParameteri(
            gl.TEXTURE_CUBE_MAP,
            gl.TEXTURE_MAG_FILTER,
            gl.LINEAR
          );
          gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        };
      })(texture, face, image);
      image.crossOrigin = "anonymous";
      image.src = faces[i][1];
    }
  };
})();
