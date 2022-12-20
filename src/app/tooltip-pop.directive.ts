import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Host,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TemplatePortal } from '@angular/cdk/portal';

export type TooltipPopPosition = 'top' | 'left';
export type TooltipPopTriggerEvent = 'click' | 'mouseover';

export enum TooltipPopPositionType {
  LEFT = 'left',
  TOP = 'top',
}

export enum TooltipPopTriggerEventType {
  CLICK = 'click',
  MOUSEOVER = 'mouseover',
}

@Directive({
  selector: '[tooltipPop]',
})
export class TooltipPopDirective implements OnInit, OnDestroy {
  @Input()
  tooltipPopTrigger!: TemplateRef<object>;

  @Input()
  closeOnClickOutside: boolean = true;

  @Input()
  tooltipPopTriggerEvent: TooltipPopTriggerEvent =
    TooltipPopTriggerEventType.CLICK;

  @Input('tooltipPopPosition')
  tooltipPopPosition: TooltipPopPosition = TooltipPopPositionType.TOP;

  @HostListener('click', ['$event'])
  onClick(event) {
    if (this.tooltipPopTriggerEvent == TooltipPopTriggerEventType.CLICK) {
      this.attachOverlay();
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event) {
    if (this.tooltipPopTriggerEvent == TooltipPopTriggerEventType.MOUSEOVER) {
      this.attachOverlay();
    }
  }
  @HostListener('mouseout', ['$event'])
  onMouseOut(event) {
    if (this.tooltipPopTriggerEvent == TooltipPopTriggerEventType.MOUSEOVER) {
      this.detachOverlay();
    }
  }

  private unsubscribe = new Subject();
  private overlayRef!: OverlayRef;
  private embebedViewRef: EmbeddedViewRef<object>;

  constructor(
    @Host() private elRef: ElementRef,
    private renderer: Renderer2,
    private overlay: Overlay,
    private vcr: ViewContainerRef
  ) {
    this.renderer.addClass(elRef.nativeElement, 'tooltippop');
  }

  ngOnDestroy(): void {
    this.detachOverlay();
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.createOverlay();
  }

  private createOverlay(): void {
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elRef)
      .withPositions([
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8,
        },
      ])
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        if (this.closeOnClickOutside) {
          this.detachOverlay();
        }
      });
  }

  private attachOverlay(): void {
    if (!this.overlayRef.hasAttached()) {
      const periodSelectorPortal = new TemplatePortal(
        this.tooltipPopTrigger,
        this.vcr
      );

      this.embebedViewRef = this.overlayRef.attach(periodSelectorPortal);
      this.setPositionClass();
    }
  }

  private detachOverlay(): void {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  private setPositionClass() {
    let pop = this.embebedViewRef.rootNodes[0];
    if (
      pop != undefined &&
      this.tooltipPopPosition === TooltipPopPositionType.LEFT
    ) {
      this.renderer.addClass(pop, 'tooltippop-left');
    }

    if (
      pop != undefined &&
      this.tooltipPopPosition === TooltipPopPositionType.TOP
    ) {
      this.renderer.addClass(pop, 'tooltippop-top');
    }
  }
}
