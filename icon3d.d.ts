/**
 * Icon3D, TypeScript definitions
 *
 * Provides JSX/TSX support and type-safe attributes for the <icon-3d> custom element.
 *
 * Usage in HTML/JS, no setup needed.
 * Usage in TypeScript, place this file alongside icon3d.js, or install via npm.
 * Usage in React/Next.js, TypeScript will pick this up automatically if it's in your project.
 */

// =====================================================
// Public API surface, Icon3D namespace
// =====================================================

export interface Icon3DModel {
  /** OBJ file content as a string. Supports vertex colors: "v x y z r g b" */
  obj: string;
  /** Optional initial rotation in radians [rx, ry, rz] */
  angle?: [number, number, number];
  /** Optional default color (hex), used when OBJ has no vertex colors */
  color?: string;
}

export interface Icon3DHandler {
  /** 'base' modifies persistent rotation, 'frame' modifies transient per-frame state */
  phase: 'base' | 'frame';
  /** Called once when handler is attached to an element */
  init?: (state: any, el: HTMLElement) => void;
  /** Called every frame with elapsed seconds */
  tick?: (state: any, dt: number) => void;
  /** Called when element is removed from DOM */
  destroy?: (state: any, el: HTMLElement) => void;
}

export interface Icon3DModifier {
  /** Called once when modifier is activated */
  init?: (state: any, el: HTMLElement) => void;
  /** Returns intensity 0..1 based on interaction state */
  read: (state: any) => number;
  /** Called when element is removed from DOM */
  destroy?: (state: any, el: HTMLElement) => void;
}

export interface Icon3DShader {
  vs: string;
  fs: string;
  geometry: 'flat' | 'smooth' | 'wireframe' | null;
  mode: 'TRIANGLES' | 'LINES';
}

export interface Icon3DGlobal {
  /** Registered models by name (e.g. 'icon3d-ui-home') */
  models: Record<string, Icon3DModel>;
  /** Registered animation/interaction handlers */
  handlers: Record<string, Icon3DHandler>;
  /** Registered reactive state modifiers (hover, click, active, ...) */
  modifiers: Record<string, Icon3DModifier>;
  /** Registered shader programs */
  shaders: Record<string, Icon3DShader>;
  /** Parse a color hex string into [r, g, b] in 0..1 range */
  parseColor: (hex: string) => [number, number, number] | null;
  /** Parse a size value (preset or pixel number) into pixels */
  parseSize: (value: string) => number;
}

// Make Icon3D available globally on window
declare global {
  interface Window {
    Icon3D: Icon3DGlobal;
  }
  const Icon3D: Icon3DGlobal;
}

// =====================================================
// Attribute types for the <icon-3d> element
// =====================================================

/** Size presets supported by the `size` attribute */
export type Icon3DSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '2x' | '3x' | '4x' | '5x' | string | number;

/** Axes for rotation attributes */
export type Icon3DAxes = 'x' | 'y' | 'z' | 'xy' | 'xz' | 'yz' | 'xyz';

/** Shading style */
export type Icon3DShading = 'flat' | 'smooth' | 'toon' | 'wireframe';

/** Initial angle preset or "rx ry rz" in radians */
export type Icon3DAngle = 'front' | 'side' | 'top' | 'iso' | 'iso-r' | string;

/** Gradient direction */
export type Icon3DGradientDirection = 'vertical' | 'horizontal' | 'diagonal' | 'radial';

/** Loading strategy (HTML standard) */
export type Icon3DLoading = 'lazy' | 'eager';

/**
 * All attributes accepted by <icon-3d>.
 * Use string for all values since HTML attributes are strings.
 */
export interface Icon3DAttributes {
  // Identity (one required)
  name?: string;
  src?: string;
  alt?: string;

  // Size & color
  size?: Icon3DSize;
  color?: string;

  // Animation
  spin?: Icon3DAxes;
  speed?: string | number;
  pulse?: '' | boolean;
  bounce?: '' | boolean;
  wobble?: '' | boolean;
  tada?: '' | boolean;
  entrance?: '' | boolean;
  'entrance-duration'?: string | number;

  // Interaction
  'look-at'?: 'cursor';
  drag?: '' | boolean;
  'hover-spin'?: '' | Icon3DAxes;

  // Hover modifiers
  'hover-color'?: string;
  'hover-scale'?: string | number;
  'hover-speed'?: string | number;

  // Click modifiers (one-shot, decays over ~0.4s)
  'click-color'?: string;
  'click-scale'?: string | number;
  'click-spin'?: Icon3DAxes;
  'click-speed'?: string | number;

  // Active modifiers (while pressed)
  'active-color'?: string;
  'active-scale'?: string | number;
  'active-spin'?: Icon3DAxes;
  'active-speed'?: string | number;

  // Rendering
  shading?: Icon3DShading;
  outline?: '' | boolean | string;
  'outline-thickness'?: string | number;

  // Gradient
  gradient?: string;
  'gradient-direction'?: Icon3DGradientDirection;

  // Shadow
  shadow?: '' | boolean | string;
  'shadow-opacity'?: string | number;

  // Lighting
  ambient?: string | number;
  'light-dir'?: string;

  // Camera
  angle?: Icon3DAngle;
  fov?: string | number;

  // Performance / timing
  loading?: Icon3DLoading;
  pause?: '' | boolean;
  'in-view-entrance'?: '' | boolean;
  autoplay?: string | number;

  // Standard HTML attributes (always available)
  id?: string;
  class?: string;
  style?: string;
  title?: string;
}

// =====================================================
// React / JSX integration
// =====================================================

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'icon-3d': Icon3DReactAttributes;
    }
  }
}

/**
 * React-friendly attribute names.
 * Includes both kebab-case (HTML) and camelCase (React) variants,
 * plus standard React event handlers.
 */
export interface Icon3DReactAttributes extends Icon3DAttributes {
  // Standard React HTML attributes
  className?: string;
  ref?: any;
  children?: any;

  // Custom event handlers (React 19+ syntax)
  onIcon3dReady?: (event: CustomEvent<{ name: string }>) => void;
  onIcon3dError?: (event: CustomEvent<{ reason: string; name?: string; url?: string; error?: string }>) => void;
  onIcon3dClick?: (event: CustomEvent<{ name: string; originalEvent: MouseEvent | TouchEvent }>) => void;
  onIcon3dDragStart?: (event: CustomEvent<{ name: string }>) => void;
  onIcon3dDragEnd?: (event: CustomEvent<{ name: string }>) => void;
  onIcon3dAnimationEnd?: (event: CustomEvent<{ animation: string }>) => void;
  onIcon3dDestroyed?: (event: CustomEvent<{ name: string }>) => void;
}

// =====================================================
// Custom events on HTMLElement
// =====================================================

declare global {
  interface HTMLElementEventMap {
    'icon3d-ready': CustomEvent<{ name: string }>;
    'icon3d-error': CustomEvent<{ reason: string; name?: string; url?: string; error?: string }>;
    'icon3d-click': CustomEvent<{ name: string; originalEvent: MouseEvent | TouchEvent }>;
    'icon3d-drag-start': CustomEvent<{ name: string }>;
    'icon3d-drag-end': CustomEvent<{ name: string }>;
    'icon3d-animation-end': CustomEvent<{ animation: string }>;
    'icon3d-destroyed': CustomEvent<{ name: string }>;
  }
}