import { AlertService } from "./../../services/alert.service";
import { UserService } from "./../../services/user.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators, } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.page.html",
  styleUrls: ["./signin.page.scss"],
})
export class SigninPage implements OnInit {
  signinForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
    });
  }

  async handleSigninUser() {
    if (this.signinForm.valid) {
      this.loadingCtrl
        .create({ keyboardClose: true, cssClass: "loading-ctrl" })
        .then((loadingEl) => {
          loadingEl.present();
          let userDetails = {
            email: this.signinForm.value.email,
            password: this.signinForm.value.password,
          };
          this.authService.signinUser(userDetails).then(
            (res) => {
              localStorage.setItem("email", this.signinForm.value.email);

              this.userService.getUserDetails().subscribe(
                (resp: any) => {
                  loadingEl.dismiss();
                  if (resp.isUser) {
                    localStorage.setItem("isUser", resp.isUser);
                    this.router.navigate(["/about"]);
                  } else {
                    localStorage.setItem("isUser", "false");
                    this.router.navigate(["/about"]);
                  }
                }, 
                async (err) => {
                  loadingEl.dismiss();
                  await this.alertService.showFirebaseAlert(err);
                }
              );
              this.signinForm.reset();
            },
            async (err) => {
              loadingEl.dismiss();
              const alert = await this.alertCtrl.create({
                header: "Invalid credentials",
                message: err.message,
                buttons: ["Okay"],
              });
              await alert.present();
            }
          );
        });
    } else {
      const alert = await this.alertCtrl.create({
        header: "Alert",
        message: "Wrong email or password",
        buttons: ["OK"],
      });

      await alert.present();
    }
  
}

 
  // Easy access for form fields
  get email() {
    return this.signinForm.get('email');
  }
  
  get password() {
    return this.signinForm.get('password');
  }
}

