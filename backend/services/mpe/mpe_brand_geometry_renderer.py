from services.mpe.mpe_morphogenesis_renderer import render_morphogenesis_svg


def render_brand_geometry_svg(geometry: dict) -> str:
    morphogenesis = {
        "client": geometry.get("client") or geometry.get("label") or "Brand Geometry",
        "geometry_state": {
            "shape": geometry.get("shape", "Punto"),
            "stage": geometry.get("stage", "masterbrand"),
            "question": geometry.get("question", "Que forma expresa mejor esta capa de marca?"),
            "next_geometry": geometry.get("next_geometry", "Red"),
        },
        "morphogenesis_seed": geometry.get("morphogenesis_seed", {}),
        "visual_parameters": geometry.get("visual_parameters", {}),
    }
    return render_morphogenesis_svg(morphogenesis)


def render_brand_geometry_markdown(brand_geometry: dict) -> str:
    lines = [
        "# MPE BRAND GEOMETRY",
        "",
        f"Cliente: {brand_geometry.get('client', 'Cliente sin nombre')}",
        f"Motor: {brand_geometry.get('engine', 'MPE Brand Geometry')}",
        f"Version: {brand_geometry.get('version', '0.1')}",
        "",
        "## Lectura",
        "",
        brand_geometry.get("reading", "Geometria de marca pendiente de interpretar."),
        "",
        "## Geometrias generadas",
        "",
    ]

    for geometry in brand_geometry.get("geometries", []):
        interpretation = geometry.get("interpretation") or {}
        lines.extend(
            [
                f"### {geometry.get('label', geometry.get('id', 'Geometria'))}",
                "",
                f"- ID: {geometry.get('id', 'sin_id')}",
                f"- Forma: {geometry.get('shape', 'Pendiente')}",
                f"- Rol: {geometry.get('role', 'Pendiente')}",
                f"- Pregunta: {geometry.get('question', 'Pendiente')}",
                f"- SVG: {geometry.get('svg_path', 'Pendiente')}",
                "",
                interpretation.get("visual_meaning", "Pendiente de interpretacion."),
                "",
            ]
        )

    return "\n".join(lines).rstrip() + "\n"
