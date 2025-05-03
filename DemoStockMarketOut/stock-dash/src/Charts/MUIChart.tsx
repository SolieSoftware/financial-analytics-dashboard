import { LineChart } from '@mui/x-charts';

const data =[
    {x: 1, y:1},
    {x: 2, y:2},
    {x: 3, y:3},
    {x: 4, y:4},
    {x: 5, y:5},
    {x: 6, y:6},
    {x: 7, y:7}
]

const MUIChart = () => {
  return (
    <LineChart
      width={500}
      height={300}
      xAxis={[{ data: data.map(d => d.x), label:"X" }]}
      series={[{ data: data.map(d => d.y), label:"Y" }]}
    />
  );
};

export default MUIChart;