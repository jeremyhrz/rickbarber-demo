"""Favicon e imagen para compartir de Rickbarber, a partir del poste y de las fotos ya optimizadas.

Uso (desde la raíz, Python 3.12 + Playwright; después de scripts/optimizar_fotos.py):
    python scripts/generar_marca.py

Escribe en public/:
  favicon.svg            el poste de barbero sobre carbón, más grueso que el de la página para
                         que las franjas se lean a 16 px
  favicon-32.png         lo mismo en PNG, para navegadores sin favicon SVG
  apple-touch-icon.png   180×180, a sangre (el iPhone redondea las esquinas solo)
  og.jpg                 1200×630: la vista previa del enlace en WhatsApp, Instagram, etc.
Las letras del og salen de las fuentes reales (node_modules) y las fotos, de public/fotos.
Adaptado de la demo de Ellie Shop.
"""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent
PUBLICO = RAIZ / 'public'
FOTOS = json.loads((RAIZ / 'src' / 'data' / 'fotos.json').read_text(encoding='utf-8'))
MODULOS = RAIZ / 'node_modules'

CARBON, GRAFITO, HUESO, NIEBLA = '#0E0E0F', '#18181A', '#F2EDE4', '#8C8880'
LATON, LATON_CLARO = '#C9A15B', '#E3C88E'
ROJO, AZUL = '#B3262D', '#1E3A8A'


def franjas(x, y, ancho, alto, banda, subida):
    """Polígonos de las franjas diagonales (rojo, hueso, azul, hueso) que cubren el tubo."""
    colores = [ROJO, HUESO, AZUL, HUESO]
    poligonos, k, yy = [], 0, y - 4 * banda - subida
    while yy < y + alto + 4 * banda:
        x1 = x + ancho
        puntos = f'{x},{yy + subida:.2f} {x1},{yy:.2f} {x1},{yy + banda + 0.35:.2f} {x},{yy + subida + banda + 0.35:.2f}'
        poligonos.append(f'<polygon points="{puntos}" fill="{colores[k % 4]}"/>')
        yy += banda
        k += 1
    return ''.join(poligonos)


def degradados(prefijo):
    return (f'<linearGradient id="{prefijo}l" x1="0" x2="1"><stop offset="0" stop-color="#6B4E20"/>'
            f'<stop offset=".3" stop-color="{LATON_CLARO}"/><stop offset=".55" stop-color="{LATON}"/>'
            f'<stop offset="1" stop-color="#5E4419"/></linearGradient>'
            f'<linearGradient id="{prefijo}v" x1="0" x2="1"><stop offset="0" stop-opacity=".5"/>'
            f'<stop offset=".2" stop-color="#fff" stop-opacity=".3"/><stop offset=".34" stop-color="#fff" stop-opacity=".06"/>'
            f'<stop offset=".7" stop-opacity=".08"/><stop offset="1" stop-opacity=".55"/></linearGradient>'
            f'<radialGradient id="{prefijo}b" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="#F4E3BC"/>'
            f'<stop offset=".45" stop-color="{LATON}"/><stop offset="1" stop-color="#5E4419"/></radialGradient>')


