import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestUIComponent } from './test-ui/test-ui.component'
import { MyPhoneComponent } from "./controls/my-phone/my-phone.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MyPhoneComponent, TestUIComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MyTest2';
}
