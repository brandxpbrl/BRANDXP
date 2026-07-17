import os
import json
from pathlib import Path

base_dir = Path(r"c:\Users\Bela Tours\brandexperience\viptour-buzios")
clientes_dir = base_dir / "public" / "brandexperience" / "portfolio" / "clientes"
output_file = base_dir / "config" / "portfolio-mapping.json"

# Setup the clients data with their true Sacred Geometries
client_configs = {
    "sofia-luz": {
        "name": "Sofía Luz - Psicotherapia & Luz",
        "category": "Psicología & Neurociencia",
        "geometry": "Toroide (Torus)",
        "geometry_desc": "Representa el flujo continuo del campo electromagnético del corazón, integrando neurociencia y espiritualidad en un bucle evolutivo infinito.",
        "colors": ["#8b5cf6", "#1e1b4b", "#faf5ff"],
        "description": "Universo visual diseñado en conjunto con sensores QUBIT, sintetizando astrología, neurociencia y psicología holística en un lenguaje cromático de alta vibración.",
        "folder_suf": "02_identity_board"
    },
    "consciencia-expansion": {
        "name": "Consciencia en Expansión",
        "category": "Desarrollo Espiritual",
        "geometry": "Espiral Áurea (Spiral)",
        "geometry_desc": "La proporción del crecimiento áureo de Fibonacci. Simboliza la evolución continua del ser y el despertar de conciencia.",
        "colors": ["#6366f1", "#0f172a", "#f5f3ff"],
        "description": "Identidad visual expansiva para la comunidad de Belén Cocconi, estructurando un sistema de aprendizaje álmico y reprogramación mental.",
        "folder_suf": "05_visual_system"
    },
    "miranda-experience": {
        "name": "Miranda Experience",
        "category": "Turismo Premium",
        "geometry": "Línea Vectorial (Line)",
        "geometry_desc": "Dirección, intención enfocada y simetría. Refleja exclusividad, viajes concierge uno a uno y curaduría premium.",
        "colors": ["#c084fc", "#1e1b4b", "#faf5ff"],
        "description": "Turismo receptivo boutique en Río de Janeiro. Experiencias diseñadas para clientes de alta gama con enfoque estético cinematográfico.",
        "folder_suf": "05_visual_system"
    },
    "zapt-delivery": {
        "name": "Zapt Delivery",
        "category": "Logística & Servicios",
        "geometry": "Red Reticular (Net)",
        "geometry_desc": "Interconexión molecular de nodos y flujo de datos óptimo. Estructura de máxima conectividad y velocidad de entrega.",
        "colors": ["#10b981", "#064e3b", "#ecfdf5"],
        "description": "Campaña visual y dirección de marca para servicios de entregas y logística express ultra-conectada.",
        "folder_suf": "08_campaigns"
    },
    "mau-viagens": {
        "name": "Mau Viagens Tours",
        "category": "Agencia de Viajes",
        "geometry": "Vector Equilibrium",
        "geometry_desc": "La geometría del balance total en el vacío cuántico. Equilibrio absoluto de fuerzas de expansión y atracción.",
        "colors": ["#f43f5e", "#4c0519", "#fff1f2"],
        "description": "Operadora de viajes de conexión entre Argentina y Brasil, revelando el alma de los destinos de playa tradicionales.",
        "folder_suf": "05_visual_system"
    },
    "viptour": {
        "name": "VIPTOUR BÚZIOS",
        "category": "Alquiler & Aventura",
        "geometry": "Cubo (Cube)",
        "geometry_desc": "Estructura cúbica tridimensional de máxima estabilidad y anclaje físico. Representa el soporte, la seguridad y la libertad de explorar.",
        "colors": ["#0ea5e9", "#082f49", "#f0f9ff"],
        "description": "Landing premium construida con el motor BELE para el alquiler de buggies y paseos guiados por playas y miradores.",
        "folder_suf": "05_visual_system"
    },
    "duality-tokyo": {
        "name": "Duality Tokyo",
        "category": "Concept Store",
        "geometry": "Círculos Concéntricos",
        "geometry_desc": "Ondas de resonancia armónica expandiéndose desde un centro unificado de identidad. Representa la dualidad estética y orden.",
        "colors": ["#f59e0b", "#451a03", "#fffbeb"],
        "description": "Universo de marca vanguardista que fusiona el minimalismo japonés y la sintonía urbana.",
        "folder_suf": "05_visual_system"
    }
}

portfolio_items = []

for folder_name, config in client_configs.items():
    client_path = clientes_dir / folder_name
    if not client_path.exists():
        continue
    
    # Find all images in the specified subfolder
    subfolder = client_path / config["folder_suf"]
    images = []
    if subfolder.exists():
        for f in sorted(os.listdir(subfolder)):
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                # Relative path from public directory for Next.js image loading
                rel_path = f"/brandexperience/portfolio/clientes/{folder_name}/{config['folder_suf']}/{f}"
                images.append(rel_path)
    
    if images:
        portfolio_items.append({
            "id": folder_name,
            "name": config["name"],
            "category": config["category"],
            "geometry": config["geometry"],
            "geometry_desc": config["geometry_desc"],
            "colors": config["colors"],
            "description": config["description"],
            "images": images[:6] # Grab up to 6 images to avoid heavy load
        })

# Ensure the config folder exists
output_file.parent.mkdir(parents=True, exist_ok=True)

# Write to file
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(portfolio_items, f, indent=2, ensure_ascii=False)

print(f"Generated portfolio-mapping.json with {len(portfolio_items)} clients.")
