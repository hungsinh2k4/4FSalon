// src/manager/utils/types.ts
export interface Account {
  id: number;
  email: string;
  password: string;
  google_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  picture_url: string | null;
  username: string;
}
export interface User {
  id: number;
  email: string;
  password: string;
  google_id: string;
  role: string;
}
  export interface Feedback {
    id: number;
    message: string;
    date: string;
    // Thêm các trường khác nếu cần
  }
  

  export interface Service {
    id: number;
    title: string;
    description: string;
    estimate_time: number;
    price: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }
  
  export interface Schedule {
    id: number;
    employee_id: number;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    employee: Employee;
    // Thêm các trường khác nếu cần
  }

  export interface Absence {
    id: number;
    employee_id: number;
    reason:string;
    date: string;
    employee: Employee;
    // Thêm các trường khác nếu cần
  }
  
  export interface Appointment {
    id: number;
    clientName: string;
    service_id: number;
    date: string;
    time: string;
    // Thêm các trường khác nếu cần
  }
  
  export interface Employee {
    id: number;
    big_avatar_url: string;
    name: string;
    email: string;
    phone: string;
    work_position: string;
    available_from: string;
    available_to: string;
    status: boolean;
    overal_rating: number;
    branch_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    small_avatar_url: string;
  }
  
  
  export interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
  }

  export interface Statistic {
    appointment: AppointmentStat[];
    customer?: CustomerStat[];
    new_customer?: NewCustomerStat[];
  }

  export interface AppointmentStat {
    number_of_appointments: number;
    total_revenue: number;
    appointment_date: string;
    employee_id?: number;
    employee_name?: string;
    branch_id?: number;
    branch_name?: string;
  }

  export interface CustomerStat {
    number_of_customers?: number;
  }

  export interface NewCustomerStat {
    number_of_new_customers?: number;
  }