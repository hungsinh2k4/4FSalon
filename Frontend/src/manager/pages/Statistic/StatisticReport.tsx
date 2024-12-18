import { useEffect, useState } from "react";
import { AppointmentStat, CustomerStat, NewCustomerStat } from "../../utils/types";
import ReactApexChart from "react-apexcharts";
import { fetchStatistic } from "../../services/statisticService";
import { formatMoney } from "../../utils/helpers";

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

    const [appointmentStats, setAppointmentStats] = useState<AppointmentStat[]>([]);
    const [customerStats, setCustomerStats] = useState<CustomerStat[]>([]);
    const [newCustomerStats, setNewCustomerStats] = useState<NewCustomerStat[]>([]);

    const [branchStats, setBranchStats] = useState<AppointmentStat[]>([]);
    const [serviceStats, setServiceStats] = useState<AppointmentStat[]>([]);
    const [employeeStats, setEmployeeStats] = useState<AppointmentStat[]>([]);

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
                setAppointmentStats(appointmentFilledData);
                setCustomerStats(response.customer || []);
                setNewCustomerStats(newCustomerFilledData);

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

        const loadBranchStats = async () => {
            setLoading(true);
            try {
                const response = await fetchStatistic({
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    group_by: group_by,
                    status: 'completed',
                    group_by_branch: true,
                });
                console.log("response", response);
                const filledData = fillMissingDates(response.appointment, startDate.toISOString(), endDate.toISOString());
                console.log("filledData", filledData);
                setBranchStats(filledData);
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
          }

        const loadServiceStats = async () => {
            setLoading(true);
            try {
                const response = await fetchStatistic({
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    group_by: group_by,
                    status: 'completed',
                    group_by_service: true,
                });
                const filledData = fillMissingDates(response.appointment, startDate.toISOString(), endDate.toISOString());
                setServiceStats(filledData);
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        }

        loadData();
        loadBranchStats();
        loadServiceStats();
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

    const revenueChartOptions = {
      chart: {
        height: "100%",
        maxWidth: "100%",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      series: [
          {
              name: 'Doanh thu tổng',
              data: appointmentStats.slice().map((item) => item.total_revenue ?? null),
              color: "#1A56DB",
          },
          {
              name: 'Doanh thu trung bình trên lịch hẹn',
              data: appointmentStats.map((item) => item.average_revenue ?? null),
              color: "#7E3BF2",
          }
      ],
      xaxis: {
          categories: appointmentStats.map((item) => item.appointment_date && new Date(item.appointment_date).toLocaleDateString(
              'vi-VN', { day: 'numeric', month: 'numeric' }
          ))
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return formatMoney(value);
          }
        },
        axisBorder: {
          show: true,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
      },
    };

    const guestChartOptions = {
      chart: {
        height: "100%",
        maxWidth: "100%",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      series: [
          {
              name: 'Người dùng',
              data: newCustomerStats.map((item) => item.number_of_customers_user ?? null)
          }
      ],
      xaxis: {
          categories: newCustomerStats.map((item) => item.created_at && new Date(item.created_at).toLocaleDateString(
              'vi-VN', { day: '2-digit' }
          ))
      },
      yaxis: {
        axisBorder: {
          show: true,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
      },
    }

    const branchChartOptions = {
      chart: {
        type: 'bar' as const,
        width: "100%",
        height: 400,
        toolbar: {
          show: false,
        }
      },
      series: branchStats.filter((value, index, self) => self.findIndex((t) => (
          t.branch_id === value.branch_id && t.branch_name !== ""
      )) === index).map((branch) => {
          const data = branchStats.filter((item) => item.branch_id === branch.branch_id);
          return {
              name: branch.branch_name,
              data: data.map((item) => item.total_revenue ?? null)
          }
      }),
      xaxis: {
        categories: appointmentStats.map((item) => new Date(item.appointment_date).toLocaleDateString(
            'vi-VN', { day: 'numeric' }
        )),
        floating: false,
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
          }
        },
      },
      yaxis: {
        show: true,
        labels: {
          formatter: function (value: number) {
            return formatMoney(value);
          }
        },
        axisBorder: {
          show: true,
        },
      },
      fill: {
        opacity: 1,
      },
      dataLabels: {
        enabled: false,
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'medium',
          colors: ['#304758']
        },
      },
      stroke: {
        show: true,
        width: 0,
        colors: ["transparent"],
      },
      grid: {
        show: false,
        strokeDashArray: 4,
      },
      plotOptions: {
        bar: {
          columnWidth: "80%",
          borderRadiusApplication: "end" as const,
          borderRadius: 2,
          dataLabels: {
            position: "top",
          },
        },
      },
      states: {
        hover: {
          filter: {
            type: "darken",
            value: 1,
          },
        },
      },
      legend: {
        show: true,
        position: "bottom" as const,
      },
    }

    const serviceChartOptions = {
      chart: {
        sparkline: {
          enabled: false,
        },
        type: "bar" as const,
        width: "100%",
        height: 400,
        toolbar: {
          show: false,
        }
      },
      series: serviceStats.filter((value, index, self) => self.findIndex((t) => (
          t.service_id === value.service_id && t.service_title !== ""
      )) === index).map((service) => {
          const data = serviceStats.filter((item) => item.service_id === service.service_id);
          return {
              name: service.service_title,
              data: data.map((item) => item.number_of_appointments ?? null)
          }
      }),
      xaxis: {
        categories: appointmentStats.map((item) => new Date(item.appointment_date).toLocaleDateString(
            'vi-VN', { day: 'numeric', month: 'numeric' }
        )),
        floating: false,
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
          },
        },
        formatter: function (value: string) {
          return Number(value).toFixed(1) + "lịch hẹn";
        }
      },
      yaxis: {
        show: true,
        axisBorder: {
          show: true,
        },
      },
      fill: {
        opacity: 1,
      },
      dataLabels: {
        enabled: false,
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'medium',
          colors: ['#304758']
        },
      },
      stroke: {
        show: true,
        width: 0,
        colors: ["transparent"],
      },
      grid: {
        show: false,
        strokeDashArray: 4,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "100%",
          borderRadiusApplication: "end" as const,
          borderRadius: 2,
          dataLabels: {
            position: "top",
          },
        },
      },
      legend: {
        show: true,
        position: "bottom" as const,
      },
    }

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
            {/* Income Graph */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
              <div className="flex flex-row justify-between">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Doanh thu</h2>
                <select
                  className="border border-gray-200 rounded p-2"
                  value={startDate.toISOString()}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />
              </div>
                <ReactApexChart 
                options={revenueChartOptions} 
                series={revenueChartOptions.series}
                type="area" />
            </div>
            {/* Guests Graph */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Người dùng mới theo thời gian</h2>
                
                <ReactApexChart 
                  options={guestChartOptions} 
                  series={guestChartOptions.series}
                  type="area" 
                />
            </div>
        </div>

        {/* Graph Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Graph */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
              <div className="flex flex-row justify-between">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Doanh thu theo chi nhánh</h2>
                <select
                  className="border border-gray-200 rounded p-2"
                  value={startDate.toISOString()}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />
              </div>
                <ReactApexChart 
                options={branchChartOptions} 
                series={branchChartOptions.series}
                type="bar" />
            </div>
            {/* Guests Graph */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Dịch vụ được sử dụng</h2>
                
                <ReactApexChart 
                  options={serviceChartOptions} 
                  series={serviceChartOptions.series}
                  type="bar" 
                />
            </div>
        </div>
      </div>
    </div>
    );
}

export default StatisticReport;