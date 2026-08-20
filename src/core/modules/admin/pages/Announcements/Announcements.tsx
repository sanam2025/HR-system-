
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import StatusCards from "./status/StatusCards";
import AnnouncementsList from "./list/AnnouncementsList";
import { useAnnouncements } from "../../hooks/Announcements/useAnnouncements";
import { useLanguage } from "../../../../../i18n/translations/LanguageContext";

export default function Announcements() {
  const {data: announcements , isLoading , error , refetch} = useAnnouncements();
  const { lang } = useLanguage();

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header/>
      <StatusCards announcements={announcements?.data.data} isLoading={isLoading}/>
      <AnnouncementsList announcements={announcements?.data.data} refetch={refetch} isLoading={isLoading} error={error}/>
    </div>
  );
}