import { UserService } from "src/app/services/user.service";
import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl, } from "@angular/forms";
import { AlertController, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  signupForm: FormGroup;
  showWarnings: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: new FormControl(
        "", 
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      ),

     
     
    
    });
  }

  async handleSignUp() {
    this.showWarnings = true;

    if (this.signupForm.valid) {
      this.loadingCtrl
        .create({ keyboardClose: true, cssClass: "loading-ctrl" })
        .then((loadingEl) => {
          loadingEl.present();
          let userDetails = {
            email: this.signupForm.value.email,
            password: this.signupForm.value.password,
          };

          this.authService.signupUser(userDetails).then(
            (res) => {
              console.log(res);
              loadingEl.dismiss();
              this.router.navigate(["/signin"]);
              let userData = {
                
                email: this.signupForm.value.email,
                password: this.signupForm.value.password,
                
                isUser: false,
              };
              this.userService
                .addUser(userData, this.signupForm.value.email)
                .subscribe((res) => {
                  console.log("JUS JIEBEE");
                });
            },
            async (err) => {
              loadingEl.dismiss();
              //       this.errorMessage = err.message;
              const alert = await this.alertController.create({
                cssClass: "my-custom-class",
                header: "Alert",
                message: err.message,
                buttons: ["OK"],
              });

              await alert.present();
            }
          );
        });
    }
  }
}
