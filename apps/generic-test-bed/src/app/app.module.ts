import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule, 
    HttpClientModule,
    InfiniteScrollModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
