// src/manager/pages/Dashboard/DashboardHome.tsx
import React, { useEffect, useState } from 'react';
import AppointmentsTable from '../../components/tables/AppointmentsTable';
import { Appointment, AppointmentStat, NewCustomerStat } from '../../utils/types';
import { fetchAppointmentsWithParams } from '../../services/appointmentService';
import { fetchStatistic } from '../../services/statisticService';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../../utils/helpers';

interface ComparedToYesterday {
  comparedToYesterday: number;
}

interface TotalGuests extends ComparedToYesterday {
  totalGuests: number;
}

interface TotalRevenue extends ComparedToYesterday {
  totalRevenue: number;
}

interface NewCustomers extends ComparedToYesterday {
  newCustomers: number;
}


const DashboardHome: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();
  const [totalRevenue, setTotalRevenue] = useState<TotalRevenue>({ totalRevenue: 0, comparedToYesterday: 0 });
  const [totalGuests, setTotalGuests] = useState<TotalGuests>({ totalGuests: 0, comparedToYesterday: 0 });
  const [newCustomers, setNewCustomers] = useState<NewCustomers>({ newCustomers: 0, comparedToYesterday: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load appointments
        const response = await fetchAppointmentsWithParams({ 
          date: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          have_feedback: false,
          take: 20,
          order: 'desc',
        });
        setAppointments(response);
        console.log(response);

        // Load statistics
        const yesterday = new Date(new Date(Date.now() - 1000 * 24 * 60 * 60).setHours(0, 0, 0, 0));
        const today = new Date();
        const response2 = await fetchStatistic(
          {
            start_date: yesterday.toISOString(),
            end_date: today.toISOString(),
            status: 'completed',
            group_by: 'day',
            new_customer: true,
            new_customer_group_by: 'day',
          }
        );
        console.log(response2);
        const filledData = fillMissingDates(response2.appointment, yesterday, today);
        const filledDataNewCustomers = fillMissingDatesNewCustomers(response2.new_customer || [], yesterday, today);
        setTotalRevenue({ 
          totalRevenue: filledData[1].total_revenue, 
          comparedToYesterday: filledData[0].total_revenue !== 0 ? Math.round((filledData[1].total_revenue - filledData[0].total_revenue) / filledData[0].total_revenue * 100) : 0 
        });
        setTotalGuests({ 
          totalGuests: filledData[1].number_of_appointments,
          comparedToYesterday: filledData[0].number_of_appointments !== 0 ? Math.round((filledData[1].number_of_appointments - filledData[0].number_of_appointments) / filledData[0].number_of_appointments * 100) : 0
        });
        setNewCustomers({ 
          newCustomers: filledDataNewCustomers[1].number_of_customers_user,
          comparedToYesterday: filledDataNewCustomers[0].number_of_customers_user !== 0 ? Math.round((filledDataNewCustomers[1].number_of_customers_user - filledDataNewCustomers[0].number_of_customers_user) / filledDataNewCustomers[0].number_of_customers_user * 100) : 0
        });

      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fillMissingDates = (data: AppointmentStat[], startDate: Date, endDate: Date) => {
    const filledData: AppointmentStat[] = [];
      let currentDate = new Date(startDate);
      const finalDate = new Date(endDate);
    
      while (currentDate <= finalDate) {
        const existing = data.find((d) => d.appointment_date && new Date(d.appointment_date).getDate() === currentDate.getDate());
        filledData.push({
          appointment_date: currentDate.toISOString(),
          total_revenue: existing ? existing.total_revenue : 0,
          average_revenue: existing ? existing.average_revenue : 0,
          number_of_appointments: existing ? existing.number_of_appointments : 0,
          employee_id: existing ? existing.employee_id : 0,
          employee_name: existing ? existing.employee_name : "",
          branch_id: existing ? existing.branch_id : 0,
          branch_name: existing ? existing.branch_name : "",
          service_id: existing ? existing.service_id : 0,
          service_title: existing ? existing.service_title : "",
        });
    
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return filledData;
  };

  const fillMissingDatesNewCustomers = (data: NewCustomerStat[], startDate: Date, endDate: Date) => {
    const filledData: NewCustomerStat[] = [];
      let currentDate = new Date(startDate);
      const finalDate = new Date(endDate);
    
      while (currentDate <= finalDate) {
        const existing = data.find((d) => d.created_at && new Date(d.created_at).getDate() === currentDate.getDate());
        filledData.push({
          created_at: currentDate.toISOString(),
          number_of_customers_user: existing ? existing.number_of_customers_user : 0,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    return filledData;
  };

  const comparedToYesterday = (input: ComparedToYesterday) => {
    if (input.comparedToYesterday > 0) {
      return (
        <span className="text-green-500 font-medium">
          +{input.comparedToYesterday}%
        </span>
      )
    }
    return (
      <span className="text-red-500 font-medium">
        {input.comparedToYesterday}%
      </span>
    )
  }

  const handleViewStatistics = () => {
    navigate(`/manager/statistics`);
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col bg-white p-5 rounded-lg overflow-y-auto h-full shadow-md">
      <div className="container mx-auto p-6">
          {/* Dashboard Header */}
          
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Income Today */}
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                  <h2 className="text-lg font-medium text-gray-800 mb-2"> Doanh thu hôm nay</h2>
                  <p className="text-2xl font-bold text-green-600">{formatMoney(totalRevenue.totalRevenue)}</p>
                  <p className="text-gray-500 text-sm mt-2">So với hôm qua: {comparedToYesterday(totalRevenue)}</p>
              </div>
              {/* Total Guests */}
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Số lịch hẹn hôm nay</h2>
                  <p className="text-2xl font-bold text-blue-600">{totalGuests.totalGuests}</p>
                  <p className="text-gray-500 text-sm mt-2">So với hôm qua: {comparedToYesterday(totalGuests)}</p>
              </div>
              {/* New Customers */}
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Khách hàng mới</h2>
                  <p className="text-2xl font-bold text-purple-600">{newCustomers.newCustomers}</p>
                  <p className="text-gray-500 text-sm mt-2">So với hôm qua: {comparedToYesterday(newCustomers)}</p>
              </div>
              {/* Near Appointments Count */}
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Lịch hẹn gần</h2>
                  <p className="text-2xl font-bold text-yellow-600">{appointments.length}</p>
                  <p className="text-gray-500 text-sm mt-2">Trong giờ tiếp theo.</p>
              </div>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-fit" onClick={handleViewStatistics}>Xem thống kê</button>
          </div>
          {/* Upcoming Appointments */}
          <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lịch hẹn sắp tới</h2>
              <div className="overflow-x-auto">
                  <AppointmentsTable 
                      appointments={appointments} 
                      onDelete={() => {}} 
                      onEdit={() => {}} 
                  />
              </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardHome;