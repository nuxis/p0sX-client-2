import {Directive, ElementRef, HostListener, Input, Renderer2, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
    selector: '[mat-elevation]'
})
export class MaterialElevationDirective implements OnChanges
{
    @Input()
    public defaultElevation: number = 2;

    @Input()
    public raisedElevation: number = 8;

    constructor(
        private element: ElementRef<HTMLElement>,
        private renderer: Renderer2
    )
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
        const classesToRemove = Array.from(this.element.nativeElement.classList).filter(c => c.startsWith('mat-elevation-z'));
        for(const c of classesToRemove)
        {
            this.renderer.removeClass(this.element.nativeElement, c);
        }

        const newClass = `mat-elevation-z${amount}`;
        this.renderer.addClass(this.element.nativeElement, newClass);
    }
}
