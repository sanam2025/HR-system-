
import Header from "./Header";
import Cards from "./status/StatusCards";
import HolidaysList from "./List/HolidaysList";
import { useHolidays } from "../../hooks/Holidays/useHolidays";

export default function Holidays() {
  const { data: holidays, isLoading, error , refetch} = useHolidays();

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <Header isLoading={isLoading}/>
      <Cards holidays={holidays?.data?.data} isLoading={isLoading}/>
      <HolidaysList holidays={holidays?.data?.data} isLoading={isLoading} error={error} refetch={refetch}/>
    </div>
  );
}