import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Profile } from './profile/profile';
import { Cart } from './cart/cart';
import { Details } from './details/details';
import { Istorija } from './istorija/istorija';
import { ProfileIzmena } from './profile-izmena/profile-izmena';
import { Pay } from './pay/pay';

export const routes: Routes = [

    {path: '', title: 'Home', component: Home},
    {path: 'login', title: 'Login', component: Login},
    {path: 'signup', title: 'Signup', component: Signup},
    {path: 'profile', title: 'Profile', component: Profile},
    {path: 'profile-izmena', title: 'Izmena Profila', component: ProfileIzmena},
    {path: 'cart', title: 'Cart', component: Cart},
    {path: 'pay', title: 'Pay', component: Pay},
    {path: 'istorija', title: 'Istorija kupovina', component: Istorija},
    {path: 'details/:permalink', title: 'Details', component: Details},
    {path: '**', redirectTo: ''}

];
