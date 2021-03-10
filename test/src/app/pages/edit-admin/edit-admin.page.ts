import { ToastService } from "./../../services/toast.service";
import { AlertService } from "./../../services/alert.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { ProductService } from "./../../services/product.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import { Plugins, CameraResultType } from "@capacitor/core";
const { Camera } = Plugins;

@Component({
  selector: "app-edit-admin",
  templateUrl: "./edit-admin.page.html",
  styleUrls: ["./edit-admin.page.scss"],
})
export class EditAdminPage implements OnInit {
  productId; 
  productDetails;
  productForm: FormGroup;
  imageUrl;
  constructor(
    private router: Router,
    private productService: ProductService, 
    private loadingCtrl: LoadingController,
    private alertService: AlertService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private firestore: AngularFirestore

  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: new FormControl("", Validators.compose([Validators.required])),
      price: new FormControl("", Validators.compose([Validators.required])),
      stock: new FormControl("", Validators.compose([Validators.required])),
    });
    this.route.queryParams.subscribe((params) => {
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        this.productId = params.id;
        this.productService.getProductById(this.productId).subscribe(
          (res) => {
            console.log(res);

            this.productDetails = res;
            loadingEl.dismiss();
            this.patchDetails();
          },
          (err) => {
            loadingEl.dismiss();
            this.alertService.showFirebaseAlert(err);
          }
        );
      });
    });
  }

  patchDetails() {
    this.imageUrl = this.productDetails.imageUrl;
    this.productForm.patchValue({
      name: this.productDetails.name,
      price: this.productDetails.price,
      stock: this.productDetails.stock,
      desc: this.productDetails.desc,
    });
  }
 
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });

    var imageUrl = "data:image/jpeg;base64," + image.base64String;
    this.imageUrl = imageUrl;
  }
 
  updateProduct() {
    if (this.productForm.valid) {
      if (this.imageUrl) {
        this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
          loadingEl.present();
          let data = {
            name: this.productForm.value.name,
            price: this.productForm.value.price,
            stock: this.productForm.value.stock,
            imageUrl: this.imageUrl,
          };
          this.productService.editProduct(this.productId, data).subscribe(
            (res) => {
              loadingEl.dismiss();
              this.toastService.presentToast("Product save");
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
      this.toastService.presentToast("Enter name and price");
    }
  }

  async deleteProduct(id) {
    //show loader
    const alert = await this.alertController.create({
      header: "Delete",
      message: "Delete this product?",
      cssClass: "alert-controller",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: (blah) => {},
        },
        {
          text: "Yes",
          handler: () => {
            this.doDelete(id);
          },
        },
      ],
    });
    await alert.present();
  }

  doDelete(id) {
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.productService.deleteProduct(this.productId).subscribe(
        (res) => {
          loadingEl.dismiss();
          this.toastService.presentToast("Product deleted");
          this.router.navigate(["/admin"]);
        },
        (err) => {
          loadingEl.dismiss();
          this.alertService.showFirebaseAlert(err);
        }
      );
    });
  }
}
