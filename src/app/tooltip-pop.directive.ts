import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

export enum TooltipPopPosition {
  TOP = 'top',
  LEFT = 'left',
}

@Directive({
  selector: '[vanTooltipPop]',
})
export class TooltipPopDirective {
  @Input('tooltipPopPosition') tooltipPopPosition: 'top' | 'left' =
    TooltipPopPosition.LEFT;

  @HostBinding() tabindex = 0;
  @HostListener('mouseover', ['$event'])
  onMouseOver(event) {
    let pop =
      this.elRef.nativeElement.getElementsByClassName('tooltippoptext')[0];

    if (
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
    }
  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(elRef.nativeElement, 'tooltippop');
  }
}
