// src/customer/utils/types.ts
export interface Account {
  id: number;
  email: string;
  password: string;
  phoneNumber: string;
  google_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  picture_url: string | null;
  username: string;
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
  price: number;
  estimatedTime: string;
  description : string;
  // Thêm các trường khác nếu cần
}

export interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  // Thêm các trường khác nếu cần
}

export interface Appointment {
  id: number;
  clientName: string;
  serviceId: number;
  date: string;
  time: string;
  // Thêm các trường khác nếu cần
}

export interface Employee {
  id: number;
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
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: number;
  email: string;
  // Thêm các trường khác nếu cần
}

export interface Employee_date {
  start_time: Date;
  end_time: Date;
}