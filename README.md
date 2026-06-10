# Icon3D

**Real 3D icons for the web, in one tiny script.** Icon3D registers an `<icon-3d>` custom HTML element that renders genuine WebGL 3D models — spinnable, draggable, tintable — with no Three.js, no build step, and no dependencies. The core engine is around 7KB gzipped.

📚 **Full documentation, live playground, and icon library:** [icon3d.dev](https://icon3d.dev)

---

## Installation

You need two things: the **core engine** (the renderer and the custom element) and at least one **icon pack** (the actual 3D models). The core contains no icons, so you only ship the categories you use.

```html
<!-- core engine (required) -->
<script src="https://cdn.jsdelivr.net/gh/maordany/icon3d@main/icon3d.min.js"></script>

<!-- free UI pack -->
<script src="https://cdn.jsdelivr.net/gh/maordany/icon3d@main/icon3d-ui.js"></script>
```

> **Note:** Replace the CDN URLs above with your final versioned links once the release is published. Until then, you can also just download `icon3d.min.js` and `icon3d-ui.js` from this repo and host them yourself.

The pack file self-registers its icons into the global `Icon3D.models` registry — no manual import. Once loaded, every icon in the pack is available by name.

---

## Quick start

Use `<icon-3d>` anywhere in your HTML, just like an `<img>`. Changing attributes updates the rendering in real time — no JavaScript required for basic usage.

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/maordany/icon3d@main/icon3d.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/maordany/icon3d@main/icon3d-ui.js"></script>
</head>
<body>
  <icon-3d name="icon3d-ui-home"></icon-3d>
  <icon-3d name="icon3d-ui-cart" size="128" spin="y" color="#ff5500"></icon-3d>
  <icon-3d src="/models/chair.obj" alt="Office chair"></icon-3d>
</body>
</html>
```

Icon names follow the pattern `icon3d-<pack>-<icon>` — so `icon3d-ui-home` is the "home" icon in the "ui" pack.

---

## Identity

Every icon needs exactly one of these:

| Attribute | Description |
|-----------|-------------|
| `name` | Renders a model registered in a loaded pack. Most efficient — the model data is embedded in the pack file, no extra request. |
| `src` | Loads a custom `.obj` file from a URL. Cached by URL across the page. Must be served over http/https (not `file://`). |
| `alt` | Accessible label, mirrored to `aria-label`. Always set it in production. |

---

## Sizing & color

```html
<icon-3d name="icon3d-ui-home" size="lg"></icon-3d>
<icon-3d name="icon3d-ui-home" size="200"></icon-3d>
<icon-3d name="icon3d-ui-home" color="#7c3aed"></icon-3d>
```

`size` accepts a number (pixels) or a preset: `xs` 32, `sm` 48, `md` 64 (default), `lg` 96, `xl` 128, `2xl` 192, `4x` 256, `5x` 320. `color` takes a 3 or 6 digit hex and tints the whole model.

---

## Animation

Boolean attributes that compose freely — stack as many as you like.

| Attribute | Value | Description |
|-----------|-------|-------------|
| `spin` | `x` `y` `z` `xy` `xz` `yz` `xyz` | Continuous rotation on the given axes. |
| `speed` | number | Speed multiplier for spin. Default `1`. |
| `pulse` | boolean | Breathing scale animation. |
| `bounce` | boolean | Vertical bounce. |
| `wobble` | boolean | Side-to-side sway. |
| `tada` | boolean | Periodic celebration shake. |
| `entrance` | boolean | Scale-in animation on load. |
| `entrance-duration` | 0.1–3.0 | Entrance length in seconds. Default `0.6`. |

```html
<icon-3d name="icon3d-ui-cart" pulse bounce></icon-3d>
<icon-3d name="icon3d-ui-bell" entrance spin="y"></icon-3d>
```

---

## Interaction

| Attribute | Description |
|-----------|-------------|
| `look-at="cursor"` | Model tracks the mouse cursor. |
| `drag` | Click/touch to rotate manually. Fires `icon3d-drag-start` / `icon3d-drag-end`. |
| `hover-spin` | Spins only while hovered. Accepts axes, e.g. `hover-spin="xy"`. |

```html
<icon-3d name="icon3d-ui-home" drag></icon-3d>
<icon-3d name="icon3d-ui-home" hover-spin speed="2"></icon-3d>
```

---

## Reactive modifiers

CSS-pseudo-class-like states for 3D properties, using a prefix: `hover-`, `click-`, `active-`. They compose freely.

```html
<icon-3d name="icon3d-ui-home" hover-color="#ff5500" hover-scale="1.2"></icon-3d>

<icon-3d name="icon3d-ui-cart"
  click-color="#00ff88"
  click-scale="1.3"
  click-spin="y"
  click-speed="8"></icon-3d>

<icon-3d name="icon3d-ui-home"
  active-color="#ff3399"
  active-scale="0.9"></icon-3d>
```

Each prefix supports `-color`, `-scale`, `-speed`, and `-spin`. Priority for color: `click` > `active` > `hover`. Scales and speeds multiply.

---

## Rendering

```html
<icon-3d name="icon3d-ui-home" shading="smooth"></icon-3d>
<icon-3d name="icon3d-ui-home" shading="toon" outline></icon-3d>
```

`shading` modes: `flat` (default, faceted), `smooth` (soft), `toon` (cel-shaded), `wireframe` (edges only). `outline` adds a colored shell (`outline="#ffffff"`, `outline-thickness="0.04"`).

---

## Shadow & gradient

```html
<icon-3d name="icon3d-ui-home" shadow shadow-opacity="0.6"></icon-3d>
<icon-3d name="icon3d-ui-home" gradient="#ff5500 #ffaa00"></icon-3d>
<icon-3d name="icon3d-ui-home" gradient="#3399ff #ff00cc" gradient-direction="radial"></icon-3d>
```

`shadow` renders a soft elliptical shadow (`shadow-opacity` 0–1, default `0.35`). `gradient` takes two hex colors; `gradient-direction` is `vertical` (default), `horizontal`, `diagonal`, or `radial`. If both `color` and `gradient` are set, `color` wins.

---

## Lighting & camera

| Attribute | Description |
|-----------|-------------|
| `ambient` | Brightness floor, 0–1. Default `0.4`. Lower = dramatic, higher = flat. |
| `light-dir` | Light direction `"x y z"`. Default `"0.35 0.6 0.7"`. |
| `angle` | Initial rotation. Preset (`front`, `side`, `top`, `iso`, `iso-r`) or `"rx ry rz"` in radians. |
| `fov` | Camera field of view in degrees. Default `22`. Lower = product-render look. |

```html
<icon-3d name="icon3d-ui-home" ambient="0.2"></icon-3d>
<icon-3d name="icon3d-ui-home" angle="iso" fov="15"></icon-3d>
```

---

## Timing & lazy loading

| Attribute | Description |
|-----------|-------------|
| `loading="lazy"` | Defers building until the icon nears the viewport. Use below the fold. |
| `pause` | Renders once, then stops the loop. Saves CPU for static icons. |
| `in-view-entrance` | Delays the `entrance` animation until the icon scrolls into view. |
| `autoplay` | Re-triggers one-shot animations every N ms, e.g. `autoplay="2500"`. |

```html
<icon-3d name="icon3d-ui-home" loading="lazy"></icon-3d>
<icon-3d name="icon3d-ui-cart" tada autoplay="2500"></icon-3d>
```

---

## Custom events

Standard DOM `CustomEvent`s. Details are on `event.detail`. In React, names map to camelCase props (`icon3d-click` → `onIcon3dClick`).

| Event | When | `event.detail` |
|-------|------|----------------|
| `icon3d-ready` | First render | `{ name }` |
| `icon3d-error` | Load failed | `{ reason, name?, url?, error? }` |
| `icon3d-click` | Press + release (no drag) | `{ name, originalEvent }` |
| `icon3d-drag-start` / `icon3d-drag-end` | Drag begins / ends | `{ name }` |
| `icon3d-animation-end` | One-shot animation finished | `{ animation }` |
| `icon3d-destroyed` | Removed from DOM | `{ name }` |

```js
const icon = document.querySelector('icon-3d');

icon.addEventListener('icon3d-click', (e) => {
  console.log('Clicked:', e.detail.name);
});
```

Error reasons: `missing-name-or-src`, `model-not-found`, `src-load-failed`, `webgl-not-supported`.

---

## Reactive setAttribute

These update live when changed via `setAttribute`, no rebuild: `color`, `spin`, `speed`, `pause`, `ambient`.

```js
const icon = document.querySelector('icon-3d');

icon.setAttribute('color', '#ff0000');   // changes color live
icon.setAttribute('spin', 'xyz');         // starts spinning
icon.removeAttribute('spin');             // stops
```

Others (`name`, `src`, `size`, `shading`) change geometry or canvas size, so they require recreating the element — frameworks handle this via the `key` prop.

---

## Custom OBJ files

Icon3D supports a minimal subset of the OBJ format: vertices (`v`), optional per-vertex colors, and faces (`f`, triangles or auto-triangulated polygons). Normals (`vn`), texture coords (`vt`), materials (`mtllib`/`usemtl`), groups (`g`/`o`), and smoothing (`s`) are ignored — Icon3D computes its own normals from the `shading` mode.

```objc
# vertex (a point in 3D space)
v  0.0  0.0  0.0

# vertex with per-vertex color (r g b, 0-1)
v  0.5  0.5  0.5   1.0  0.0  0.0

# face (1-based vertex indices)
f  1  2  3
```

Models are auto-centered and auto-scaled to fit. Serve OBJ files over http/https (browsers block `file://` fetches).

---

## Why Icon3D

| Feature | Description |
|---------|-------------|
| Shared GL context | All instances share one hidden WebGL context — no browser context limit. |
| Auto-pause off-screen | Icons outside the viewport pause automatically (IntersectionObserver). |
| Mesh caching | Geometry cached per model + shading. Many copies cost almost nothing. |
| Framework-agnostic | Vanilla HTML, React, Vue, Svelte, Angular, Lit, Alpine — anything. |
| SSR-safe | Won't crash in Next.js, Nuxt, or SvelteKit. |
| Zero dependencies | One file. No npm dependencies, no peer requirements. |

---

## License

MIT — free for commercial and personal projects, no attribution required.

---

Made with care at [icon3d.dev](https://icon3d.dev)