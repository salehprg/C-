import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ComingSoonPageComponent} from './coming-soon/coming-soon-page.component';
import {ErrorPageComponent} from './error/error-page.component';
import {ForgotPasswordPageComponent} from './forgot-password/forgot-password-page.component';
import {LockScreenPageComponent} from './lock-screen/lock-screen-page.component';
import {LoginPageComponent} from './login/login-page.component';
import {MaintenancePageComponent} from './maintenance/maintenance-page.component';
import {RegisterPageComponent} from './register/register-page.component';
import {CompleteRegisterComponent} from './complete-register/complete-register.component';
import {AuthGuardNeg} from '../../shared/services/auth-gurd.service';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'comingsoon',
        component: ComingSoonPageComponent,
        data: {
          title: 'Coming Soon page'
        }
      },
      {
        path: 'error',
        component: ErrorPageComponent,
        data: {
          title: 'Error Page'
        }
      },
      {
        path: 'forgotpassword',
        component: ForgotPasswordPageComponent,
        data: {
          title: 'Forgot Password Page'
        }
      },

      {
        path: 'lockscreen',
        component: LockScreenPageComponent,
        data: {
          title: 'Lock Screen page'
        }
      },
      {
        path: 'login',
        component: LoginPageComponent,
        data: {
          title: 'Login Page'
        },
        canActivate: [AuthGuardNeg]
      },
      {
        path: 'maintenance',
        component: MaintenancePageComponent,
        data: {
          title: 'Maintenance Page'
        }
      },
      {
        path: 'register',
        component: RegisterPageComponent,
        data: {
          title: 'Register Page'
        }
      },
      {
        path: 'cr/:guid',
        component: CompleteRegisterComponent,
        data: {
          title: 'Register Page'
        }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule {
}
