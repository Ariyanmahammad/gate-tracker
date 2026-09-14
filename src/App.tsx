import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/Calendar';
import AllTasks from './pages/AllTasks';
import Subjects from './pages/Subjects';
import PYQs from './pages/PYQs';
import Tests from './pages/Tests';
import ErrorLogPage from './pages/ErrorLog';
import Analytics from './pages/Analytics';
import EditSchedule from './pages/EditSchedule';
import Revision from './pages/Revision';

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="tasks" element={<AllTasks />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="pyqs" element={<PYQs />} />
            <Route path="tests" element={<Tests />} />
            <Route path="errors" element={<ErrorLogPage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="revision" element={<Revision />} />
            <Route path="schedule" element={<EditSchedule />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
