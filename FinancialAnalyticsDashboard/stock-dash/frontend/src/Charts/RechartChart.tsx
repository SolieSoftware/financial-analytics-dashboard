import {
    LineChart,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
    ResponsiveContainer,
    Bar
} from 'recharts';
import { useState } from 'react';


const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
    ];


const ChartSelector = () => {
    const [chartType, setChartType] = useState('line')

    return (
    <div>
        <div className="flex felx-col items-center w-full space-y-6">
            <div className="flex justify-center space-x-4">
                <button 
                className={`px-4 py-2 rounded ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setChartType('bar')}
                >
                Bar
                </button>
                <button 
                className={`px-4 py-2 rounded ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setChartType('line')}
                >
                Line
                </button>
            </div>
        </div>
        <ResponsiveContainer width={600} height={500}>
            {chartType === 'line' ? (
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r:8 }} />
            </LineChart>
            ) : chartType ==='bar' ?
            (
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            ) : <h1>No Chart Selected</h1>
            }
        </ResponsiveContainer>
    </div>
    )
}

export default ChartSelector;