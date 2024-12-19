import { useState, useEffect } from "react";
import { fetchStatistic } from "../../services/statisticService";
import { AppointmentStat } from "../../utils/types";
import ReactApexChart from "react-apexcharts";
import { formatMoney } from "../../utils/helpers";

interface BranchChartProps {
    title?: string;
}

interface DateRangeValue {
    startDate: Date;
    endDate: Date;
}

const groupby = ['day', 'month'];
const dayRange = ['7 Ngày', '14 Ngày'];
const monthRange = ['Tháng này', '3 tháng', '6 tháng', '12 tháng'];

const BranchChart: React.FC<BranchChartProps> = ({ title }) => {
    const [branchStats, setBranchStats] = useState<AppointmentStat[]>([]);
    const [branchGroupBy, setBranchGroupBy] = useState('day');

    const [dateRangeSelected, setDateRangeSelected] = useState(dayRange[0]);
    const [dateRangeValue, setDateRangeValue] = useState<DateRangeValue>({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
    });
    const [dateRangeOptions, setDateRangeOptions] = useState(dayRange);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadBranchStats = async () => {
          setLoading(true);
          try {
              const response = await fetchStatistic({
                  start_date: dateRangeValue.startDate.toISOString(),
                  end_date: dateRangeValue.endDate.toISOString(),
                  group_by: branchGroupBy,
                  status: 'completed',
                  group_by_branch: true,
              });
              
              switch (branchGroupBy) {
                case groupby[0]:
                    const filledData = fillMissingDateService(
                        response.appointment, 
                        dateRangeValue.startDate.toISOString(), 
                        dateRangeValue.endDate.toISOString()
                    );
                    setBranchStats(filledData);
                    break;
                case groupby[1]:
                    const filledDataMonth = fillMissingMonthService(
                        response.appointment, 
                        dateRangeValue.startDate.toISOString(), 
                        dateRangeValue.endDate.toISOString()
                    );
                    setBranchStats(filledDataMonth);
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
            switch (branchGroupBy) {
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
      }, [branchGroupBy]);

      const getDateFormatter = (date: Date) => {
        switch (branchGroupBy) {
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
        const branchIds = Array.from(new Set(data.map((item) => item.branch_id)));
        const branchNames = new Map(data.map((item) => [item.branch_id, item.branch_name]));
        
        const dataMap = new Map<string, AppointmentStat>();
        data.forEach((item) => {
            const date = new Date(new Date(item.appointment_date).setHours(0,0,0,0));
        const key = `${item.branch_id}-${item.branch_name}-${date.toISOString()}`;
        dataMap.set(key, item);
        });
        
        const allDates: string[] = [];
        let currentDate = new Date(new Date(start).setHours(0,0,0,0));
        while (currentDate <= end) {
        allDates.push(currentDate.toISOString()); 
        currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Fill missing dates for each employee
        for (const branchId of branchIds) {
        for (const date of allDates) {
            const key = `${branchId}-${branchNames.get(branchId)}-${date}`;
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
            branch_id: branchId,
            branch_name: branchNames.get(branchId) || "",
            service_id: 0,
            service_title: "",
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
        const branchIds = Array.from(new Set(data.map((item) => item.branch_id)));
        const branchNames = new Map(data.map((item) => [item.branch_id, item.branch_name]));
        
        const dataMap = new Map<string, AppointmentStat>();
        data.forEach((item) => {
            const key = `${item.branch_id}-${item.branch_name}-${item.appointment_date}`;
            dataMap.set(key, item);
        });
        
        const allDates: string[] = [];
        let currentDate = new Date(new Date(start).setHours(0,0,0,0));
        while (currentDate <= end) {
            allDates.push(currentDate.toISOString()); 
            currentDate.setMonth(currentDate.getMonth()+ 1);
        }
        
        // Fill missing dates for each employee
        for (const branchId of branchIds) {
        for (const date of allDates) {
            const key = `${branchId}-${branchNames.get(branchId)}-${new Date(date).getMonth() + 1}`;

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
                    branch_id: branchId,
                    branch_name: branchNames.get(branchId) || "",
                    service_id: 0,
                    service_title: "",
                });
            }
        }
        }
        
        return filledData;
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
          categories: branchStats.filter((value, index, self) => self.findIndex((t) => (
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
                    <h2 className="text-lg font-medium text-gray-800 mb-4">{title || "Branch Chart"}</h2>
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
                        onChange={(e) => setBranchGroupBy(e.target.value)}
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
        return chartWrapper(
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
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
            options={branchChartOptions}
            series={branchChartOptions.series}
            type="bar"
            height={400}
            width="100%"
            />
        )
    );
    
}

export default BranchChart;