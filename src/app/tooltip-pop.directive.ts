import {
  Directive,
  ElementRef,
  Host,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import {
  ConnectedPosition,
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
  STANDARD_DROPDOWN_ADJACENT_POSITIONS,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
} from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TemplatePortal } from '@angular/cdk/portal';

export type TooltipPopPosition = 'top' | 'left';

export enum TooltipPopPositionType {
  LEFT = 'left',
  TOP = 'top',
}

@Directive({
  selector: '[tooltipPop]',
})
export class TooltipPopDirective implements OnInit, OnDestroy {
  @Input() tooltipPopTrigger!: TemplateRef<object>;

  @Input()
  closeOnClickOutside: boolean = false;

  @Input('tooltipPopPosition') tooltipPopPosition: TooltipPopPosition =
    TooltipPopPositionType.LEFT;

  @HostListener('mouseover', ['$event'])
  onMouseOver(event) {
    this.attachOverlay();
    //let pop = this.tooltipPopTrigger.elementRef.nativeElement;
    //this.elRef.nativeElement.getElementsByClassName('tooltippoptext')[0];

    /*if (
      pop != undefined &&
      this.tooltipPopPosition === TooltipPopPosition.LEFT
    ) {
      this.renderer.addClass(pop, 'tooltippop-left');
      this.renderer.setStyle(pop, 'top', `-${pop.clientHeight / 2 - 10}px`);
    }

    if (
      pop != undefined &&
      this.tooltipPopPosition === TooltipPopPosition.TOP
    ) {
      this.renderer.addClass(pop, 'tooltippop-top');
      this.renderer.setStyle(pop, 'top', `-${pop.clientHeight}px`);
      this.renderer.setStyle(pop, 'margin-left', `-${pop.clientWidth / 2}px`);
    }*/
  }

  @HostListener('mouseout', ['$event'])
  onMoiseOut(event) {
    this.detachOverlay();
  }

  private unsubscribe = new Subject();
  private overlayRef!: OverlayRef;

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
      .withPositions(STANDARD_DROPDOWN_BELOW_POSITIONS)
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy,
      hasBackdrop: true,
      //backdropClass: 'cdk-overlay-transparent-backdrop',
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

      this.overlayRef.attach(periodSelectorPortal);
    }
  }

  private detachOverlay(): void {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
