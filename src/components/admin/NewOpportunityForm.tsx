"use client";

import { useState } from "react";
import { createOpportunity } from "@/lib/actions/opportunities";

type ContactOption = { id: string; full_name: string; organisation: string | null };

const SOURCES = ["referral", "linkedin", "trade_press", "recruitment_agency", "manual"];
const VESSEL_TYPES = ["new_build", "refit", "bess", "shore_side"];
const SIZES = ["small", "medium", "large"];

const inputCls =
  "w-full rounded-md border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-light";
const labelCls = "block text-sm font-medium text-neutral-700 mb-1";

function labelFor(v: string) {
  return v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function NewOpportunityForm({ contacts }: { contacts: ContactOption[] }) {
  const [mode, setMode] = useState<"existing" | "new">(contacts.length ? "existing" : "new");

  return (
    <form action={createOpportunity} className="space-y-8 max-w-2xl">
      <section className="space-y-4">
        <div>
          <label className={labelCls}>Title *</label>
          <input required name="title" className={inputCls} placeholder="e.g. 60m new build — MGN 681 review" />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea name="description" rows={3} className={inputCls} placeholder="What's the opportunity?" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Source</label>
            <select name="source" className={inputCls} defaultValue="manual">
              {SOURCES.map((s) => (
                <option key={s} value={s}>{labelFor(s)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Source URL</label>
            <input name="source_url" className={inputCls} placeholder="LinkedIn / article link" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className={labelCls}>Estimated value</label>
            <input name="estimated_value" type="number" min="0" step="1000" className={inputCls} placeholder="25000" />
          </div>
          <div>
            <label className={labelCls}>Currency</label>
            <input name="currency" className={inputCls} defaultValue="GBP" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Vessel / project type</label>
            <select name="vessel_type" className={inputCls} defaultValue="">
              <option value="">—</option>
              {VESSEL_TYPES.map((v) => (
                <option key={v} value={v}>{labelFor(v)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Project size</label>
            <select name="project_size" className={inputCls} defaultValue="">
              <option value="">—</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>{labelFor(s)}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-navy">Contact</h2>
          <div className="flex rounded-md border border-black/15 text-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("existing")}
              disabled={!contacts.length}
              className={`px-3 py-1.5 ${mode === "existing" ? "bg-navy text-white" : "text-neutral-600"} disabled:opacity-40`}
            >
              Existing
            </button>
            <button
              type="button"
              onClick={() => setMode("new")}
              className={`px-3 py-1.5 ${mode === "new" ? "bg-navy text-white" : "text-neutral-600"}`}
            >
              New
            </button>
          </div>
        </div>

        {mode === "existing" ? (
          <div>
            <label className={labelCls}>Link an existing contact</label>
            <select name="contact_id" className={inputCls} defaultValue="">
              <option value="">— none —</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                  {c.organisation ? ` — ${c.organisation}` : ""}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full name</label>
                <input name="new_contact_name" className={inputCls} placeholder="Jane Smith" />
              </div>
              <div>
                <label className={labelCls}>Organisation</label>
                <input name="new_contact_org" className={inputCls} placeholder="Yacht mgmt Co." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Role / title</label>
                <input name="new_contact_role" className={inputCls} placeholder="Fleet Manager" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input name="new_contact_email" type="email" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Phone</label>
                <input name="new_contact_phone" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>LinkedIn URL</label>
                <input name="new_contact_linkedin" className={inputCls} />
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light transition-colors"
        >
          Create opportunity
        </button>
        <a
          href="/admin/leads"
          className="inline-flex items-center justify-center rounded-md border border-black/15 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
