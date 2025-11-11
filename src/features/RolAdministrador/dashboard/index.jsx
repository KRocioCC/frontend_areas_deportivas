import ResumenFinanciero from './components/ResumenFinanciero';
import MetaMensual from './components/MetaMensual';
const Dashboard = () => (
  <div className="p-6 bg-gray-100 min-h-screen">
    <h1 className="text-2xl font-bold mb-4">Dashboard Administrador</h1>
    <ResumenFinanciero />
        <MetaMensual />
  </div>
);

export default Dashboard;
