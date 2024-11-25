import React, { useState } from "react";
import axios from "axios";
import { Appointment } from "../../utils/types";

const [appointmentData, setAppointmentData] = useState<Partial<Appointment>>(
  {
    
  }
);
