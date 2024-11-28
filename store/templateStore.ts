import apiService from '@/lib/api-service';
import { TemplateTypes } from '@/types/interface';
import { create } from 'zustand';

interface TemplateState {
  templates: TemplateTypes[] | null;
  loading: boolean;
  error: string | null;
  listAllTemplates: () => Promise<void>;
  saveTemplate: (data: TemplateTypes) => Promise<void>;
  updateTemplate: (data: TemplateTypes) => Promise<void>;
  deleteTemplate: (data: TemplateTypes) => Promise<void>; 
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: null,
  loading: false, 
  error: null,

  listAllTemplates: async () => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.listAllEmailTemplate({});  // Assuming this API fetches templates
      set({ templates: response.data.templates, loading: false });  // Store templates in state
    } catch (error) {
      console.error('Failed to load templates:', error);
      set({ loading: false, error: 'Failed to load templates' });  // Set error state if failed
    }
  },

  // Save a new email template
  saveTemplate: async (data: TemplateTypes) => {
    try {
      set({ loading: true, error: null });  // Set loading state to true
      const response = await apiService.saveEmailTemplate(data);  // Save the template
      const currentTemplates = get().templates;
      
      // Add the new template to the existing templates array
      set({
        templates: currentTemplates ? [...currentTemplates, response.data.template] : [response.data.template],
        loading: false,
      });
    } catch (error) {
      console.error('Failed to save template:', error);
      set({ loading: false, error: 'Failed to save template' });  // Set error state if failed
    }
  },

  updateTemplate: async (data: TemplateTypes) => {
    try {
      set({ loading: true, error: null });  // Set loading state to true
      const response = await apiService.updateEmailTemplate(data);  // Update the template
      const currentTemplates = get().templates;

      // Update the template in the existing templates list
      if (currentTemplates) {
        const updatedTemplates = currentTemplates.map(template =>
          template.id === response.data.template.id ? response.data.template : template
        );
        set({ templates: updatedTemplates, loading: false });
      } else {
        set({ templates: [response.data.template], loading: false });
      }
    } catch (error) {
      console.error('Failed to update template:', error);
      set({ loading: false, error: 'Failed to update template' });  // Set error state if failed
    }
  },

  // Delete an email template
  deleteTemplate: async (data: TemplateTypes) => {
    try {
      set({ loading: true, error: null });  // Set loading state to true
      await apiService.deleteEmailTemplate(data);  // Delete the template
      const currentTemplates = get().templates;

      // Remove the deleted template from the state
      if (currentTemplates) {
        const updatedTemplates = currentTemplates.filter(
          template => template.id !== data.id
        );
        set({ templates: updatedTemplates, loading: false });
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
      set({ loading: false, error: 'Failed to delete template' });  // Set error state if failed
    }
  },
}));
