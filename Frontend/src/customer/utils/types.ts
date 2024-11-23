export interface User {
  name: string;
  email: string;
  phone: string;
  point: Int16Array;
  avatar: string;
  isGoogleAccount: boolean;
  gender: string;
  //   password: string;
  //   created_at: string;
  //   updated_at: string;
  //   picture_url: string | null;
}

export interface Feedback {
  id: number;
  message: string;
  date: string;
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

export interface Employee {
  id: number;
  email: string;
  password: string;
  google_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  picture_url: string | null;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  seats: number;
  facilities: string;
  // Thêm các trường khác nếu cần
}
