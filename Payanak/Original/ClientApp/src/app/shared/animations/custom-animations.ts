import {animate, state, style, transition, trigger} from '@angular/animations';


export const customAnimations = [
  trigger('slideInOut', [
    state('1', style({height: '*'})),
    state('0', style({height: '0px'})),
    transition('1 <=> 0', animate(200))
  ])
];
