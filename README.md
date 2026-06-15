# Horripilantes Rimas

Micrositio estático de terror gótico — seis rimas que jamás deberías cantar.
Primer satélite reconstruido desde el WordPress antiguo. Hermano técnico del
futuro **Relatos Aciagos** (mismo esqueleto, otra piel).

🔗 Producción: **https://rimas.dumaker.com** (vía subdominio de `dumaker.com`)

---

## Stack

- **HTML + CSS + JS vanilla.** Sin frameworks, sin build step. Principio *poco humo*.
- **Fuentes autoalojadas** (woff2, subconjunto latino) → cero dependencias externas, Lighthouse alto.
- **YouTube con carga diferida** (*facade*): el reproductor no se inserta hasta el clic; los 6 embeds pesan **cero** hasta que el usuario quiere verlos.
- **GitHub Pages** con despliegue *push-to-deploy*.

## Estructura

```
dumaker-rimas/
├── index.html          # toda la página (one-page)
├── styles.css          # estilos + @font-face autoalojados
├── app.js              # facade de YouTube + reveal al scroll
├── favicon.svg
├── CNAME               # rimas.dumaker.com (dominio personalizado de Pages)
├── .nojekyll           # sirve los archivos tal cual (sin Jekyll)
├── assets/
│   ├── adorno.png
│   ├── f1b · f2 · f3 · f4 · f5-2 · f6 .jpg   # 6 ilustraciones (optimizadas)
│   ├── montaje.jpg     # tira para la tarjeta social (og:image)
│   └── fonts/          # 9 woff2 (Cinzel Decorative, Aguafina, Baskervville, Quattrocento Sans)
└── _originals/         # respaldo local de las imágenes sin optimizar (NO se sube)
```

> Las imágenes originales (2000 px, 1–1,8 MB) se redimensionaron a 1280 px y se
> recomprimieron (JPEG q82): de ~7,4 MB a ~0,6 MB en total. Los originales quedan
> en `_originals/` (ignorado por git) por si hicieran falta.

## Probar en local

Cualquier servidor estático sirve. Por ejemplo:

```bash
# Python
python -m http.server 8080
# luego abre http://localhost:8080
```

(Abrir el `index.html` con doble clic también funciona, pero un servidor local
reproduce mejor el comportamiento real.)

---

## Despliegue (ya configurado)

GitHub Pages está configurado para **publicar desde la rama `main`** (raíz).
Cada `git push` a `main` vuelve a publicar el sitio automáticamente — es
*push-to-deploy* mediante el flujo de Pages de GitHub (visible en la pestaña
**Actions** del repo como *pages-build-deployment*). No hay paso de compilación.

- URL de validación (activa ya): **https://drklanes.github.io/dumaker-rimas/**
- Dominio final: **https://rimas.dumaker.com** (cuando el DNS apunte; ver abajo)

> **Sobre el `CNAME`:** el archivo `CNAME` está listo en el repo local pero **aún
> no se ha subido a propósito**. En cuanto GitHub detecta un `CNAME`, fija el
> dominio personalizado y *redirige* la URL `github.io` hacia `rimas.dumaker.com`
> — que no resolvería hasta tener el DNS, rompiendo la URL de validación. Por eso
> el orden correcto es: **(1)** validar en `github.io`, **(2)** poner el DNS en
> cdmon, **(3)** activar el `CNAME` (quitar su línea de `.gitignore` y hacer
> `git add CNAME && git commit && git push`). Avísame y lo hago yo en un paso.

### 👉 Lo único que te toca a ti: el DNS en cdmon

Añade **un solo registro** en el panel de cdmon para el dominio `dumaker.com`:

| Tipo  | Nombre / Host | Valor / Destino        | TTL          |
|-------|---------------|------------------------|--------------|
| CNAME | `rimas`       | `drklanes.github.io.`  | 3600 (o auto)|

Notas:
- Es un **subdominio**, por eso es un `CNAME` (no `A`). El destino es el host de
  GitHub Pages de la cuenta, **no** el repositorio.
- Algunos paneles añaden solos el dominio: pon el nombre como `rimas` (si cdmon
  te obliga a escribir el FQDN, sería `rimas.dumaker.com`). El punto final del
  destino (`drklanes.github.io.`) es opcional según el panel.
- La propagación puede tardar de minutos a unas horas.

Cuando el DNS resuelva:
1. En **GitHub → repo → Settings → Pages**, el *Custom domain* ya estará puesto
   en `rimas.dumaker.com` (lo fija el archivo `CNAME`). Verás un check verde
   cuando valide el dominio.
2. Marca **Enforce HTTPS** (aparece disponible cuando GitHub emite el
   certificado, suele tardar unos minutos tras validar el DNS).

---

## Opcional — workflow de GitHub Actions explícito

El sitio ya despliega solo con cada push (flujo gestionado de Pages). Si además
quieres un **workflow de Actions versionado en el repo** (paridad exacta con el
stack de `dumaker.com` y base lista para heredar), hay que conceder el permiso
`workflow` al token de `gh` —el actual no lo tiene— ejecutando una vez:

```bash
gh auth refresh -h github.com -s workflow
```

Avísame después y subo `.github/workflows/deploy.yml` (sube los artefactos con
`actions/upload-pages-artifact` + `actions/deploy-pages`) y cambio el *source*
de Pages a *GitHub Actions*. No es necesario para que el sitio funcione.

---

## Reutilizar para el segundo micrositio (Relatos Aciagos)

El esqueleto es agnóstico de contenido. Para clonar la base:

- **Piel visual:** casi todo vive en los *tokens* de `:root` (colores, fuentes)
  y en las clases `.rima--dark` / `.rima--blood`. Cambiar paleta = cambiar tokens.
- **Patrón de bloque:** cada rima es una `<section class="rima ...">` con media
  (facade) + texto. Duplicar/editar.
- **Facade de YouTube y reveal:** `app.js` es genérico, no toca contenido.
- **Rendimiento:** mismo método de fuentes autoalojadas y optimización de
  imágenes.
