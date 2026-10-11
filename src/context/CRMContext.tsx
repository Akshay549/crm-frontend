"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { initialLeads } from "@/lib/mock-data";
import type { Lead, LeadNote } from "@/lib/types";

type CRMContextType = {
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "notes">) => string | null;
  updateLead: (id: string, changes: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addNote: (id: string, text: string) => void;
};

const CRMContext = createContext<CRMContextType | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const addLead = (data: Omit<Lead, "id" | "createdAt" | "notes">) => {
    if (
      leads.some(
        (l) => l.phone.replace(/\D/g, "") === data.phone.replace(/\D/g, ""),
      )
    )
      return "This phone number already exists.";
    const id = `LD-${1049 + leads.length - initialLeads.length}`;
    setLeads((prev) => [
      { ...data, id, createdAt: new Date().toISOString(), notes: [] },
      ...prev,
    ]);
    return null;
  };
  const updateLead = (id: string, changes: Partial<Lead>) =>
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...changes } : l)),
    );
  const deleteLead = (id: string) =>
    setLeads((prev) => prev.filter((l) => l.id !== id));
  const addNote = (id: string, text: string) => {
    const note: LeadNote = {
      id: `N-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, notes: [note, ...l.notes] } : l)),
    );
  };

  return (
    <CRMContext.Provider
      value={{ leads, addLead, updateLead, deleteLead, addNote }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
}
