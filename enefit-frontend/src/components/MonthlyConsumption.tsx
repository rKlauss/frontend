import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ConsumptionData {
    month: string;
    amount: number;
}

interface MonthlyConsumptionProps {
    meteringId: number;
    username?: string;
    className?: string;
}

const MonthlyConsumption: React.FC<MonthlyConsumptionProps> = ({ meteringId, className }) => {
    const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchConsumptionData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get<{ [key: string]: number }>(`http://localhost:8080/api/consumptions/monthly/${meteringId}`);
                
                const monthOrder = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];

                const transformedData: ConsumptionData[] = monthOrder.map(month => ({
                    month,
                    amount: response.data[month.toUpperCase()] || 0
                }));

                setConsumptionData(transformedData);
            } catch {
                setError('Failed to fetch consumption data.');
            } finally {
                setLoading(false);
            }
        };

        fetchConsumptionData();
    }, [meteringId]); // Re-fetch when meteringId changes

    if (loading) return <p className="text-center text-lg text-green-700">Loading consumption data...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className={`p-6 bg-green-50 rounded-2xl shadow-lg ${className}`}>
            <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">Monthly Energy Consumption</h3>
            <div className="overflow-x-auto mb-8">
                <table className="w-full text-center border-collapse border border-green-300">
                    <thead>
                        <tr className="bg-green-200">
                            <th className="border border-green-300 p-2">Month</th>
                            <th className="border border-green-300 p-2">Average Consumption (€/MWh)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consumptionData.map((data) => (
                            <tr key={data.month} className="odd:bg-green-100 even:bg-white">
                                <td className="border border-green-300 p-2 font-medium">{data.month}</td>
                                <td className="border border-green-300 p-2">{data.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                    data={consumptionData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#a0d468" />
                    <XAxis dataKey="month" stroke="#4caf50" interval={0} tick={{ fontSize: 12 }} />
                    <YAxis 
                        stroke="#4caf50" 
                        label={{ value: 'Consumption (€/MWh)', angle: -90, position: 'insideLeft', dx: -10, dy: 70 }} 
                        tickFormatter={(value) => typeof value === 'number' ? Math.round(value).toString() : value}
                        tick={{ fontSize: 12 }}
                        domain={[0, 'auto']}
                        tickCount={6}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#e8f5e9', borderColor: '#4caf50' }} 
                        formatter={(value) => typeof value === 'number' ? `${Math.round(value)} €/MWh` : value}
                        cursor={{ fill: 'transparent' }} // Remove grey hover background
                    />
                    <Legend wrapperStyle={{ color: '#4caf50' }} />
                    <Bar 
                        dataKey="amount" 
                        name="Consumption (€/MWh)" 
                        barSize={40} 
                        radius={[10, 10, 0, 0]} 
                        onMouseOver={(_, index) => setActiveIndex(index)}
                    >
                        {consumptionData.map((_, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={activeIndex === index ? '#2e7d32' : '#4caf50'} 
                                style={{ 
                                    transition: 'fill 0.2s ease-in-out' 
                                }} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyConsumption;
