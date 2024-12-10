// src/manager/pages/Dashboard/DashboardHome.tsx
import React, { useEffect, useState } from 'react';
import AppointmentsTable from '../../components/tables/AppointmentsTable';
import { Appointment, AppointmentStat, CustomerStat, NewCustomerStat, Statistic } from '../../utils/types';
import { fetchAppointments, fetchAppointmentsWithParams } from '../../services/appointmentService';
import { fetchStatistic } from '../../services/statisticService';
import { useNavigate } from 'react-router-dom';

interface StatsQuery {
  start_date: Date;
  end_date: Date;
  branch_id: number;
  status: string;
  not_status: string;
  group_by: string;
}


const DashboardHome: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();
  const [statistic, setStatistic] = useState<Statistic>();
  const [appointmentStats, setAppointmentStats] = useState<AppointmentStat[]>([]);
  const [customerStats, setCustomerStats] = useState<CustomerStat[]>([]);
  const [newCustomerStats, setNewCustomerStats] = useState<NewCustomerStat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load appointments
        const response = await fetchAppointmentsWithParams({ 
          date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
          have_feedback: false,
          take: 10,
          order: 'desc',
        });
        setAppointments(response);
        console.log(response);

        // Load statistics
        const response2 = await fetchStatistic(
          {
            start_date: new Date(Date.now() - 1000 * 24 * 60 * 60).toISOString(),
            end_date: new Date().toISOString(),
            status: 'completed',
            group_by: 'day',
          }
        );
        setStatistic(response2);
        console.log(response2);
        setAppointmentStats(response2.appointment);
        setCustomerStats(response2.customer || []);
        setNewCustomerStats(response2.new_customer || []);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white"
                onClick={handleViewStatistics}
              >
                  <h2 className="text-lg font-medium text-gray-800 mb-2"> Doanh thu hôm nay</h2>
                  <p className="text-2xl font-bold text-green-600">{appointmentStats[0] && appointmentStats[0].total_revenue || '0'}</p>
                  <p className="text-gray-500 text-sm mt-2">So với hôm qua: <span className="text-green-500 font-medium">
                    {appointmentStats[0] && appointmentStats[1] && 
                    
                    typeof appointmentStats[0].total_revenue === 'number' && 
                    typeof appointmentStats[1].total_revenue === 'number' && 
                    ((appointmentStats[0].total_revenue - appointmentStats[1].total_revenue) / appointmentStats[1].total_revenue) * 100}%
                  </span></p>
              </div>
              {/* Total Guests */}
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Số lịch hẹn hôm nay</h2>
                  <p className="text-2xl font-bold text-blue-600">{appointmentStats[0] && appointmentStats[0].number_of_appointments || '0'}</p>
                  <p className="text-gray-500 text-sm mt-2">So với hôm qua: <span className="font-medium">
                    {appointmentStats[1] && appointmentStats[1].number_of_appointments || '0'} 
                  </span></p>
              </div>
              {/* New Customers */}
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Khách hàng mới</h2>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                  <p className="text-gray-500 text-sm mt-2">So với hôm qua: <span className="text-green-500 font-medium">+3</span></p>
              </div>
              {/* Near Appointments Count */}
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Lịch hẹn gần</h2>
                  <p className="text-2xl font-bold text-yellow-600">5</p>
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
  