import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WelldoersService } from 'src/app/shared/services/welldoers.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Welldoer } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-welldoers-form',
  templateUrl: './welldoers-form.component.html',
  styleUrls: ['./welldoers-form.component.css']
})
export class WelldoersFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef
  form: FormGroup
  image: File
  imagePreview = ''
  isNew = true
  welldoer: Welldoer

  constructor(
    private route: ActivatedRoute,
    private welldoersService: WelldoersService,
    private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.route.params
      .pipe(
          switchMap(
            (params: Params) => {
              if (params['id']) {
                this.isNew = false;
                return this.welldoersService.getById(params['id'])
              }
              return of(null)
            }
          )
      )
      .subscribe(
        (welldoer: Welldoer) => {
          if (welldoer) {
            this.welldoer = welldoer;
            this.form.patchValue({
              name: welldoer.name
            });
            this.imagePreview = welldoer.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message)
      )
  }
  
  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  deleteWelldoer() {
    const decision = window.confirm(`Вы уверены, что хотите удалить благотворителя "${this.welldoer.name}"`)

    if (decision) {
      this.welldoersService.delete(this.welldoer._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/welldoers'])
        )
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }

    reader.readAsDataURL(file);
  }

  onSubmit() {
    let obs$
    this.form.disable()

    if (this.isNew) {
      obs$ = this.welldoersService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.welldoersService.update(this.welldoer._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      welldoer => {
        this.welldoer = welldoer
        MaterialService.toast('Изменения сохранены')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
}