def poste_pagina(prefijo='o'):
    """El mismo poste que src/components/Poste.jsx (viewBox 0 0 24 72), estático."""
    x, y, ancho, alto = 5.5, 12.5, 13, 46
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 72"><defs>{degradados(prefijo)}'
            f'<clipPath id="{prefijo}t"><rect x="{x}" y="{y}" width="{ancho}" height="{alto}" rx=".6"/></clipPath></defs>'
            f'<circle cx="12" cy="4.2" r="3" fill="url(#{prefijo}b)"/><rect x="10.6" y="6.6" width="2.8" height="1.2" fill="#6B4E20"/>'
            f'<rect x="3.5" y="7.4" width="17" height="5.1" rx="2.2" fill="url(#{prefijo}l)"/>'
            f'<rect x="3.5" y="58.5" width="17" height="5.1" rx="2.2" fill="url(#{prefijo}l)"/>'
            f'<path d="M8.6 63.6h6.8l-1.5 4.6a2 2 0 0 1-3.8 0Z" fill="url(#{prefijo}l)"/>'
            f'<g clip-path="url(#{prefijo}t)"><rect x="{x}" y="{y}" width="{ancho}" height="{alto}" fill="{HUESO}"/>'
            f'<g transform="translate(0 -6)">{franjas(x, y, ancho, alto, 4, 9)}</g>'
            f'<rect x="{x}" y="{y}" width="{ancho}" height="{alto}" fill="url(#{prefijo}v)"/>'
            f'<rect x="{x + 2.4}" y="{y + 1.5}" width="1.1" height="{alto - 3}" rx=".55" fill="#fff" opacity=".32"/></g></svg>')


def favicon_svg(redondeado=True):
    """Poste grueso centrado en un cuadrado carbón de 64: tapas de latón y tres vueltas de franjas."""
    x, y, ancho, alto = 21, 14, 22, 36
    radio = ' rx="14"' if redondeado else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs>{degradados("f")}'
            f'<clipPath id="ft"><rect x="{x}" y="{y}" width="{ancho}" height="{alto}" rx="1"/></clipPath></defs>'
            f'<rect width="64" height="64"{radio} fill="{CARBON}"/>'
            f'<rect x="17" y="7.5" width="30" height="7" rx="3" fill="url(#fl)"/>'
            f'<rect x="17" y="49.5" width="30" height="7" rx="3" fill="url(#fl)"/>'
            f'<g clip-path="url(#ft)"><rect x="{x}" y="{y}" width="{ancho}" height="{alto}" fill="{HUESO}"/>'
            f'{franjas(x, y, ancho, alto, 6, 13)}'
            f'<rect x="{x}" y="{y}" width="{ancho}" height="{alto}" fill="url(#fv)"/></g></svg>')


def foto(id_, ancho=540):
    datos = FOTOS[id_]
    elegido = next((a for a in datos['anchos'] if a >= ancho), datos['anchos'][-1])
    return (PUBLICO / f'{datos["base"].lstrip("/")}-{elegido}.webp').as_uri()


GRANO = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E"
         "%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E"
         "%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 3 0 0 0 -1.25'/%3E%3C/filter%3E"
         "%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E")


def og_html():
    fuente = lambda archivo: (MODULOS / archivo).as_uri()
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: Anton; src: url('{fuente('@fontsource/anton/files/anton-latin-400-normal.woff2')}'); }}
@font-face {{ font-family: Manrope; src: url('{fuente('@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')}'); font-weight: 200 800; }}
* {{ margin: 0; box-sizing: border-box; }}
body {{ width: 1200px; height: 630px; overflow: hidden; background: {CARBON}; color: {HUESO}; position: relative;
  font-family: Manrope; -webkit-font-smoothing: antialiased; }}
.halo {{ position: absolute; right: -160px; top: -120px; width: 900px; height: 900px; border-radius: 50%;
  background: radial-gradient(closest-side, rgba(201,161,91,0.16), rgba(201,161,91,0.05) 55%, rgba(14,14,15,0) 100%); }}
