'use client';

import { gsap } from 'gsap';
import { JSX, useEffect, useRef } from 'react';

function lerp(a: number, b: number, n: number): number {
  return (1 - n) * a + n * b;
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

class ImageItem {
  public DOM: { el: HTMLDivElement; inner: HTMLDivElement | null } = {
    el: null as unknown as HTMLDivElement,
    inner: null,
  };
  public rect: DOMRect | null = null;
  private resizeHandler: () => void;

  constructor(DOM_el: HTMLDivElement) {
    this.DOM.el = DOM_el;
    this.DOM.inner = this.DOM.el.querySelector('.content__img-inner');
    this.getRect();
    this.resizeHandler = () => { gsap.set(this.DOM.el, { scale: 1, x: 0, y: 0, opacity: 0 }); this.getRect(); };
    window.addEventListener('resize', this.resizeHandler);
  }

  destroy() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  private getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }
}

class ImageTrailEffect {
  private container: HTMLDivElement;
  private images: ImageItem[];
  private imagesTotal: number;
  private imgPosition = 0;
  private zIndexVal = 1;
  private activeImagesCount = 0;
  private isIdle = true;
  private threshold = 80;
  private mousePos = { x: 0, y: 0 };
  private lastMousePos = { x: 0, y: 0 };
  private cacheMousePos = { x: 0, y: 0 };
  private rafId: number | null = null;
  private started = false;
  private mouseMoveHandler: (e: MouseEvent) => void;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.images = [...container.querySelectorAll<HTMLDivElement>('.content__img')].map(img => new ImageItem(img));
    this.imagesTotal = this.images.length;

    // Listen on window so we get events even when pointer is over child elements
    this.mouseMoveHandler = (e: MouseEvent) => {
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only track when mouse is over the container
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      this.mousePos = { x, y };
      if (!this.started) {
        this.started = true;
        this.cacheMousePos = { ...this.mousePos };
        this.rafId = requestAnimationFrame(() => this.render());
      }
    };
    window.addEventListener('mousemove', this.mouseMoveHandler);
  }

  private render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (distance > this.threshold) { this.showNextImage(); this.lastMousePos = { ...this.mousePos }; }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  private showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => { this.activeImagesCount++; this.isIdle = false; },
      onComplete: () => { this.activeImagesCount--; if (this.activeImagesCount === 0) this.isIdle = true; },
    })
      .fromTo(img.DOM.el, {
        opacity: 1, scale: 0, zIndex: this.zIndexVal,
        x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
        y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2,
      }, {
        duration: 0.4, ease: 'power1', scale: 1,
        x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
        y: this.mousePos.y - (img.rect?.height ?? 0) / 2,
      }, 0)
      .fromTo(img.DOM.inner,
        { scale: 2.8, filter: 'brightness(250%)' },
        { duration: 0.4, ease: 'power1', scale: 1, filter: 'brightness(100%)' }, 0)
      .to(img.DOM.el, { duration: 0.4, ease: 'power2', opacity: 0, scale: 0.2 }, 0.45);
  }

  destroy() {
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.images.forEach(img => img.destroy());
  }
}

interface ImageTrailProps {
  items?: string[];
  className?: string;
}

export default function ImageTrail({ items = [], className = '' }: ImageTrailProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const effect = new ImageTrailEffect(containerRef.current);
    return () => effect.destroy();
  }, []);

  return (
    <div
      className={`w-full h-full absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      ref={containerRef}
    >
      {items.map((url, i) => (
        <div
          className="content__img w-[160px] aspect-[0.75] absolute top-0 left-0 opacity-0 overflow-hidden [will-change:transform,filter]"
          key={i}
        >
          <div
            className="content__img-inner bg-center bg-cover w-[calc(100%+20px)] h-[calc(100%+20px)] absolute top-[-10px] left-[-10px]"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}
