import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Utils } from '../utils';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  constructor(protected utils: Utils){

    }

}
