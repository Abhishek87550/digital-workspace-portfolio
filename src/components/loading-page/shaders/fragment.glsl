precision mediump float;

uniform float uOpacity;

varying vec3 vColor;
varying float vAlpha;

void main()
{
    vec2 uv = gl_PointCoord;

    float distanceToCenter = distance(uv, vec2(0.5));

    if(distanceToCenter > 0.5)
        discard;

    // Narrow falloff band (0.5 -> 0.42) keeps just enough anti-aliasing to
    // avoid jagged pixels while making each dot read as a crisp, sharp-edged
    // circle instead of a soft blurry blob.
    float alpha = smoothstep(0.5, 0.42, distanceToCenter);

    // uOpacity eases 1 -> 0 during the dissolve-out transition.
    gl_FragColor = vec4(vColor, alpha * vAlpha * uOpacity);
}
