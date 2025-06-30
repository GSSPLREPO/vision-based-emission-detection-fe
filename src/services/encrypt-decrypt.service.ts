import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { global_const } from '../config/global-constants';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  private key = CryptoJS.enc.Utf8.parse(global_const.EncryptKey);
  private iv = CryptoJS.enc.Utf8.parse(global_const.EncryptIV);
  constructor() {}
  // Methods for the encrypt and decrypt Using AES
  encryptUsingAES256(text:any): any {
      var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), this.key, {
          keySize: 128 / 8,
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString();
  }
  decryptUsingAES256(decString:any) {
      var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
          keySize: 128 / 8,
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
