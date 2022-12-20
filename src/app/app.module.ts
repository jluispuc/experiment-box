import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TooltipPopDirective } from './tooltip-pop.directive';
import { TooltipPopInfoComponent } from './tooltip-pop-info/tooltip-pop-info.component';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    OverlayModule,
    MatCardModule,
    MatIconModule,
    
  ],
  declarations: [
    AppComponent,
    HelloComponent,
    TooltipPopDirective,
    TooltipPopInfoComponent,
  ],
  bootstrap: [AppComponent],
  entryComponents: [TooltipPopInfoComponent],
})
export class AppModule {}
