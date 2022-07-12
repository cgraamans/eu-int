import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormControl,AbstractControl } from '@angular/forms';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {

  // SUBSCRIPTIONS
  private FormRegisterSubscription:Subscription;
  private SocketUserValidateSubscription:Subscription;

  // FORM GROUP OBJECTS
  public FormRegister:FormGroup = new FormGroup({
    email: new FormControl('',[Validators.email]),
    password: new FormControl('', Validators.minLength(8)),
    passwordConfirm: new FormControl('', Validators.minLength(8)),
  });

  public FormLogin:FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('', Validators.minLength(8)),
  });

  // VALIDATION DATA
  public validationErrorEmail:boolean = false;
  public validationErrorPassword:boolean = false;
  public validationErrorEmailMessage:string = "";
  public validationErrorPasswordMessage:string = "";

  constructor(private fb: FormBuilder, private socketService:SocketService) {

    this.SocketUserValidateSubscription = this.socketService.socket.fromEvent('user:validate').subscribe(
      (obs:any)=>{
        if(obs.field === 'email') {
          this.validationErrorEmail = !obs.ok;
          if(obs.error) this.validationErrorEmailMessage = obs.error;
        }
        if(obs.field === 'password') {
          this.validationErrorPassword = !obs.ok;
          if(obs.error) this.validationErrorPasswordMessage = "Your password is not strong enough";
        }
      }
    );

    this.FormRegisterSubscription = this.FormRegister.valueChanges
    .pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
    .subscribe(change=>{

      if(change.email) {

        this.socketService.socket.emit("user:validate",{email:change.email});

      }

      if(change.password) {

        this.validationErrorPassword = false;
        if(this.FormRegister.value.passwordConfirm !== change.password) {

          this.validationErrorPassword = true;
          this.validationErrorPasswordMessage = "Passwords do not match";

        } else {

          this.socketService.socket.emit("user:validate",{password:change.password});

        }

      } 
      
      if (change.passwordConfirm) {

        this.validationErrorPassword = false;
        if(this.FormRegister.value.password !== change.passwordConfirm) {

          this.validationErrorPassword = true;
          this.validationErrorPasswordMessage = "Passwords do not match";

        } else {

          this.socketService.socket.emit("user:validate",{password:change.password});

        }

      }

    });

  }

  public onRegister() {

    let formVal = Object.assign({},this.FormRegister.value);
    delete formVal.passwordConfirm;
    this.socketService.socket.emit("user:register",formVal);

  }

  public onLogin() {

    this.socketService.socket.emit("user:login",this.FormLogin.value);

  }

  private passwordMatchValidator(g: AbstractControl) {

    const pwd = g.get('password'),
      pwdConfirm = g.get('passwordConfirm');

    if(!pwd || !pwdConfirm) return {'mismatch': true};

    return pwd.value === pwdConfirm.value
       ? null : {'mismatch': true};
  
  }

  ngOnDestroy(): void {
    this.FormRegisterSubscription.unsubscribe();
    this.SocketUserValidateSubscription.unsubscribe();
  }

}
