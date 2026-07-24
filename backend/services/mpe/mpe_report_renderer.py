def render_mpe_entity_scan_markdown(scan: dict) -> str:
    recommended = scan.get("recommended_path") or {}
    geometry = scan.get("geometry") or {}
    seed = scan.get("morphogenesis_seed") or {}
    noise_sources = scan.get("noise_sources") or []

    lines = [
        "# MPE ENTITY SCAN",
        "",
        f"Cliente: {scan.get('client', 'Cliente sin nombre')}",
        f"Estado evolutivo: {scan.get('evolution_stage', 'pendiente')}",
        f"Score de posibilidad: {scan.get('possibility_score', 0)}",
        "",
        "## Contradiccion principal",
        "",
        scan.get("main_contradiction", "Pendiente de lectura."),
        "",
        "## Posibilidad latente",
        "",
        scan.get("latent_possibility", "Pendiente de lectura."),
        "",
        "## Restriccion fertil",
        "",
        scan.get("fertile_constraint", "Pendiente de definir."),
        "",
        "## Fuentes de ruido",
        "",
    ]

    lines.extend([f"- {item}" for item in noise_sources] or ["- Sin ruido critico detectado."])
    lines.extend(
        [
            "",
            "## Proximo movimiento evolutivo",
            "",
            f"- Movimiento: {recommended.get('label', 'Definir proximo movimiento')}",
            f"- Razon: {recommended.get('reason', 'Aumentar posibilidad viable con menor ruido.')}",
            f"- Accion interna: {recommended.get('action_key', 'review_evolution_path')}",
            "",
            "## Geometria actual",
            "",
            f"- Forma: {geometry.get('shape', 'Pendiente')}",
            f"- Etapa: {geometry.get('stage', 'Pendiente')}",
            f"- Pregunta: {geometry.get('question', 'Pendiente')}",
            f"- Proxima geometria: {geometry.get('next_geometry', 'Pendiente')}",
            "",
            "## Semilla morfogenetica",
            "",
        ]
    )
    lines.extend([f"- {axis}: {seed.get(axis, 0)}" for axis in ["D", "R", "V", "F", "M", "N", "E"]])

    return "\n".join(lines).rstrip() + "\n"

