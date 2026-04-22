import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Image,
  Scissors,
  Grid3X3,
  Users,
  MessageSquare,
  HelpCircle,
  Settings,
  CalendarDays,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  CalendarOff,
} from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

const NAV = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Hero / Slides', path: '/admin/slides', icon: Image },
  { label: 'Serviços', path: '/admin/services', icon: Scissors },
  { label: 'Portfólio', path: '/admin/portfolio', icon: Grid3X3 },
  { label: 'Profissionais', path: '/admin/professionals', icon: Users },
  { label: 'Agendamentos', path: '/admin/appointments', icon: CalendarDays },
  { label: 'Bloqueios de Agenda', path: '/admin/schedule', icon: CalendarOff },
  { label: 'Depoimentos', path: '/admin/testimonials', icon: MessageSquare },
  { label: 'FAQ', path: '/admin/faq', icon: HelpCircle },
  { label: 'Leads Curso', path: '/admin/course-leads', icon: GraduationCap },
  { label: 'Configurações', path: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/admin')
  }

  return (
    <div className="flex h-screen bg-off-white">
      <aside
        className={`bg-charcoal text-white flex flex-col transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {!collapsed && <span className="font-serif text-lg">Admin</span>}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-1.5 hover:bg-white/10 rounded-sm transition-colors"
            type="button"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-sm text-sm transition-all duration-200 ${
                  active
                    ? 'bg-gold/20 text-gold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="font-sans font-light">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-white/40 hover:text-white text-sm transition-colors rounded-sm"
          >
            <Home className="w-4 h-4" />
            {!collapsed && <span className="font-sans font-light">Ver Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-white/40 hover:text-white text-sm transition-colors w-full rounded-sm"
            type="button"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="font-sans font-light">Sair</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
