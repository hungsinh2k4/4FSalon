import React, { useState, useEffect } from "react";
import { fetchStatistic } from "../../services/statisticService";
import { AppointmentStat } from "../../utils/types";
import ReactApexChart from "react-apexcharts";

interface EmployeeChartProps {
    title?: string;
}

interface DateRangeValue {
    startDate: Date;
    endDate: Date;
}

const groupby = ['day', 'month'];
const dayRange = ['7 Ngày', '14 Ngày'];
const monthRange = ['Tháng này', '3 tháng', '6 tháng', '12 tháng'];

const EmployeeChart: React.FC<EmployeeChartProps> = ({ title }) => {
    const [employeeFilledData, setEmployeeFilledData] = useState<AppointmentStat[]>([]);
    const [employeeGroupBy, setEmployeeGroupBy] = useState(groupby[0]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [dateRangeSelected, setDateRangeSelected] = useState(dayRange[0]);
    const [dateRangeValue, setDateRangeValue] = useState<DateRangeValue>({ 
        startDate: new Date(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).setHours(0,0,0,0)), 
        endDate: new Date() 
    });
    const [dateRangeOptions, setDateRangeOptions] = useState(dayRange);
    
    useEffect(() => {
        const loadEmployeeStats = async () => {
          setLoading(true);
          console.log(dateRangeValue.startDate.toLocaleDateString());

          try {
              const response = await fetchStatistic({
                start_date: dateRangeValue.startDate.toISOString(),
                end_date: dateRangeValue.endDate.toISOString(),
                group_by: employeeGroupBy,
                status: 'completed',
                group_by_employee: true,
              });

              switch (employeeGroupBy) {
                case groupby[0]:
                    const filledData = fillMissingDateEmployee(
                        response.appointment, 
                        dateRangeValue.startDate.toISOString(),
                        dateRangeValue.endDate.toISOString(),
                    );
                    setEmployeeFilledData(filledData);
                    break;
                case groupby[1]:
                    const filledDataMonth = fillMissingMonthEmployee(
                        response.appointment, 
                        dateRangeValue.startDate.toISOString(),
                        dateRangeValue.endDate.toISOString(),
                    );
                    setEmployeeFilledData(filledDataMonth);
                    break;
              }
          } catch (err) {
              setError('Failed to fetch data.');
          } finally {
              setLoading(false);
          }
        }
        loadEmployeeStats();
      }, [dateRangeValue]);

      useEffect(() => {
        const handleGroupByChange = () => {
            switch (employeeGroupBy) {
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
      }, [employeeGroupBy]);

      const getDateFormatter = (date: Date) => {
        switch (employeeGroupBy) {
            case groupby[0]:
                return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
            case groupby[1]:
                return date.toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' });
        }
      }

      const fillMissingDateEmployee = (data: AppointmentStat[], startDate: string, endDate: string) => {
        const filledData: AppointmentStat[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const employeeIds = Array.from(new Set(data.map((item) => item.employee_id)));
        const employeeNames = new Map(data.map((item) => [item.employee_id, item.employee_name]));
        
        const dataMap = new Map<string, AppointmentStat>();
        data.forEach((item) => {
            const date = new Date(new Date(item.appointment_date).setHours(0,0,0,0));
        const key = `${item.employee_id}-${item.employee_name}-${date.toISOString()}`;
        dataMap.set(key, item);
        });
        
        const allDates: string[] = [];
        let currentDate = new Date(new Date(start).setHours(0,0,0,0));
        while (currentDate <= end) {
        allDates.push(currentDate.toISOString()); 
        currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Fill missing dates for each employee
        for (const employeeId of employeeIds) {
        for (const date of allDates) {
            const key = `${employeeId}-${employeeNames.get(employeeId)}-${date}`;
            if (dataMap.has(key)) {
            // Use existing data
            const item = dataMap.get(key)!;
            filledData.push({
                ...item, appointment_date: new Date(date).toISOString()
            });
            } else {
            // Insert default data for missing entries
            filledData.push({
            employee_id: employeeId,
            appointment_date: date,
            total_revenue: 0,
            average_revenue: 0,
            number_of_appointments: 0,
            employee_name: employeeNames.get(employeeId) || "",
            branch_id: 0,
            branch_name: "",
            service_id: 0,
            service_title: "",
            });
            }
        }
        }
        
        return filledData;
      }

      const fillMissingMonthEmployee = (data: AppointmentStat[], startDate: string, endDate: string) => {
        const filledData: AppointmentStat[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const employeeIds = Array.from(new Set(data.map((item) => item.employee_id)));
        const employeeNames = new Map(data.map((item) => [item.employee_id, item.employee_name]));
        
        const dataMap = new Map<string, AppointmentStat>();
        data.forEach((item) => {
            const key = `${item.employee_id}-${item.employee_name}-${item.appointment_date}`;
            dataMap.set(key, item);
        });
        console.log(dataMap);
        
        const allDates: string[] = [];
        let currentDate = new Date(new Date(start).setHours(0,0,0,0));
        while (currentDate <= end) {
            allDates.push(currentDate.toISOString()); 
            currentDate.setMonth(currentDate.getMonth()+ 1);
        }
        
        // Fill missing dates for each employee
        for (const employeeId of employeeIds) {
        for (const date of allDates) {
            const key = `${employeeId}-${employeeNames.get(employeeId)}-${new Date(date).getMonth() + 1}`;

            if (dataMap.has(key)) {
            // Use existing data
                const item = dataMap.get(key)!;
                filledData.push({
                    ...item, appointment_date: new Date(date).toISOString()
                });
            } else {
            // Insert default data for missing entries
                filledData.push({
                    employee_id: employeeId,
                    appointment_date: new Date(date).toISOString(),
                    total_revenue: 0,
                    average_revenue: 0,
                    number_of_appointments: 0,
                    employee_name: employeeNames.get(employeeId) || "",
                    branch_id: 0,
                    branch_name: "",
                    service_id: 0,
                    service_title: "",
                });
            }
        }
        }
        
        return filledData;
      }

      const employeeChartOptions = {
        chart: {
          type: 'bar' as const,
          width: "100%",
          height: 400,
          toolbar: {
            show: false,
          }
        },
        
        series: employeeFilledData.filter((value, index, self) => self.findIndex((t) => (
            t.employee_id === value.employee_id && t.employee_name !== ""
        )) === index).map((employee) => {
            const data = employeeFilledData.filter((item) => item.employee_id === employee.employee_id);
            return {
                name: employee.employee_name,
                data: data.map((item) => item.number_of_appointments ?? null)
            }
        }),
        xaxis: {
          categories: employeeFilledData.filter((value, index, self) => self.findIndex((t) => (
              t.appointment_date === value.appointment_date
          )) === index).map((item) => getDateFormatter(new Date(item.appointment_date))),
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
          labels: {
            formatter: function (value: number) {
              return Number(value).toFixed(0) + " lịch hẹn";
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
                        onChange={(e) => setEmployeeGroupBy(e.target.value)}
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
        return (
            chartWrapper(
                <div className="flex justify-center items-center h-64">
                    <p className="text-red-500">{error}</p>
                </div>
            )
        );
    }

    return (
        chartWrapper(
            <ReactApexChart 
                options={employeeChartOptions} 
                series={employeeChartOptions.series}
                type="bar"
                height={400}
            />
        )
    );
    
}

export default EmployeeChart;