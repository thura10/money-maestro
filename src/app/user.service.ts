import { Injectable } from '@angular/core';

import {AngularFireAuth} from 'angularfire2/auth';
import { AngularFirestore } from "angularfire2/firestore";
import * as firebase from 'firebase/app';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth: AngularFireAuth, private afStore: AngularFirestore, private storage: AngularFireStorage) { }

  checkLoggedIn() {
    return this.afAuth.user
  }
  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
  }
  register(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  }
  setUserDetails(uid: string, data: any) {
    return this.afStore.collection('users').doc(uid).set(data);
  }

  logout() {
    return this.afAuth.auth.signOut()
  }

  addTransaction(uid: string, transaction) {
    return this.afStore.collection('users').doc(uid).collection('transactions').add(transaction)
  }
  uploadPhoto(photo) {
    let path = "images/image-" + new Date().toISOString();
    return this.storage.upload(path, photo);
  }

  getDashboardData(uid: string, length: string) {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1
    let year = today.getFullYear();

    let ref = this.afStore.collection('users').doc(uid).collection('transactions').ref.where("year", "==", year).where('incoming', '==', false)
    if (length === 'year') { return ref }

    ref = ref.where("month", "==", month)
    if (length === 'month') { return ref }

    let week = []

    for (let i = 1; i <= 7; i++) {
      let first = today.getDate() - today.getDay() + i 
      let day = new Date(today.setDate(first)).getDate()
      week.push(day)
    }
    return ref.where("day", "in", week)
  }
  getDataByMonthYear(uid: string, month: number, year: number) {
    return this.afStore.collection('users').doc(uid).collection('transactions').ref.where("year", "==", year).where("month", "==", month).where("incoming", '==', false).get()
  }

  getUserPrefs(uid) {
    return this.afStore.collection('users').doc(uid).get()
  }
  setUserPrefs(uid, data) {
    return this.afStore.collection('users').doc(uid).update(data)
  }
  sendFeedback(data) {
    return this.afStore.collection('feedback').add(data)
  }
  updatePassword(password: string) {
    return this.afAuth.auth.currentUser.updatePassword(password)
  }

  getAllTransactionByDate(uid: string, day: number, month: number, year: number) {
    return this.afStore.collection('users').doc(uid).collection('transactions').ref.where('day', "==", day).where("month", "==", month).where("year", "==", year)
  }
  deleteTransaction(uid: string, id: any) {
    return this.afStore.collection('users').doc(uid).collection('transactions').doc(id).delete()
  }
  editTransaction(uid: string, id: any, data: any) {
    return this.afStore.collection('users').doc(uid).collection('transactions').doc(id).update(data)
  }

  getFilteredTransactions(uid: string) {
    return this.afStore.collection('users').doc(uid).collection('transactions').ref
  }
}
