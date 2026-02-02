import { LayoutDashboard, Settings, BarChart3, Bell, Moon, Sun, LogOut, FolderKanban, TrendingUp, CreditCard, HelpCircle } from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Sidebar({ darkMode, onToggleDarkMode }: SidebarProps) {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: FolderKanban, label: 'Board', active: true },
    { icon: TrendingUp, label: 'Trades', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: CreditCard, label: 'Positions', active: false },
  ];

  const bottomItems = [
    { icon: Bell, label: 'Notifications', active: false, badge: 3 },
    { icon: Settings, label: 'Settings', active: false },
    { icon: HelpCircle, label: 'Help', active: false },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-glow-blue">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-lg tracking-tight">TradeBoard</span>
          <p className="text-[10px] text-trade-400 uppercase tracking-wider">Pro</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="mb-4">
          <p className="px-4 text-[10px] font-semibold text-trade-500 uppercase tracking-wider mb-2">
            Main
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  className={`sidebar-nav-item w-full ${item.active ? 'active' : ''}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Navigation */}
        <div>
          <p className="px-4 text-[10px] font-semibold text-trade-500 uppercase tracking-wider mb-2">
            System
          </p>
          <ul className="space-y-0.5">
            {bottomItems.map((item) => (
              <li key={item.label}>
                <button
                  className={`sidebar-nav-item w-full ${item.active ? 'active' : ''}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-priority-high text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="sidebar-footer">
        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="sidebar-nav-item w-full mb-1"
        >
          {darkMode ? (
            <>
              <Sun className="w-5 h-5" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="my-3 border-t border-trade-600/30" />

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-trade-700/30 border border-trade-600/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-sm font-medium text-white">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Jacob</p>
            <p className="text-xs text-trade-400 truncate">Pro Trader</p>
          </div>
          <button className="p-1.5 rounded-lg text-trade-400 hover:text-white hover:bg-trade-600 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
