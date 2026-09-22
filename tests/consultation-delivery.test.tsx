// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { IntakeClient } from '@/components/intake-client';
import { BROWSER_STORAGE_KEYS } from '@/lib/client/storage-keys';
const delivered = { kind:'created',duplicate:false,request:{request_id:'consult-synthetic-delivery',access_key:'a'.repeat(43),work_name:'Accessible notice',created_at:'2026-09-08T00:00:00Z'} };
afterEach(()=>{cleanup();sessionStorage.clear();localStorage.clear();vi.unstubAllGlobals();});
async function submit(remember=false) {
 render(<IntakeClient intakeEnabled programContext="one_dsd"/>);
 await act(async()=>{await Promise.resolve();});
 fireEvent.change(screen.getByLabelText('Program or work name (required)'),{target:{value:'Accessible notice'}});
 if(remember) fireEvent.click(screen.getByLabelText(/Remember my reference ID/));
 await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Submit request'}));});
}
describe('consultation receipt delivery',()=>{
 it('displays the returned credential and keeps only a tab copy without device consent',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({json:async()=>delivered})); await submit();
  expect(screen.getByText(delivered.request.access_key)).toBeTruthy();
  expect(screen.getByRole('link',{name:'Track this request'}).getAttribute('href')).toBe('/support/track?id=consult-synthetic-delivery');
  expect(sessionStorage.getItem(BROWSER_STORAGE_KEYS.recentConsultationReferences)).toContain(delivered.request.access_key);
  expect(localStorage.getItem(BROWSER_STORAGE_KEYS.savedConsultationReferences)).toBeNull();
 });
 it('saves a device copy only when chosen and accurately reports that choice',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({json:async()=>delivered})); await submit(true);
  expect(localStorage.getItem(BROWSER_STORAGE_KEYS.savedConsultationReferences)).toContain(delivered.request.access_key);
  expect(screen.getByText(/you chose to save them on this device/)).toBeTruthy();
 });
 it('shows failed submission without a success receipt and retains the typed work',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('network')));await submit();
  expect(screen.getByRole('alert').textContent).toContain("We couldn't complete that request");
  expect((screen.getByLabelText('Program or work name (required)') as HTMLInputElement).value).toBe('Accessible notice');
  expect(screen.queryByText(delivered.request.access_key)).toBeNull();
  expect(sessionStorage.getItem(BROWSER_STORAGE_KEYS.recentConsultationReferences)).toBeNull();
 });
});
