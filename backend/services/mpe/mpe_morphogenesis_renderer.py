import html
import math


SVG_SIZE = 720
CENTER = SVG_SIZE / 2


def render_morphogenesis_svg(morphogenesis: dict) -> str:
    parameters = morphogenesis.get("visual_parameters") or {}
    geometry = morphogenesis.get("geometry_state") or {}
    seed = morphogenesis.get("morphogenesis_seed") or {}
    shape = geometry.get("shape", "Punto")
    glow = 0.18 + float(seed.get("E", 0.5)) * 0.42
    stroke_opacity = 0.45 + float(seed.get("R", 0.5)) * 0.35
    elements = [
        _defs(glow),
        f'<rect width="{SVG_SIZE}" height="{SVG_SIZE}" fill="#08090d"/>',
        f'<circle cx="{CENTER}" cy="{CENTER}" r="{parameters.get("radius", 180)}" fill="none" stroke="#ffffff" stroke-opacity="0.045"/>',
    ]
    elements.extend(_render_shape(shape, parameters, seed, stroke_opacity))
    elements.append(
        f'<text x="36" y="{SVG_SIZE - 42}" fill="#d8d5ca" font-family="Arial, sans-serif" font-size="18">'
        f'{html.escape(str(morphogenesis.get("client", "Entity")))} / {html.escape(shape)}</text>'
    )
    return "\n".join(
        [
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{SVG_SIZE}" height="{SVG_SIZE}" viewBox="0 0 {SVG_SIZE} {SVG_SIZE}" role="img">',
            f'<title>{html.escape(str(morphogenesis.get("client", "MPE Morphogenesis")))}</title>',
            *elements,
            "</svg>",
        ]
    )


def render_morphogenesis_markdown(morphogenesis: dict) -> str:
    geometry = morphogenesis.get("geometry_state") or {}
    seed = morphogenesis.get("morphogenesis_seed") or {}
    parameters = morphogenesis.get("visual_parameters") or {}
    interpretation = morphogenesis.get("interpretation") or {}

    lines = [
        "# MPE MORPHOGENESIS",
        "",
        f"Cliente: {morphogenesis.get('client', 'Cliente sin nombre')}",
        "",
        "## Estado geometrico",
        "",
        f"- Forma: {geometry.get('shape', 'Pendiente')}",
        f"- Etapa: {geometry.get('stage', 'Pendiente')}",
        f"- Pregunta: {geometry.get('question', 'Pendiente')}",
        f"- Proxima geometria: {geometry.get('next_geometry', 'Pendiente')}",
        "",
        "## Semilla morfogenetica",
        "",
    ]
    lines.extend([f"- {axis}: {seed.get(axis, 0)}" for axis in ["D", "R", "V", "F", "M", "N", "E"]])
    lines.extend(["", "## Parametros visuales", ""])
    lines.extend([f"- {key}: {value}" for key, value in parameters.items()])
    lines.extend(
        [
            "",
            "## Interpretacion evolutiva",
            "",
            interpretation.get("visual_meaning", "Pendiente de interpretacion."),
            "",
            "## Direccion visual siguiente",
            "",
            interpretation.get("next_visual_direction", "Pendiente de definir."),
            "",
            "## Ruta del SVG generado",
            "",
            morphogenesis.get("svg_path", "SVG pendiente."),
        ]
    )
    return "\n".join(lines).rstrip() + "\n"


def _defs(glow):
    return f"""<defs>
  <radialGradient id="mpeGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#f4efe2" stop-opacity="{glow}"/>
    <stop offset="55%" stop-color="#7cc7b2" stop-opacity="{glow * 0.42}"/>
    <stop offset="100%" stop-color="#08090d" stop-opacity="0"/>
  </radialGradient>
  <filter id="softGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<circle cx="{CENTER}" cy="{CENTER}" r="310" fill="url(#mpeGlow)"/>"""


def _render_shape(shape, parameters, seed, stroke_opacity):
    if shape == "Linea":
        return _line(parameters, seed, stroke_opacity)
    if shape == "Triangulo":
        return _triangle(parameters, seed, stroke_opacity)
    if shape == "Red":
        return _network(parameters, seed, stroke_opacity)
    if shape == "Espiral":
        return _spiral(parameters, seed, stroke_opacity)
    if shape == "Toroide":
        return _torus(parameters, seed, stroke_opacity)
    if shape == "Fractal":
        return _fractal(parameters, seed, stroke_opacity)
    return _point(parameters, seed, stroke_opacity)


def _points(parameters, seed):
    count = int(parameters.get("cell_count", 48))
    radius = float(parameters.get("radius", 180))
    spiral = float(parameters.get("spiral_factor", 1.6))
    noise = float(parameters.get("noise_level", 0.15))
    variation = float(seed.get("D", 0.5))
    points = []
    golden = math.pi * (3 - math.sqrt(5))
    for index in range(count):
        t = index / max(count - 1, 1)
        angle = index * golden * spiral
        wave = math.sin(index * 1.7 + variation * 4.0)
        local_radius = radius * math.sqrt(t) * (0.72 + variation * 0.42 + wave * noise * 0.28)
        points.append((CENTER + math.cos(angle) * local_radius, CENTER + math.sin(angle) * local_radius, t))
    return points


