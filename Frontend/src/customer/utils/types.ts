export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  points: number;
  avatar_url: string;
  isGoogleAccount: boolean;
  gender: string;
  booking_count: number;
  cancel_count: number;
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

export interface Voucher {
  id: number;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  price_threshold: number;
  required_point: number;
  start_date: string;
  end_date: string;
  branch_id: number;
  updated_at: string;
  created_at: string;
  // Thêm các trường khác nếu cần
}

export interface Service {
  id: number;
  title: string;
  price: number;
  estimate_time: string;
  description: string;
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
  title: string;
  date: string;
  start_time: string;
  estimated_end_time: string;
  status: string;
  final_price: number;
  user_id: Number;
  service_id: Number;
  branch_id: Number;
  voucher_id: Number;
  employee_id: Number;
  // Thêm các trường khác nếu cần
}


export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_id: number;
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
  service?: Service;
  branch?: Branch;
  voucher?: Voucher;
  feedback: Feedback | null;
  employee?: Employee | null;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  start_time: string;
  estimated_end_time: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  work_position: string;
  overall_rating: number;
  number_of_ratings: number;
  status: boolean;
  branch_id: number;

  big_avatar_url: string;
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
  long: number;
  lat: number;
  user: User;
  employees: Employee[];
  appointments: Appointment[];
}

export interface Employee_date {
  start_time: Date;
  end_time: Date;
}
