import apiService from "@/lib/api-service";
import { TemplateTypes } from "@/types/interface";
import { create } from "zustand";

interface TemplateState {
  templates: TemplateTypes[] | null;
  loading: boolean;
  error: string | null;
  listAllTemplates: () => Promise<void>;
  savedTemplates: () => Promise<void>;
  saveTemplate: (data: TemplateTypes) => Promise<void>;
  updateTemplate: (data: TemplateTypes) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: null,
  loading: false,
  error: null,

  listAllTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.listAllEmailTemplate();
  
      if (!response.data || !Array.isArray(response.data.templates)) {
        throw new Error("Invalid response format from the server.");
      }
  
      set({ templates: response.data.templates, loading: false });
    } catch (error) {
      console.error("Error fetching templates:", error);
      set({ loading: false, error: "Unable to fetch templates. Please try again later." });
    }
  },  
  savedTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.savedEmailTemplates();
  
      if (!response.data || !Array.isArray(response.data.templates)) {
        throw new Error("Invalid response format from the server.");
      }
  
      set({ templates: response.data.templates, loading: false });
    } catch (error) {
      console.error("Error fetching templates:", error);
      set({ loading: false, error: "Unable to fetch templates. Please try again later." });
    }
  },  

  // Save a new email template
  saveTemplate: async (data: TemplateTypes) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.saveEmailTemplate(data);
      const newTemplate = response.data.template;

      if (!newTemplate) {
        throw new Error("Invalid response from the server.");
      }

      const currentTemplates = get().templates || [];
      set({ templates: [...currentTemplates, newTemplate], loading: false });
    } catch (error) {
      console.error("Error saving template:", error);
      set({ loading: false, error: "Unable to save template. Please try again later." });
    }
  },

  // Update an existing email template
  updateTemplate: async (data: TemplateTypes) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.updateEmailTemplate(data);
      const updatedTemplate = response.data.template;

      if (!updatedTemplate) {
        throw new Error("Invalid response from the server.");
      }

      const currentTemplates = get().templates || [];
      const updatedTemplates = currentTemplates.map((template) =>
        template.id === updatedTemplate.id ? updatedTemplate : template
      );

      set({ templates: updatedTemplates, loading: false });
    } catch (error) {
      console.error("Error updating template:", error);
      set({ loading: false, error: "Unable to update template. Please try again later." });
    }
  },

  // Delete an email template
  deleteTemplate: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await apiService.deleteEmailTemplate({ id });
      const currentTemplates = get().templates || [];
      const updatedTemplates = currentTemplates.filter((template) => template.id !== id);

      set({ templates: updatedTemplates, loading: false });
    } catch (error) {
      console.error("Error deleting template:", error);
      set({ loading: false, error: "Unable to delete template. Please try again later." });
    }
  },
}));
