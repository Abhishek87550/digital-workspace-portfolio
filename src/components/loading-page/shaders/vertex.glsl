uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uProgress;

attribute float aSize;
attribute vec3 aColor;
attribute float aAlpha;

varying vec3 vColor;
varying float vAlpha;

void main()
{
    vColor = aColor;
    vAlpha = aAlpha;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // uProgress eases 0 -> 1 on load, so particles grow smoothly into view
    // instead of popping in at full size.
    gl_PointSize = aSize * uSize * uProgress;

    gl_PointSize *= uPixelRatio;

    gl_PointSize *= (1.0 / -viewPosition.z);
}
