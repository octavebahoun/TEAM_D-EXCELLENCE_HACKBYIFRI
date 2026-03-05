import asyncio
import os
from datetime import datetime
from typing import Any, Dict, List

from jinja2 import Environment, select_autoescape

from app.core.config import settings
from app.services.roadmap_service import fetch_roadmap_detail

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Roadmap AcademiX</title>
  <style>
    body { font-family: 'Inter', 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f6f7fb; color: #111; }
    .container { max-width: 960px; margin: 2rem auto; background: #fff; padding: 2rem; border-radius: 16px; }
    h1 { font-size: 2.1rem; margin-bottom: 0.25rem; }
    h2 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #0f172a; }
    .meta { display: flex; justify-content: space-between; font-size: 0.85rem; color: #4b5563; }
    .section { border-top: 1px solid #e5e7eb; padding: 1.25rem 0; }
    .section:first-child { border-top: none; }
    .resource { border: 1px solid #e5e7eb; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 0.65rem; background: #f9fafb; display: flex; gap: 0.75rem; align-items: flex-start; }
    .resource .info { flex: 1; }
    .resource a { color: #2563eb; font-weight: 600; text-decoration: none; }
    .badge { display: inline-flex; align-items: center; padding: 0.15rem 0.6rem; border-radius: 999px; font-size: 0.75rem; background: #e0f2fe; color: #0369a1; margin-right: 0.5rem; }
    .footer { margin-top: 2rem; border-top: 1px solid #e5e7eb; padding-top: 1rem; font-size: 0.85rem; color: #6b7280; }
    .progress { display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.9rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="meta">
      <div>
        <strong>Roadmap générée pour :</strong> {{ roadmap.student_id }}
      </div>
      <div>{{ timestamp }}</div>
    </div>
    <h1>{{ roadmap.mode }}{% if roadmap.matiere %} · {{ roadmap.matiere }}{% endif %}</h1>
    {% if roadmap.notion %}<p style="margin-bottom: 1rem;">Notion ciblée : {{ roadmap.notion }}</p>{% endif %}
    {% if sections %}
      {% for section in sections %}
        <div class="section">
          <div class="progress">
            <span class="badge">{{ section.period_label or 'Période ' ~ loop.index }}</span>
            {% set level_label = section.metadata.get('level') if section.metadata else None %}
            <span class="badge" style="background:#dcfce7;color:#15803d;">{{ level_label or 'Niveau conseillé' }}</span>
          </div>
          <h2>{{ loop.index }}. {{ section.title }}</h2>
          {% if section.description %}<p>{{ section.description }}</p>{% endif %}
          {% for resource in section.resources %}
            <div class="resource">
              <div class="info">
                <a href="{{ resource.url }}">{{ resource.title or resource.resource_type }}</a>
                {% if resource.summary %}<p style="margin: 0.25rem 0 0.15rem;">{{ resource.summary }}</p>{% endif %}
                <div style="font-size:0.75rem;color:#475569;">
                  {% if resource.duration_seconds %}Durée : {{ resource.duration_seconds // 60 }} min{% endif %}
                  {% if resource.score %} · Score IA : {{ resource.score }}{% endif %}
                  {% if resource.level %} · Niveau : {{ resource.level }}{% endif %}
                </div>
              </div>
            </div>
          {% endfor %}
        </div>
      {% endfor %}
    {% else %}
      <p>Aucune section n'est encore disponible pour cette roadmap.</p>
    {% endif %}
    <div class="footer">
      Généré par AcademiX · API v{{ version }} · {{ timestamp }}
    </div>
  </div>
</body>
</html>
"""


def _build_html(roadmap: Dict[str, Any], sections: List[Dict[str, Any]]) -> str:
    env = Environment(autoescape=select_autoescape(enabled_extensions=("html", "xml")))
    template = env.from_string(HTML_TEMPLATE)
    return template.render(
        roadmap=roadmap,
        sections=sections,
        version=settings.VERSION,
        timestamp=datetime.utcnow().strftime("%d %B %Y %H:%M UTC"),
    )


def _render_pdf(html: str) -> bytes:
    # Import lazy pour éviter de faire planter l'API au démarrage si les libs système
    # de WeasyPrint (glib/pango/cairo/...) ne sont pas présentes sur l'hôte.
    from weasyprint import HTML  # type: ignore

    return HTML(string=html).write_pdf()


async def generate_roadmap_pdf(roadmap_uuid: str) -> bytes:
    payload = await fetch_roadmap_detail(roadmap_uuid)
    if not payload:
        raise ValueError(f"Roadmap {roadmap_uuid} introuvable pour le PDF")

    html = _build_html(payload["roadmap"], payload.get("sections", []))
    pdf_bytes = await asyncio.to_thread(_render_pdf, html)

    filename = f"roadmap_{roadmap_uuid}.pdf"
    target_path = os.path.join(settings.ROADMAP_PDF_DIR, filename)
    with open(target_path, "wb") as f:
        f.write(pdf_bytes)

    return pdf_bytes
