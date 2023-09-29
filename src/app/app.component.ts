import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  protected inputFormControl = new FormControl('');

  protected kebabCase = '';
  protected camelCase = '';
  protected pascalCase = '';
  protected upperCase = '';


  private textArray: string[] = [];

  constructor(private matSnackBar: MatSnackBar) {
  }

  public ngOnInit(): void {
    this.subscribeToInputFormControl();
  }

  protected copy(text: string): void {
    window.navigator.clipboard.writeText(text);
    this.matSnackBar.open('Copied: ' + text, '', {duration: 1000, verticalPosition: "top"});
  }

  private subscribeToInputFormControl(): void {
    this.inputFormControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(text => {
        if (!text?.trim()) {
          this.textArray = [];
          this.computeStrings();
          return;
        }
        this.computeTextArray(text?.trim());
        this.computeStrings();
      })
  }

  private computeTextArray(text: string): void {
    const result: string[] = [];
    text.replaceAll('-', ' ')
      .replaceAll('_', ' ')
      .replaceAll(/\s+/g, ' ')
      .split(' ')
      .forEach(s => {
        const sResult: string[] = [];
        for (let i=0; i < s.length; i++) {
          if (i > 0 && !this.isLowerCase(s[i]) && this.isLowerCase(s[i-1]) ) {
            sResult.push(' ');
          }
          sResult.push(s[i]);
        }
        result.push(...sResult.join('').split(' '))
      });

    this.textArray = result;
  }

  private isLowerCase(x: string): boolean {
    return x.toLowerCase() === x;
  }

  private computeStrings(): void {
    this.kebabCase = this.textArray.map(x => x.toLowerCase()).join('-');
    this.upperCase = this.textArray.map(x => x.toUpperCase()).join('_');

    this.pascalCase = this.textArray
      .map(x => x.toLowerCase())
      .map(s => {
      const first = s[0].toUpperCase();
      return first + s.slice(1)
    })
      .join('')

    this.camelCase = this.pascalCase[0].toLowerCase() + this.pascalCase.slice(1);
  }
}
