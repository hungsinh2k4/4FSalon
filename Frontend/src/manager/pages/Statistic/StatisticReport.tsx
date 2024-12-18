import { useEffect, useState } from "react";
import { AppointmentStat, CustomerStat, NewCustomerStat } from "../../utils/types";
import { fetchStatistic } from "../../services/statisticService";
import { formatMoney } from "../../utils/helpers";
import BranchChart from "./BranchChart";
import ServiceChart from "./ServiceChart";
import EmployeeChart from "./EmployeeChart";
import RevenueChart from "./RevenueChart";
import UserChart from "./UserChart";

enum GroupBy {
    Day = 'day',
    Month = 'month',
    Year = 'year'
}

interface ComparedToLastWeek {
  comparedToLastWeek: number;
}

interface TotalGuests extends ComparedToLastWeek {
  totalGuests: number;
}

interface TotalRevenue extends ComparedToLastWeek {
  totalRevenue: number;
}

interface NewCustomers extends ComparedToLastWeek {
  newCustomers: number;
}

interface AvgAppointmentRevenue extends ComparedToLastWeek {
  avgAppointmentRevenue: number;
}

const StatisticReport: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 1000 * 24 * 60 * 60 * 13));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [group_by, setGroupBy] = useState<string>(GroupBy.Day);
   
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalRevenue, setTotalRevenue] = useState<TotalRevenue>({ totalRevenue: 0, comparedToLastWeek: 0 });
    const [totalAppointments, setTotalAppointments] = useState<TotalGuests>({ totalGuests: 0, comparedToLastWeek: 0 });
    const [newCustomers, setNewCustomers] = useState<NewCustomers>({ newCustomers: 0, comparedToLastWeek: 0 });
    const [avgAppointmentRevenue, setAvgAppointmentRevenue] = useState<AvgAppointmentRevenue>({ avgAppointmentRevenue: 0, comparedToLastWeek: 0 });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Load statistics
                const response = await fetchStatistic({
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    group_by: group_by,
                    status: 'completed',
                    new_customer: true,
                    new_customer_group_by: group_by,
                    customer: true,
                });
                const appointmentFilledData = fillMissingDates(response.appointment, startDate.toISOString(), endDate.toISOString());
                const newCustomerFilledData = fillMissingDatesNewCustomers(response.new_customer || [], startDate.toISOString(), endDate.toISOString());

                console.log("appointmentFilledData", appointmentFilledData);


                // Calculate total revenue
                const totalRevenue = appointmentFilledData
                .slice(7, 14)
                .reduce((total, item) => total + Number(item.total_revenue), 0);
                const totalRevenueLastWeek = appointmentFilledData
                .slice(0, 7)
                .reduce((total, item) => total + Number(item.total_revenue), 0);
                setTotalRevenue({ totalRevenue, comparedToLastWeek: Math.round((totalRevenue - totalRevenueLastWeek)/totalRevenueLastWeek * 100) });

                // Calculate total appointments
                const totalAppointments = appointmentFilledData
                  .slice(7, 14)
                  .reduce((total, item) => total + Number(item.number_of_appointments), 0);
                const totalAppointmentsLastWeek = appointmentFilledData
                  .slice(0, 7)
                  .reduce((total, item) => total + Number(item.number_of_appointments), 0);
                setTotalAppointments({ totalGuests: totalAppointments, comparedToLastWeek: totalAppointments - totalAppointmentsLastWeek });

                // Calculate new customers
                const newCustomers = newCustomerFilledData
                  .slice(7, 14)
                  .reduce((total, item) => total + Number(item.number_of_customers_user), 0);
                const newCustomersLastWeek = newCustomerFilledData
                  .slice(0, 7)
                  .reduce((total, item) => total + Number(item.number_of_customers_user), 0);
                setNewCustomers({ newCustomers, comparedToLastWeek: newCustomers - newCustomersLastWeek });

                // Calculate average appointment revenue
                const avgAppointmentRevenue = Math.round(totalRevenue / totalAppointments);

                const avgAppointmentRevenueLastWeek = Math.round(totalRevenueLastWeek / totalAppointmentsLastWeek);

                setAvgAppointmentRevenue({ 
                  avgAppointmentRevenue, 
                  comparedToLastWeek: Math.round((avgAppointmentRevenue - avgAppointmentRevenueLastWeek) / avgAppointmentRevenueLastWeek * 100) });
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [group_by]); 

    const fillMissingDates = (data: AppointmentStat[], startDate: string, endDate: string) => {
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

    const fillMissingDatesNewCustomers = (data: NewCustomerStat[], startDate: string, endDate: string) => {
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

    const comparedToLastWeek = (input: ComparedToLastWeek) => {
      if (input.comparedToLastWeek > 0) {
        return (
          <span className="text-green-500 font-medium">
            +{input.comparedToLastWeek}%
          </span>
        )
      }
      return (
        <span className="text-red-500 font-medium">
          {input.comparedToLastWeek}%
        </span>
      )
    }


    if (loading) {
      return <p>Loading...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }
    
	return (
		<div>
			<div className="container mx-auto p-6">
        {/* Page Header */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Thống kê chung</h1>
        
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Income */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Tổng doanh thu</h2>
                <p className="text-2xl font-bold text-green-600">{formatMoney(totalRevenue.totalRevenue)}</p>
                <p className="text-gray-500 text-sm mt-2">So với tuần trước: {comparedToLastWeek(totalRevenue)}</p>
            </div>
            {/* Total Guests */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Tổng lịch hẹn hoàn thành</h2>
                <p className="text-2xl font-bold text-blue-600">{totalAppointments.totalGuests}</p>
                <p className="text-gray-500 text-sm mt-2">So với tuần trước: {comparedToLastWeek(totalAppointments)}</p>
            </div>
            {/* New Customers */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Khách hàng mới</h2>
                <p className="text-2xl font-bold text-purple-600">{newCustomers.newCustomers}</p>
                <p className="text-gray-500 text-sm mt-2">So với tuần trước: {comparedToLastWeek(newCustomers)}</p>
            </div>
            {/* Average Appointment Value */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Avg. Appointment Value</h2>
                <p className="text-2xl font-bold text-yellow-600">{formatMoney(avgAppointmentRevenue.avgAppointmentRevenue)}</p>
                <p className="text-gray-500 text-sm mt-2">Compared to last week: {comparedToLastWeek(avgAppointmentRevenue)}</p>
            </div>
        </div>

        {/* Graph Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart title="Doanh thu"/>
            <UserChart title="Người dùng"/>
        </div>

        {/* Graph Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BranchChart title="Doanh thu theo chi nhánh"/>
            <ServiceChart title="Dịch vụ phổ biến" />
        </div>
        <div className="mt-8">
          <EmployeeChart title="Nhân viên được đặt lịch"/>
        </div>
      </div>
    </div>
    );
}

export default StatisticReport;