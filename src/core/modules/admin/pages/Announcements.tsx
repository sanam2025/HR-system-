// core/modules/Admin/pages/Announcements.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Users,
  Building,
  UserCog,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function Announcements() {
  const navigate = useNavigate();

  const announcements = [
    { 
      id: 1,
      title: "Company Annual Meeting", 
      content: "All employees must attend the annual meeting", 
      date: "Mar 15, 2026", 
      priority: "High",
      target: "All Employees",
      status: "Active"
    },
    { 
      id: 2,
      title: "Holiday Schedule Update", 
      content: "Eid holidays announced", 
      date: "Mar 10, 2026", 
      priority: "Medium",
      target: "All Employees",
      status: "Active"
    },
    { 
      id: 3,
      title: "New HR Policy", 
      content: "Updated attendance policy", 
      date: "Mar 5, 2026", 
      priority: "High",
      target: "HR Department",
      status: "Expired"
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create and manage company announcements
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-emerald-600">8</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Priority</p>
              <p className="text-2xl font-bold text-red-600">4</p>
            </div>
            <div className="bg-red-50 text-red-600 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-2xl font-bold text-gray-400">4</p>
            </div>
            <div className="bg-gray-50 text-gray-400 p-3 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">All Announcements</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      announcement.priority === "High" 
                        ? "bg-red-50 text-red-600" 
                        : "bg-yellow-50 text-yellow-600"
                    }`}>
                      {announcement.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      announcement.status === "Active" 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "bg-gray-50 text-gray-400"
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {announcement.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {announcement.target}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}