const float PI = 3.1415926535897932384626433832795;

uniform vec2 uMouse;
uniform float uTime;
varying float vTime;
varying vec2 vUv;
uniform vec2 uFrequency;
uniform vec3 uPosition;
uniform vec3 uRotation;
uniform vec2 uResolution;
uniform float uValueA;


vec2 rotateUV(vec2 uv, vec2 pivot, float rotation) {
  mat2 rotation_matrix=mat2(  vec2(sin(rotation),-cos(rotation)),
                              vec2(cos(rotation),sin(rotation))
                              );
  uv -= pivot;
  uv= uv*rotation_matrix;
  uv += pivot;
  return uv;
}



void main()

{




  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float warpsScale = sin(uTime * uValueA) ;

  modelPosition.xyz += warpsScale * .1 * cos(3. * modelPosition.yzx + uTime);
  modelPosition.xyz += warpsScale * .05 * cos(11. * modelPosition.yzx + uTime);
  modelPosition.xyz += warpsScale * .025 * cos(17. * modelPosition.yzx + uTime);

  modelPosition.zxy += warpsScale * .1 * sin(3. * modelPosition.yzx + uTime);
  modelPosition.zxy += warpsScale * .05 * sin(11. * modelPosition.yzx + uTime);
  modelPosition.zxy += warpsScale * .025 * sin(17. * modelPosition.yzx + uTime);
  // modelPosition.xyz += warpsScale * .0125 * cos(21. * modelPosition.yzx + uTime);

  vec4 viewPosition = viewMatrix * modelPosition;

  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;



  // gl_Position = vec4(position, 1.0);
  // //

  vUv = uv;
  vTime = uTime;

}
