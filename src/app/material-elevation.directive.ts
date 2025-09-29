import {Directive, ElementRef, HostListener, Input, Renderer2, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
    selector: '[mat-elevation]',
    standalone: false
})
export class MaterialElevationDirective implements OnChanges
{
    @Input()
    public defaultElevation: number = 2;

    @Input()
    public raisedElevation: number = 3;

    constructor(private element: ElementRef<HTMLElement>, private renderer: Renderer2)
    {
        this.setElevation(this.defaultElevation);
    }

    ngOnChanges(_changes: SimpleChanges)
    {
        this.setElevation(this.defaultElevation);
    }

    @HostListener('mouseenter')
    onMouseEnter()
    {
        this.setElevation(this.raisedElevation);
    }

    @HostListener('mouseleave')
    onMouseLeave()
    {
        this.setElevation(this.defaultElevation);
    }

    setElevation(amount: number)
    {
        this.renderer.setStyle(this.element.nativeElement, "box-shadow", `var(--mat-sys-level${amount}`);
    }
}
