import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  AppWindow,
  ClipboardList,
  Home,
  Shield,
  Settings,
  FileText,
  ShieldCheck,
  ArrowRight,
  Command,
  X,
  User,
  Layers,
  Zap,
} from "lucide-react";
import { mockUsers } from "@/mock/users";
import { mockApplications } from "@/mock/applications";
import { mockAccessRequests } from "@/mock/requests";
import type { User as UserType, Application, AccessRequest } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CommandGroup = "Users" | "Applications" | "Requests" | "Navigation";

export interface CommandItem {
  id: string;
  group: CommandGroup;
  label: string;
  sublabel?: string;
  meta?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  keywords?: string;
}

// ─── Group metadata ───────────────────────────────────────────────────────────

const GROUP_META: Record<CommandGroup, { label: string; icon: React.ComponentType<any>; color: string }> = {
  Users: {
    label: "Users",
    icon: Users,
    color: "text-violet-500",
  },
  Applications: {
    label: "Applications",
    icon: Layers,
    color: "text-blue-500",
  },
  Requests: {
    label: "Access Requests",
    icon: ClipboardList,
    color: "text-amber-500",
  },
  Navigation: {
    label: "Navigation",
    icon: Zap,
    color: "text-slate-500",
  },
};

// ─── Index builders ───────────────────────────────────────────────────────────

function buildNavigationItems(): CommandItem[] {
  return [
    {
      id: "nav-dashboard",
      group: "Navigation",
      label: "Dashboard",
      meta: "Home / Overview",
      icon: Home,
      path: "/dashboard",
      keywords: "home overview start",
    },
    {
      id: "nav-access",
      group: "Navigation",
      label: "My Access",
      meta: "View your access",
      icon: Shield,
      path: "/access",
      keywords: "my access permissions",
    },
    {
      id: "nav-users",
      group: "Navigation",
      label: "Users",
      meta: "Manage users",
      icon: Users,
      path: "/users",
      keywords: "manage users employee",
    },
    {
      id: "nav-applications",
      group: "Navigation",
      label: "Applications",
      meta: "Manage apps",
      icon: AppWindow,
      path: "/applications",
      keywords: "manage applications apps",
    },
    {
      id: "nav-requests",
      group: "Navigation",
      label: "Access Requests",
      meta: "Manage requests",
      icon: ClipboardList,
      path: "/requests",
      keywords: "manage requests access",
    },
    {
      id: "nav-roles",
      group: "Navigation",
      label: "Roles",
      meta: "Manage roles",
      icon: ShieldCheck,
      path: "/roles",
      keywords: "manage roles permissions",
    },
    {
      id: "nav-audit",
      group: "Navigation",
      label: "Audit Logs",
      meta: "Security logs",
      icon: FileText,
      path: "/audit",
      keywords: "audit logs security",
    },
    {
      id: "nav-settings",
      group: "Navigation",
      label: "Settings",
      meta: "Configure application",
      icon: Settings,
      path: "/settings",
      keywords: "settings configure",
    },
  ];
}

function buildUserItems(): CommandItem[] {
  return mockUsers.map((u) => ({
    id: `user-${u.id}`,
    group: "Users" as CommandGroup,
    label: u.name,
    sublabel: u.email,
    meta: `${u.department} · ${u.role}`,
    icon: User,
    path: `/users/${u.id}`,
    keywords: `${u.name} ${u.email} ${u.department} ${u.role} ${u.employeeId}`,
  }));
}

function buildApplicationItems(): CommandItem[] {
  return mockApplications.map((app) => ({
    id: `app-${app.id}`,
    group: "Applications" as CommandGroup,
    label: app.name,
    sublabel: app.description,
    meta: `${app.owner} · ${app.environment}`,
    icon: Layers,
    path: `/applications/${app.id}`,
    keywords: `${app.name} ${app.owner} ${app.description} ${app.authenticationType}`,
  }));
}

function buildRequestItems(): CommandItem[] {
  return mockAccessRequests.map((req) => ({
    id: `req-${req.id}`,
    group: "Requests" as CommandGroup,
    label: `${req.requesterName} → ${req.applicationName}`,
    sublabel: `${req.roleName} · ${req.accessLevel}`,
    meta: req.status,
    icon: ClipboardList,
    path: `/requests/${req.id}`,
    keywords: `${req.requesterName} ${req.applicationName} ${req.roleName} ${req.status}`,
  }));
}

// ─── Fuzzy match ──────────────────────────────────────────────────────────────

