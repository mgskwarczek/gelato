import { Component } from '@angular/core';
import { NavBarComponent } from '../../../common/components/nav-bar/nav-bar.component';
import { SideBarComponent } from '../../../common/components/side-bar/side-bar.component';

export interface Order {
  title: string;
  shopName: string;
  shopLocation: string;
  priority: string;
  status: string;
  creationDate: Date;
}

@Component({
  selector: 'app-order-list',
  standalone:true,
  imports: [
   NavBarComponent, SideBarComponent
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent {
  displayedColumns: string[] = [
    'orderTitle',
    'shopName',
    'shopLocation',
    'priority',
    'status',
    'creationDate',
  ];

  orders: Order[] = [
    {
      title: 'Order 1',
      shopName: 'Shop 1',
      shopLocation: 'Location 1',
      priority: 'High',
      status: 'Pending',
      creationDate: new Date(),
    },
    {
      title: 'Order 2',
      shopName: 'Shop 2',
      shopLocation: 'Location 2',
      priority: 'Medium',
      status: 'Completed',
      creationDate: new Date(),
    },
  ];
}
