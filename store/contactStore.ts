import apiService from '@/lib/api-service';
import { UserTypes, Contact } from '@/types/interface';  // Assuming `Contact` is your contact type
import { create } from 'zustand';

interface ContactState {
  contacts: Contact[] | null;  // Use the actual type for contacts
  loading: boolean;
  listAllContacts: () => Promise<void>;
  addContact: (
    first_name: string, 
    last_name: string, 
    email: string, 
    phone: string, 
    address: string
  ) => Promise<void>;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: null,
  loading: true,

  // List all contacts
  listAllContacts: async () => {
    try {
      set({ loading: true });
      const response = await apiService.listAllContacts();
      set({ contacts: response.data.contacts, loading: false });
    } catch (error) {
      console.error('Failed to load contacts:', error);
      set({ loading: false });
    }
  },

  // Add a new contact
  addContact: async (first_name, last_name, email, phone, address) => {
    try {
      set({ loading: true });
      const response = await apiService.addContact({ first_name, last_name, email, phone, address });
      
      // Access the current contacts from the store state
      const currentContacts = get().contacts;
      set({ 
        contacts: currentContacts ? [...currentContacts, response.data.contact] : [response.data.contact],
        loading: false 
      });
    } catch (error) {
      console.error('Failed to add contact:', error);
      set({ loading: false });
    }
  }
}));