function fuzzy(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase().replace(/-/g, " ");
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function score(query: string, item: CommandItem): number {
  const label = item.label.toLowerCase();
  const sublabel = (item.sublabel ?? "").toLowerCase();
  const meta = (item.meta ?? "").toLowerCase();
  const q = query.toLowerCase();

  if (label === q) return 100;
  if (label.startsWith(q)) return 90;
  if (label.includes(` ${q}`)) return 80;
  if (sublabel.includes(q)) return 60;
  if (meta.includes(q)) return 50;
  if (fuzzy(q, label)) return 40;
  if (fuzzy(q, sublabel)) return 30;
  if (fuzzy(q, item.keywords ?? "")) return 20;
  return 0;
}

// ─── Group & sort results ─────────────────────────────────────────────────────

function search(query: string, items: CommandItem[]): Map<CommandGroup, CommandItem[]> {
  const groups = new Map<CommandGroup, CommandItem[]>();

  for (const item of items) {
    if (score(query, item) > 0) {
      if (!groups.has(item.group)) groups.set(item.group, []);
      groups.get(item.group)!.push(item);
    }
  }

  for (const [, groupItems] of groups) {
    groupItems.sort((a, b) => score(query, b) - score(query, a));
  }

  return groups;
}

// ─── Status badge colors ──────────────────────────────────────────────────────

function statusColors(status: string): string {
  switch (status) {
    case "ACTIVE": return "text-emerald-600 bg-emerald-50";
    case "PENDING": return "text-amber-600 bg-amber-50";
    case "APPROVED": return "text-blue-600 bg-blue-50";
    case "REJECTED": return "text-red-600 bg-red-50";
    case "SUSPENDED": return "text-red-600 bg-red-50";
    case "INACTIVE": return "text-slate-500 bg-slate-100";
    default: return "text-slate-600 bg-slate-100";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // All indexable items (built once)
  const allItems = useRef<CommandItem[]>([
    ...buildNavigationItems(),
    ...buildUserItems(),
    ...buildApplicationItems(),
    ...buildRequestItems(),
  ]).current;

  // Results for current query
  const results = search(query, allItems);
  const flatResults = Array.from(results.values()).flat();
  const totalResults = flatResults.length;

  // Keyboard-selected index across all flat results
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>("[data-selected='true']");
    if (active) {
      active.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Navigate to selected item
  const confirm = useCallback(
    (item: CommandItem) => {
      onClose();
      setTimeout(() => navigate(item.path), 60);
    },
    [onClose, navigate]
  );

  // Keyboard handler
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, totalResults - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter": {
          e.preventDefault();
          if (flatResults[selectedIndex]) {
            confirm(flatResults[selectedIndex]);
          }
          break;
        }
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, totalResults, flatResults, confirm, onClose]);

  if (!open) return null;

  // Build flat index → group offset map for keyboard navigation
  let flatIdx = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search users, applications, requests…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
              Esc
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[min(60vh,480px)] overflow-y-auto py-2"
        >
          {query === "" ? (
            /* Default: show quick nav items when empty */
            <QuickNavSuggestions onSelect={(path) => { onClose(); navigate(path); }} />
          ) : totalResults === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Search size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">No results for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for a user name, app, or request</p>
            </div>
          ) : (
            Array.from(results.entries()).map(([group, items]) => {
              const meta = GROUP_META[group];
              const GroupIcon = meta.icon;

              const groupStartIdx = flatIdx;
              flatIdx += items.length;

              return (
                <div key={group} className="mb-1">
                  {/* Group header */}
                  <div className="flex items-center gap-2 px-4 py-1.5">
                    <GroupIcon size={13} className={`${meta.color} shrink-0`} />
                    <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-slate-300">{items.length}</span>
                  </div>

                  {/* Group items */}
                  {items.map((item) => {
                    const itemFlatIdx = groupStartIdx + items.indexOf(item);
                    const isSelected = itemFlatIdx === selectedIndex;
                    const ItemIcon = item.icon;

                    return (
                      <button
                        key={item.id}
                        data-selected={isSelected}
                        onClick={() => confirm(item)}
                        onMouseEnter={() => setSelectedIndex(itemFlatIdx)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                          ${isSelected ? "bg-blue-50" : "hover:bg-slate-50"}
                        `}
                      >
                        {/* Icon */}
                        <div
                          className={`
                            shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                            ${isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}
                          `}
                        >
                          <ItemIcon size={16} />
                        </div>

                        {/* Labels */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium truncate ${isSelected ? "text-blue-700" : "text-slate-800"}`}>
                              {item.label}
                            </span>
                            {item.meta && (
                              <span
                                className={`
                                  shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full
                                  ${statusColors(item.meta)}
                                `}
                              >
                                {item.meta}
                              </span>
                            )}
                          </div>
                          {item.sublabel && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">{item.sublabel}</p>
                          )}
                        </div>

                        {/* Arrow */}
                        <ArrowRight
                          size={14}
                          className={`shrink-0 transition-opacity ${isSelected ? "text-blue-400 opacity-100" : "opacity-0"}`}
                        />
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-sm">
              ↑↓
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-sm">
              ↵
            </kbd>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-sm">
              Esc
            </kbd>
            <span>Close</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-400">
            <Command size={10} />
            <span>K to open</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quick nav suggestions (empty state) ──────────────────────────────────────

function QuickNavSuggestions({ onSelect }: { onSelect: (path: string) => void }) {
  const suggestions: Array<{ label: string; sublabel: string; icon: React.ComponentType<any>; path: string }> = [
    { label: "Go to Dashboard", sublabel: "Overview & stats", icon: Home, path: "/dashboard" },
    { label: "Go to Users", sublabel: "Manage employees", icon: Users, path: "/users" },
    { label: "Go to Applications", sublabel: "App inventory", icon: AppWindow, path: "/applications" },
    { label: "Go to Access Requests", sublabel: "Review & approve", icon: ClipboardList, path: "/requests" },
    { label: "Go to Audit Logs", sublabel: "Security events", icon: FileText, path: "/audit" },
    { label: "Go to Settings", sublabel: "Configuration", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="px-4 py-2">
      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase mb-2 px-2">
        Quick Navigation
      </p>
      {suggestions.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.path}
            onClick={() => onSelect(s.path)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Icon size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{s.label}</p>
              <p className="text-xs text-slate-400">{s.sublabel}</p>
            </div>
            <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
          </button>
        );
      })}
    </div>
  );
}
