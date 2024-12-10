import { useEffect, useState } from "react";
import { AppointmentStat, CustomerStat, NewCustomerStat } from "../../utils/types";
import ReactApexChart from "react-apexcharts";
import { fetchStatistic } from "../../services/statisticService";
import { formatMoney } from "../../utils/helpers";

const StatisticReport: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 1000 * 24 * 60 * 60 * 7));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [appointmentStats, setAppointmentStats] = useState<AppointmentStat[]>([]);
    const [customerStats, setCustomerStats] = useState<CustomerStat[]>([]);
    const [newCustomerStats, setNewCustomerStats] = useState<NewCustomerStat[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Load statistics
                const response = await fetchStatistic({
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    group_by: 'day',
                });
                const filledData = fillMissingDates(response.appointment, startDate.toISOString(), endDate.toISOString());
                setAppointmentStats(filledData);
                setCustomerStats(response.customer || []);
                setNewCustomerStats(response.new_customer || []);
                console.log(filledData);
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const fillMissingDates = (data: AppointmentStat[], startDate: string, endDate: string) => {
      const filledData: AppointmentStat[] = [];
      let currentDate = new Date(startDate);
      const finalDate = new Date(endDate);
    
      while (currentDate <= finalDate) {
        const existing = data.find((d) => d.appointment_date && new Date(d.appointment_date).getDate() === currentDate.getDate());
        filledData.push({
          appointment_date: currentDate.toISOString(),
          total_revenue: existing ? existing.total_revenue : 0,
          number_of_appointments: existing ? existing.number_of_appointments : 0,
          employee_id: 0,
          employee_name: "",
          branch_id: 0,
          branch_name: ""
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
                name: 'Doanh thu',
                data: appointmentStats.map((item) => item.total_revenue)
            }
        ],
        xaxis: {
            categories: appointmentStats.map((item) => new Date(item.appointment_date).toLocaleDateString(
                'vi-VN', { day: '2-digit' }
            ))
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
          padding: {
            left: 2,
            right: 2,
            top: 0
          },
        },
    };

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
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Reports</h1>
                
                {/* Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Income */}
                    <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                        <h2 className="text-lg font-medium text-gray-800 mb-2">Total Income</h2>
                        <p className="text-2xl font-bold text-green-600">$8,750</p>
                        <p className="text-gray-500 text-sm mt-2">Compared to last week: <span className="text-green-500 font-medium">+10%</span></p>
                    </div>
                    {/* Total Guests */}
                    <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                        <h2 className="text-lg font-medium text-gray-800 mb-2">Total Guests</h2>
                        <p className="text-2xl font-bold text-blue-600">320</p>
                        <p className="text-gray-500 text-sm mt-2">Compared to last week: <span className="text-red-500 font-medium">-5%</span></p>
                    </div>
                    {/* New Customers */}
                    <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                        <h2 className="text-lg font-medium text-gray-800 mb-2">New Customers</h2>
                        <p className="text-2xl font-bold text-purple-600">45</p>
                        <p className="text-gray-500 text-sm mt-2">Compared to last week: <span className="text-green-500 font-medium">+12%</span></p>
                    </div>
                    {/* Average Appointment Value */}
                    <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                        <h2 className="text-lg font-medium text-gray-800 mb-2">Avg. Appointment Value</h2>
                        <p className="text-2xl font-bold text-yellow-600">$27.34</p>
                        <p className="text-gray-500 text-sm mt-2">Compared to last week: <span className="text-green-500 font-medium">+8%</span></p>
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
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Guests Over Time</h2>
                        <div className="h-64">
                            {/* Replace with a Chart.js or ApexCharts graph */}
                            <canvas id="guestsChart"></canvas>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default StatisticReport;