def _node(x, y, r, opacity=0.85):
    return f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r:.2f}" fill="#f4efe2" fill-opacity="{opacity}" filter="url(#softGlow)"/>'


def _edge(a, b, opacity):
    return f'<line x1="{a[0]:.2f}" y1="{a[1]:.2f}" x2="{b[0]:.2f}" y2="{b[1]:.2f}" stroke="#7cc7b2" stroke-opacity="{opacity}" stroke-width="1.1"/>'


def _point(parameters, seed, stroke_opacity):
    radius = float(parameters.get("radius", 120))
    return [
        f'<circle cx="{CENTER}" cy="{CENTER}" r="{radius * 0.34:.2f}" fill="#f4efe2" fill-opacity="{0.22 + seed.get("E", 0.5) * 0.28}" filter="url(#softGlow)"/>',
        f'<circle cx="{CENTER}" cy="{CENTER}" r="{radius * 0.62:.2f}" fill="none" stroke="#7cc7b2" stroke-opacity="{stroke_opacity}" stroke-width="1.4"/>',
    ]


def _line(parameters, seed, stroke_opacity):
    points = _points(parameters, seed)[:: max(1, int(parameters.get("cell_count", 40) / 9))]
    elements = []
    for left, right in zip(points, points[1:]):
        elements.append(_edge(left, right, stroke_opacity * 0.9))
    elements.extend(_node(x, y, 5 + t * 4) for x, y, t in points)
    return elements


def _triangle(parameters, seed, stroke_opacity):
    radius = float(parameters.get("radius", 190))
    anchors = [
        (CENTER + math.cos(-math.pi / 2 + i * 2 * math.pi / 3) * radius, CENTER + math.sin(-math.pi / 2 + i * 2 * math.pi / 3) * radius, 1)
        for i in range(3)
    ]
    elements = [_edge(anchors[i], anchors[(i + 1) % 3], stroke_opacity) for i in range(3)]
    elements.extend(_edge((CENTER, CENTER, 1), anchor, stroke_opacity * 0.45) for anchor in anchors)
    elements.extend(_node(x, y, 12) for x, y, _ in anchors)
    elements.append(_node(CENTER, CENTER, 8, 0.75))
    return elements


def _network(parameters, seed, stroke_opacity):
    points = _points(parameters, seed)
    step = max(2, int(len(points) / 16))
    selected = points[::step]
    elements = []
    for index, point in enumerate(selected):
        for offset in (1, 3):
            if index + offset < len(selected):
                elements.append(_edge(point, selected[index + offset], stroke_opacity * 0.42))
    elements.extend(_node(x, y, 3.5 + t * 3, 0.72) for x, y, t in selected)
    return elements


def _spiral(parameters, seed, stroke_opacity):
    points = _points(parameters, seed)
    path = " ".join(
        f"{'M' if index == 0 else 'L'} {x:.2f} {y:.2f}"
        for index, (x, y, _t) in enumerate(points)
    )
    elements = [f'<path d="{path}" fill="none" stroke="#f4efe2" stroke-opacity="{stroke_opacity}" stroke-width="1.6" filter="url(#softGlow)"/>']
    elements.extend(_node(x, y, 2.5 + t * 4, 0.62 + t * 0.3) for x, y, t in points[:: max(1, int(len(points) / 28))])
    return elements


def _torus(parameters, seed, stroke_opacity):
    rings = int(parameters.get("layers", 5))
    radius = float(parameters.get("radius", 190))
    elements = []
    for index in range(rings):
        r = radius * (0.32 + index / max(rings, 1) * 0.75)
        elements.append(f'<ellipse cx="{CENTER}" cy="{CENTER}" rx="{r:.2f}" ry="{r * (0.42 + seed.get("V", 0.5) * 0.32):.2f}" fill="none" stroke="#7cc7b2" stroke-opacity="{stroke_opacity * (0.45 + index / max(rings, 1) * 0.45)}" stroke-width="1.2"/>')
    elements.append(_node(CENTER, CENTER, 9, 0.72))
    return elements


def _fractal(parameters, seed, stroke_opacity):
    elements = []
    radius = float(parameters.get("radius", 190))
    branches = 7
    for index in range(branches):
        angle = index * 2 * math.pi / branches
        start = (CENTER, CENTER, 1)
        end = (CENTER + math.cos(angle) * radius, CENTER + math.sin(angle) * radius, 1)
        mid = (CENTER + math.cos(angle) * radius * 0.55, CENTER + math.sin(angle) * radius * 0.55, 1)
        elements.append(_edge(start, end, stroke_opacity * 0.58))
        elements.append(_node(mid[0], mid[1], 5, 0.75))
        for offset in (-0.38, 0.38):
            branch = (mid[0] + math.cos(angle + offset) * radius * 0.22, mid[1] + math.sin(angle + offset) * radius * 0.22, 1)
            elements.append(_edge(mid, branch, stroke_opacity * 0.36))
            elements.append(_node(branch[0], branch[1], 3.2, 0.62))
    elements.append(_node(CENTER, CENTER, 8, 0.82))
    return elements