.marco {{ position: absolute; inset: 28px; border: 1px solid rgba(201,161,91,0.28); }}
.texto {{ position: absolute; left: 76px; top: 128px; width: 560px; }}
.marca {{ display: flex; align-items: center; gap: 18px; }}
.marca svg {{ height: 116px; width: auto; display: block; }}
.palabra {{ font-family: Anton; font-size: 98px; line-height: 0.9; letter-spacing: 0.02em; }}
.palabra b {{ font-weight: 400; color: {LATON}; }}
.lema {{ font-family: Anton; font-size: 58px; line-height: 0.95; text-transform: uppercase; margin-top: 44px; letter-spacing: 0.01em; }}
.lema span {{ color: {LATON}; }}
.linea {{ width: 72px; height: 2px; background: {LATON}; margin: 28px 0 22px; }}
.datos {{ font-size: 21px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: {HUESO}; }}
.cuenta {{ margin-top: 12px; font-size: 19px; font-weight: 600; letter-spacing: 0.06em; color: {NIEBLA}; }}
.carta {{ position: absolute; width: 222px; height: 278px; overflow: hidden; border-radius: 6px;
  outline: 1px solid rgba(227,200,142,0.45); outline-offset: 5px;
  box-shadow: 0 34px 60px -24px rgba(0,0,0,0.9), 0 12px 24px -12px rgba(0,0,0,0.6); }}
.carta img {{ width: 100%; height: 100%; object-fit: cover; display: block; }}
.carta::after {{ content: ''; position: absolute; inset: 0;
  background: radial-gradient(120% 90% at 50% 40%, rgba(14,14,15,0) 55%, rgba(14,14,15,0.5) 100%); }}
.c1 {{ left: 662px; top: 196px; transform: rotate(-10deg); }}
.c2 {{ left: 918px; top: 178px; transform: rotate(9deg); }}
.c3 {{ left: 782px; top: 128px; width: 254px; height: 318px; transform: rotate(-1.5deg); z-index: 2; }}
.grano {{ position: absolute; inset: 0; background-image: url("{GRANO}"); background-size: 180px; opacity: 0.06; z-index: 5; }}
</style></head><body>
<div class="halo"></div>
<div class="marco"></div>
<div class="texto">
  <div class="marca">{poste_pagina('og')}<span class="palabra">RICK<b>BARBER</b></span></div>
  <p class="lema">Barbería de <span>élite</span></p>
  <div class="linea"></div>
  <p class="datos">C.C. Cristal, Naguanagua</p>
  <p class="cuenta">@rickbarberv · Agenda tu cita por WhatsApp</p>
</div>
<div class="carta c1"><img src="{foto('rubio-textura')}"></div>
<div class="carta c2"><img src="{foto('largo-textura')}"></div>
<div class="carta c3"><img src="{foto('fade-verde')}"></div>
<div class="grano"></div>
</body></html>"""


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    PUBLICO.mkdir(exist_ok=True)
    (PUBLICO / 'favicon.svg').write_text(favicon_svg() + '\n', encoding='utf-8')
    with sync_playwright() as p:
        navegador = p.chromium.launch(channel='chrome')
        for nombre, lado, redondeado in (('favicon-32.png', 32, True), ('apple-touch-icon.png', 180, False)):
            svg = favicon_svg(redondeado)
            pagina = navegador.new_page(viewport={'width': lado, 'height': lado})
            pagina.set_content(f'<body style="margin:0">{svg.replace("<svg ", f"<svg width={lado} height={lado} ")}</body>')
            pagina.screenshot(path=str(PUBLICO / nombre), omit_background=True)
            pagina.close()
        # Desde un archivo (no set_content): Chrome solo deja cargar fotos y fuentes locales a file://.
        borrador = RAIZ / '.capturas' / 'marca' / 'og.html'
        borrador.parent.mkdir(parents=True, exist_ok=True)
        borrador.write_text(og_html(), encoding='utf-8')
        pagina = navegador.new_page(viewport={'width': 1200, 'height': 630})
        pagina.goto(borrador.as_uri(), wait_until='networkidle')
        pagina.evaluate('document.fonts.ready.then(() => true)')
        pagina.wait_for_timeout(300)
        pagina.screenshot(path=str(PUBLICO / 'og.jpg'), type='jpeg', quality=88)
        navegador.close()
    for nombre in ('favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'og.jpg'):
        print(f'  public/{nombre}  {(PUBLICO / nombre).stat().st_size / 1024:.1f} KB')


if __name__ == '__main__':
    main()
