def map_entity_geometry(scan: dict) -> dict:
    seed = scan.get("morphogenesis_seed") or {}
    score = float(scan.get("possibility_score", 0) or 0)
    clarity = float(scan.get("snapshot_scores", {}).get("clarity", 0) or 0)
    clarity = clarity / 100 if clarity > 1 else clarity
    noise = float(seed.get("N", 0) or 0)
    coherence = (float(seed.get("R", 0) or 0) + float(seed.get("V", 0) or 0) + float(seed.get("M", 0) or 0)) / 3
    opportunity = float(seed.get("F", 0) or 0)
    complexity = (float(seed.get("D", 0) or 0) + opportunity + float(seed.get("E", 0) or 0)) / 3

    if clarity < 0.45 and noise >= 0.45:
        shape, stage, reason, next_geometry = "Punto", "apertura", "Baja claridad con ruido alto exige volver a una diferencia minima observable.", "Linea"
    elif clarity < 0.62:
        shape, stage, reason, next_geometry = "Linea", "direccion", "La entidad necesita direccion antes de expandir opciones.", "Triangulo"
    elif noise >= 0.38 and opportunity >= 0.45:
        shape, stage, reason, next_geometry = "Triangulo", "restriccion_fertil", "Hay contradiccion activa y oportunidad suficiente para crear un limite fertil.", "Red"
    elif coherence >= 0.62 and score < 0.72:
        shape, stage, reason, next_geometry = "Red", "coherencia_creciente", "Los sistemas empiezan a conectarse y necesitan relaciones mas claras.", "Espiral"
    elif opportunity >= 0.70 and score >= 0.62:
        shape, stage, reason, next_geometry = "Espiral", "expansion_viable", "La posibilidad evolutiva puede transformarse en avance progresivo.", "Toroide"
    elif score >= 0.78 and coherence >= 0.72:
        shape, stage, reason, next_geometry = "Toroide", "sistema_maduro", "La entidad puede observarse, iterar y expandirse sin perder centro.", "Fractal"
    elif complexity >= 0.78 and coherence >= 0.68:
        shape, stage, reason, next_geometry = "Fractal", "complejidad_coherente", "La marca sostiene capas multiples sin perder consistencia.", "Toroide"
    else:
        shape, stage, reason, next_geometry = "Triangulo", "restriccion_fertil", "La lectura pide una restriccion clara para convertir potencial en movimiento.", "Red"

    return {
        "shape": shape,
        "stage": stage,
        "reason": reason,
        "question": _question_for_shape(shape),
        "next_geometry": next_geometry,
    }


def _question_for_shape(shape):
    questions = {
        "Punto": "Que diferencia minima debe quedar clara antes de avanzar?",
        "Linea": "Que direccion unica ordena la proxima decision?",
        "Triangulo": "Que limite crea estabilidad sin cerrar la exploracion?",
        "Red": "Que relaciones deben conectarse para que el sistema opere mejor?",
        "Espiral": "Que ciclo puede expandirse sin aumentar ruido?",
        "Toroide": "Como se observa y regula la entidad mientras evoluciona?",
        "Fractal": "Que patron puede repetirse en multiples escalas sin perder coherencia?",
    }
    return questions.get(shape, "Que forma organiza mejor la evolucion actual?")

