import { useState, useEffect } from "react";
import { fetchStatistic } from "../../services/statisticService";
import { AppointmentStat } from "../../utils/types";
import ReactApexChart from "react-apexcharts";
import { formatMoney } from "../../utils/helpers";

interface RevenueChartProps {
    title?: string;
}

interface DateRangeValue {
    startDate: Date;
    endDate: Date;
}

const groupby = ['day', 'month'];
const dayRange = ['7 Ngày', '14 Ngày'];
const monthRange = ['Tháng này', '3 tháng', '6 tháng', '12 tháng'];

const RevenueChart: React.FC<RevenueChartProps> = ({ title }) => {
    const [revenueStats, setRevenueStats] = useState<AppointmentStat[]>([]);
    const [revenueGroupBy, setRevenueGroupBy] = useState(groupby[0]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [dateRangeSelected, setDateRangeSelected] = useState(dayRange[0]);
    const [dateRangeValue, setDateRangeValue] = useState<DateRangeValue>({
        startDate: new Date(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).setHours(0,0,0,0)),
        endDate: new Date()
    });
    const [dateRangeOptions, setDateRangeOptions] = useState(dayRange);
    
    useEffect(() => {
        const loadRevenueStats = async () => {
          setLoading(true);
          try {
              const response = await fetchStatistic({
                start_date: dateRangeValue.startDate.toISOString(),
                end_date: dateRangeValue.endDate.toISOString(),
                group_by: revenueGroupBy,
                status: 'completed',
                group_by_service: true,
              });

              switch (revenueGroupBy) {
                case groupby[0]:
                    const filledData = fillMissingDates(
                        response.appointment, 
                        dateRangeValue.startDate.toISOString(), 
                        dateRangeValue.endDate.toISOString()
                    );
                    setRevenueStats(filledData);
                    break;
                case groupby[1]:
                    const filledDataMonth = fillMissingMonths(
                        response.appointment, 
                        dateRangeValue.startDate.toISOString(), 
                        dateRangeValue.endDate.toISOString()
                    );
                    setRevenueStats(filledDataMonth);
                    break;
              }
          } catch (err) {
              setError('Failed to fetch data.');
          } finally {
              setLoading(false);
          }
        }
        loadRevenueStats();
      }, [dateRangeValue]);

      useEffect(() => {
        const handleGroupByChange = () => {
            switch (revenueGroupBy) {
                case groupby[0]:
                    setDateRangeOptions(dayRange);
                    handleSelectChange(dayRange[0]);
                    
                    break;
                case groupby[1]:
                    setDateRangeOptions(monthRange);
                    handleSelectChange(monthRange[0]);
                    break;
            }
        }
        handleGroupByChange();
      }, [revenueGroupBy]);

      const getDateFormatter = (date: Date) => {
        switch (revenueGroupBy) {
            case groupby[0]:
                return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
            case groupby[1]:
                return date.toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' });
        }
      }

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
  
      const fillMissingMonths = (data: AppointmentStat[], startDate: string, endDate: string) => {
        const filledData: AppointmentStat[] = [];
        let currentDate = new Date(startDate);
        const finalDate = new Date(endDate);
      
        while (currentDate <= finalDate) {
          const existing = data.find((d) => Number(d.appointment_date) === currentDate.getMonth() + 1);
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
      
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      
        return filledData;
      }
  
    //   const fillMissingYears = (data: AppointmentStat[], startDate: string, endDate: string) => {
    //     const filledData: AppointmentStat[] = [];
    //     let currentDate = new Date(startDate);
    //     const finalDate = new Date(endDate);
      
    //     while (currentDate <= finalDate) {
    //       const existing = data.find((d) => Number(d.appointment_date) === currentDate.getFullYear());
    //       filledData.push({
    //         appointment_date: currentDate.toISOString(),
    //         total_revenue: existing ? existing.total_revenue : 0,
    //         average_revenue: existing ? existing.average_revenue : 0,
    //         number_of_appointments: existing ? existing.number_of_appointments : 0,
    //         employee_id: existing ? existing.employee_id : 0,
    //         employee_name: existing ? existing.employee_name : "",
    //         branch_id: existing ? existing.branch_id : 0,
    //         branch_name: existing ? existing.branch_name : "",
    //         service_id: existing ? existing.service_id : 0,
    //         service_title: existing ? existing.service_title : "",
    //       });
      
    //       currentDate.setFullYear(currentDate.getFullYear() + 1);
    //     }
      
    //     return filledData;
    //   }

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
                data: revenueStats.map((item) => item.total_revenue ?? null),
                color: "#1A56DB",
            },
            {
                name: 'Doanh thu trung bình trên lịch hẹn',
                data: revenueStats.map((item) => item.average_revenue ?? null),
                color: "#7E3BF2",
            }
        ],
        xaxis: {
            categories: revenueStats.map((item) => getDateFormatter(new Date(item.appointment_date)))
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

      const handleSelectChange = (value: string) => {
        setDateRangeSelected(value);
        switch (value) {
            case dayRange[0]:
                setDateRangeValue({ 
                    startDate: new Date(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).setHours(0,0,0,0)), 
                    endDate: new Date() });
                break;
            case dayRange[1]:
                setDateRangeValue({ 
                    startDate: new Date(new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).setHours(0,0,0,0)), 
                    endDate: new Date() });
                break;
            case monthRange[0]:
                setDateRangeValue({ startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), endDate: new Date() });
                break;
            case monthRange[1]:
                setDateRangeValue({ 
                    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1), 
                    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) });
                break;
            case monthRange[2]:
                setDateRangeValue({ 
                    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1), 
                    endDate: new Date() });
                break;
            case monthRange[3]:
                setDateRangeValue({ 
                    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1), 
                    endDate: new Date() });
                break;
        }
    }

    const chartWrapper = (children: any) => {
        return (
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <div className="flex flex-row justify-between">
                <h2 className="text-lg font-medium text-gray-800 mb-4">{title || "Employee Chart"}</h2>
                    <div className="grid grid-cols-2 gap-1">
                        <select
                        className="border border-gray-200 rounded p-2" 
                        value={dateRangeSelected}
                        onChange={(e) => {handleSelectChange(e.target.value)}}
                        >
                            {dateRangeOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                        <select
                        className="border border-gray-200 rounded p-2"
                        onChange={(e) => setRevenueGroupBy(e.target.value)}
                        >
                            <option value={groupby[0]}>Ngày</option>
                            <option value={groupby[1]}>Tháng</option>
                        </select>
                    </div>
                </div>
                {children}
            </div>
        )
    }

    if (loading) {
        return (
            chartWrapper(
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )
        );
    }

    if (error) {
        return chartWrapper(
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        chartWrapper(
            <ReactApexChart 
                options={revenueChartOptions} 
                series={revenueChartOptions.series}
                type="area"
                height={400}
            />
        )
    );
    
}

export default RevenueChart;