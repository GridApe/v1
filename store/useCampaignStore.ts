import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Contact {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: string;
}

interface CampaignStore {
  subject: string;
  recipients: string[];
  contacts: Contact[];
  selectedTemplateId: string | null;
  selectedTemplateState: 'selected' | 'empty';
  action: 'select_template' | 'edit_template' | 'change_template' | null;
  isScheduled: boolean;
  scheduledDateTime: Date | null;
  setSubject: (subject: string) => void;
  setRecipients: (recipients: string[]) => void;
  setContacts: (contacts: Contact[]) => void;
  setSelectedTemplateId: (id: string | null) => void;
  setSelectedTemplateState: (state: 'selected' | 'empty') => void;
  setAction: (action: 'select_template' | 'edit_template' | 'change_template' | null) => void;
  setIsScheduled: (isScheduled: boolean) => void;
  setScheduledDateTime: (scheduledDateTime: Date | null) => void;
  resetStore: () => void;
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set) => ({
      subject: '',
      recipients: [],
      contacts: [],
      selectedTemplateId: null,
      selectedTemplateState: 'empty',
      action: null,
      isScheduled: false,
      scheduledDateTime: null,
      setSubject: (subject) => set({ subject }),
      setRecipients: (recipients) => set({ recipients }),
      setContacts: (contacts) => set({ contacts }),
      setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
      setSelectedTemplateState: (state) => set({ selectedTemplateState: state }),
      setAction: (action) => set({ action }),
      setIsScheduled: (isScheduled) => set({ isScheduled }),
      setScheduledDateTime: (scheduledDateTime) => set({ scheduledDateTime }),
      resetStore: () => set({
        subject: '',
        recipients: [],
        contacts: [],
        selectedTemplateId: null,
        selectedTemplateState: 'empty',
        action: null,
        isScheduled: false,
        scheduledDateTime: null,
      }),
    }),
    {
      name: 'campaign-store',
    }
  )
);