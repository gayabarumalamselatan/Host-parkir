import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import MemberService from '../Services/memberService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const [membersData, setMembersData] = useState([]);
  const [barChartData, setBarChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMember = async () => {
    try {
      const response = await MemberService.fetchMemberService();
      if (response && response.data.data) {
        setMembersData(response.data.data);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, []);

  useEffect(() => {
    if (membersData.length > 0) {
      const memberCountByDate = {};
      const tarifBulananByDate = {};

      membersData.forEach(member => {
        const date = member.tanggal_masuk.split('T')[0];

        // Count members
        memberCountByDate[date] = (memberCountByDate[date] || 0) + 1;

        // Sum tarif_bulanan
        const tarif = parseFloat(member.tarif_bulanan);
        if (!isNaN(tarif)) {
          tarifBulananByDate[date] = (tarifBulananByDate[date] || 0) + tarif;
        }
      });

      // Sort dates to keep consistent order
      const sortedDates = Object.keys(memberCountByDate).sort();

      const memberCounts = sortedDates.map(date => memberCountByDate[date]);
      const tarifSums = sortedDates.map(date => tarifBulananByDate[date] || 0);

      setBarChartData({
        labels: sortedDates,
        datasets: [
          {
            label: 'Number of Members Added',
            data: memberCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            type: 'bar',
          },
        ],
      });

      setLineChartData({
        labels: sortedDates,
        datasets: [
          {
            label: 'Total Tarif Bulanan',
            data: tarifSums,
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.4,
            type: 'line',
          },
        ],
      });
    } else {
      setBarChartData({});
      setLineChartData({});
    }
  }, [membersData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {barChartData.labels && barChartData.labels.length > 0 && (
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6 mb-4">
              <h2>Member Baru Perhari</h2>
              <div className="chart-container">
                <Bar
                  data={barChartData}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Members'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Date'
                        }
                      }
                    },
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: false },
                    },
                  }}
                />
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <h2>Total Tarif Bulanan</h2>
              <div className="chart-container">
                <Line
                  data={lineChartData}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Total Tarif Bulanan'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Date'
                        }
                      }
                    },
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: false },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Charts;
