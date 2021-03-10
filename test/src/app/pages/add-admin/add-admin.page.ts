import { Component, OnInit } from '@angular/core';
import { ProductService } from "./../../services/product.service";

import { Router } from '@angular/router';
import { LoadingController } from "@ionic/angular";
import { ToastService } from "./../../services/toast.service";
import { Plugins, CameraResultType } from "@capacitor/core";
import { AlertService } from "./../../services/alert.service";
import {FormBuilder, FormGroup, FormControl, Validators, } from "@angular/forms";

const { Camera } = Plugins;
 
@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.page.html',
  styleUrls: ['./add-admin.page.scss'],
})
export class AddAdminPage implements OnInit {

  imagePath = "";
  productForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private toastService: ToastService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: new FormControl("", Validators.compose([Validators.required])),
      price: new FormControl("", Validators.compose([Validators.required])),
      stock: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });

    var imageUrl = "data:image/jpeg;base64," + image.base64String;
    this.imagePath = imageUrl;
  }

  addProduct() {
    if (this.productForm.valid) {
      if (this.imagePath) {
        this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
          loadingEl.present();
          let data = {
            name: this.productForm.value.name,
            price: this.productForm.value.price,
            stock: this.productForm.value.stock,
            imageUrl: this.imagePath,
          };
          this.productService.addNewProduct(data).subscribe(
            (res) => {
              loadingEl.dismiss();
              this.toastService.presentToast("Upload Done!");
              this.router.navigate(["/admin"]);
            },
            (err) => {
              loadingEl.dismiss();
              this.alertService.showFirebaseAlert(err);
            }
          );
        });
      } else {
        this.toastService.presentToast("Upload product image");
      }
    } else {
      this.toastService.presentToast("Incomplete Details");
    }
  }
}

 