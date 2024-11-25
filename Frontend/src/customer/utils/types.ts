export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  point: Int16Array;
  avatar: string;
  isGoogleAccount: boolean;
  //   password: string;
  //   created_at: string;
  //   updated_at: string;
  //   picture_url: string | null;
}

export interface Feedback {
  id: number;
  branch_rating: number;
  branch_feedback: string;
  employee_rating: number;
  employee_feedback: string;
  overall_rating: number;
  suggestion: string;
  appointment_id: number;
  created_at: string;
  updated_at: string;
  // Thêm các trường khác nếu cần
}

export interface Service {
  id: number;
  name: string;
  price: number;
  estimatedTime: string;
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

export interface MyAppointment {
  id: number;
  title: string;
  date: string;
  start_time: string;
  estimated_end_time: string;
  final_price: number;
  status: string;
  user: User;
  service: Service;
  branch: Branch;
  feedback: Feedback | null;
  employee: Employee | null;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  overall_rating: number;
  number_of_ratings: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  picture_url: string | null;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: boolean;
  picture_url: string | null;
  user: User;
  employees: Employee[];
  appointments: Appointment[];
  // Thêm các trường khác nếu cần
}
