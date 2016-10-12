import { Component, OnInit } from '@angular/core';
import { AngularFire } from "angularfire2";

import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'home.html'
})
export class Home implements OnInit {
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType: string = 'doughnut';


  constructor(private navCtrl: NavController, public af: AngularFire) { }

  ngOnInit(): void {
    console.log("Welcome home");
  }
}
