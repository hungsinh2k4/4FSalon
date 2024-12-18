import { useState, useEffect } from "react";
import { fetchStatistic } from "../../services/statisticService";
import { AppointmentStat } from "../../utils/types";
import ReactApexChart from "react-apexcharts";

interface ServiceChartProps {
    title?: string;
}

interface DateRangeValue {
    startDate: Date;
    endDate: Date;
}

const groupby = ['day', 'month'];
const dayRange = ['7 Ngày', '14 Ngày'];
const monthRange = ['Tháng này', '3 tháng', '6 tháng', '12 tháng'];

const ServiceChart: React.FC<ServiceChartProps> = ({ title }) => {
    const [serviceStats, setServiceStats] = useState<AppointmentStat[]>([]);
    const [serviceGroupBy, setServiceGroupBy] = useState(groupby[0]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [dateRangeSelected, setDateRangeSelected] = useState(dayRange[0]);
    const [dateRangeValue, setDateRangeValue] = useState<DateRangeValue>({
        startDate: new Date(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).setHours(0,0,0,0)),
        endDate: new Date()
    });
    const [dateRangeOptions, setDateRangeOptions] = useState(dayRange);
    
    useEffect(() => {
        const loadBranchStats = async () => {
          setLoading(true);
          try {
              const response = await fetchStatistic({
                start_date: dateRangeValue.startDate.toISOString(),
                end_date: dateRangeValue.endDate.toISOString(),
                group_by: serviceGroupBy,
                status: 'completed',
                group_by_service: true,
              });

              switch (serviceGroupBy) {
                case groupby[0]:
                    const filledData = fillMissingDateService(
                        response.appointment, 
                        dateRangeValue.startDate.toISOString(), 
                        dateRangeValue.endDate.toISOString()
                    );
                    setServiceStats(filledData);
                    break;
                case groupby[1]:
                    const filledDataMonth = fillMissingMonthService(
                        response.appointment, 
                        dateRangeValue.startDate.toISOString(), 
                        dateRangeValue.endDate.toISOString()
                    );
                    setServiceStats(filledDataMonth);
                    break;
              }
          } catch (err) {
              setError('Failed to fetch data.');
          } finally {
              setLoading(false);
          }
        }
        loadBranchStats();
      }, [dateRangeValue]);

      useEffect(() => {
        const handleGroupByChange = () => {
            switch (serviceGroupBy) {
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
      }, [serviceGroupBy]);

      const getDateFormatter = (date: Date) => {
        switch (serviceGroupBy) {
            case groupby[0]:
                return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
            case groupby[1]:
                return date.toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' });
        }
      }

      const fillMissingDateService = (data: AppointmentStat[], startDate: string, endDate: string) => {
        const filledData: AppointmentStat[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const serviceIds = Array.from(new Set(data.map((item) => item.service_id)));
        const serviceTitles = new Map(data.map((item) => [item.service_id, item.service_title]));
        
        const dataMap = new Map<string, AppointmentStat>();
        data.forEach((item) => {
            const date = new Date(new Date(item.appointment_date).setHours(0,0,0,0));
        const key = `${item.service_id}-${item.service_title}-${date.toISOString()}`;
        dataMap.set(key, item);
        });
        
        const allDates: string[] = [];
        let currentDate = new Date(new Date(start).setHours(0,0,0,0));
        while (currentDate <= end) {
        allDates.push(currentDate.toISOString()); 
        currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Fill missing dates for each employee
        for (const serviceId of serviceIds) {
        for (const date of allDates) {
            const key = `${serviceId}-${serviceTitles.get(serviceId)}-${date}`;
            if (dataMap.has(key)) {
            // Use existing data
            const item = dataMap.get(key)!;
            filledData.push({
                ...item, appointment_date: new Date(date).toISOString()
            });
            } else {
            // Insert default data for missing entries
            filledData.push({
            employee_id: 0,
            appointment_date: date,
            total_revenue: 0,
            average_revenue: 0,
            number_of_appointments: 0,
            employee_name: "",
            branch_id: 0,
            branch_name: "",
            service_id: serviceId,
            service_title: serviceTitles.get(serviceId) || "",
            });
            }
        }
        }
        
        return filledData;
      }

      const fillMissingMonthService = (data: AppointmentStat[], startDate: string, endDate: string) => {
        const filledData: AppointmentStat[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const serviceIds = Array.from(new Set(data.map((item) => item.service_id)));
        const serviceTitles = new Map(data.map((item) => [item.service_id, item.service_title]));
        
        const dataMap = new Map<string, AppointmentStat>();
        data.forEach((item) => {
            const key = `${item.service_id}-${item.service_title}-${item.appointment_date}`;
            dataMap.set(key, item);
        });
        
        const allDates: string[] = [];
        let currentDate = new Date(new Date(start).setHours(0,0,0,0));
        while (currentDate <= end) {
            allDates.push(currentDate.toISOString()); 
            currentDate.setMonth(currentDate.getMonth()+ 1);
        }
        
        // Fill missing dates for each employee
        for (const serviceId of serviceIds) {
        for (const date of allDates) {
            const key = `${serviceId}-${serviceTitles.get(serviceId)}-${new Date(date).getMonth() + 1}`;

            if (dataMap.has(key)) {
            // Use existing data
                const item = dataMap.get(key)!;
                filledData.push({
                    ...item, appointment_date: new Date(date).toISOString()
                });
            } else {
            // Insert default data for missing entries
                filledData.push({
                    employee_id: 0,
                    appointment_date: new Date(date).toISOString(),
                    total_revenue: 0,
                    average_revenue: 0,
                    number_of_appointments: 0,
                    employee_name: "",
                    branch_id: 0,
                    branch_name: "",
                    service_id: serviceId,
                    service_title: serviceTitles.get(serviceId) || "",
                });
            }
        }
        }
        
        return filledData;
      }

      const serviceChartOptions = {
        chart: {
          sparkline: {
            enabled: false,
          },
          type: "bar" as const,
          width: "100%",
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
          categories: serviceStats.filter((value, index, self) => self.findIndex((t) => (
                t.appointment_date === value.appointment_date
            )) === index).map((item) => getDateFormatter(new Date(item.appointment_date))),
          floating: false,
          labels: {
            show: true,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
            },
            formatter: function (value: string) {
                return Number(value).toFixed(0) + " lịch hẹn";
            }
          },
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
                        onChange={(e) => setServiceGroupBy(e.target.value)}
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
                options={serviceChartOptions} 
                series={serviceChartOptions.series}
                type="bar"
                height={400}
            />
        )
    );
    
}

export default ServiceChart;