import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState  } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

const BASE_URL = 'https://silky-billowy-innocent.glitch.me';

function App() {
  const [hourlyData, setHourlyData] = useState(null);
  const [poi, setPOI] = useState(null);
  const [key1, setKey1] = useState('clicks');
  const [key2, setKey2] = useState('revenue');
  const [nameKey, setNameKey] = useState('');

  useEffect(() => {
    fetchData();
    fetchPOI();
  }, []);

  const fetchData = async () => {
    const response = await fetch(`${BASE_URL}/stats/hourly`);
    if (response.status === 200) {
      const respData = await response.json();
      respData.forEach(e => {e.datekey = e.date + e.hour});
      setHourlyData(respData);
    }
  }

  const fetchPOI = async () => {
    const response = await fetch(`${BASE_URL}/poi`);
    if (response.status === 200) {
      const respData = await response.json();
      setPOI(respData);
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      payload[0].chartType = "AreaChart";
      return (
        <div className="custom-tooltip">
          <p className="label"> {`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="label">{`${payload[1].name}: ${payload[1].value}`}</p>
          <p className="user-number">
            {payload[0].payload.number}
          </p>
          <p className="time">{label}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rate Limiting</h1>
        Rate limiting is implemented using a redis cache. You can only make 4 requests per minute before the API returns HTTP status 429.
        Since this page makes 4 requests to the endpoint, refreshing it once should go over the limit.

        <h1>Hourly Stats Visualization</h1>
        {(hourlyData !== null) ? <>
        <div className='dropdown-container'>
        <Dropdown  className="dropdown-basic">
          <Dropdown.Toggle variant="success">
            Line 1 Data
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="" onClick={() => setKey1('impressions')}>Impressions</Dropdown.Item>
            <Dropdown.Item href="" onClick={() => setKey1('clicks')}>Clicks</Dropdown.Item>
            <Dropdown.Item href=""onClick={() => setKey1('revenue')}>Revenue</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="dropdown-basic">
          <Dropdown.Toggle variant="success">
            Line 2 Data
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="" onClick={() => setKey2('impressions')}>Impressions</Dropdown.Item>
            <Dropdown.Item href="" onClick={() => setKey2('clicks')}>Clicks</Dropdown.Item>
            <Dropdown.Item href=""onClick={() => setKey2('revenue')}>Revenue</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </div>
          <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={hourlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="datekey" tick={false}/>
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey={key1} stroke="#8884d8" tick={false} />
            <Line type="monotone" dataKey={key2} stroke="#82ca9d" tick={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div></> : <p>No data</p>
      }
      <h1>POI Table</h1>
      {(poi !== null) ?
        <>
          <Form>
            <Form.Group className="form">
              <Form.Label>Search By Name:</Form.Label>
              <Form.Control placeholder="Enter name" value={nameKey} onChange={e => setNameKey(e.target.value)}/>
            </Form.Group>
          </Form>
          <Table bordered variant='dark'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Lat</th>
                <th>Long</th>
              </tr>
            </thead>
            <tbody>
            {poi.map(p => {
              return (
                <tr className={(p.name.toLowerCase().includes(nameKey.toLowerCase()) && nameKey.length > 1) ? 'highlighted' : ''}>
                  <th>{p.poi_id}</th>
                  <th>{p.name}</th>
                  <th>{p.lat}</th>
                  <th>{p.lon}</th>
                </tr>)
            })}
            </tbody>
          </Table>
        </>: <p>No data</p>
      }
      </header>

    </div>
  );
}

export default App;
