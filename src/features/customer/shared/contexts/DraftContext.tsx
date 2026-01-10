import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { DraftData, BusinessCategory } from '../types';

interface DraftContextState {
  drafts: DraftData[];
  currentDraftId: string | null;
  isAutoSaving: boolean;
  lastSaved: Date | null;
  autoSaveInterval: number; // in milliseconds
}

interface DraftContextActions {
  createDraft: (merchantInfo: { id: string; name: string; category: BusinessCategory }) => string;
  saveDraft: (draftId: string, data: Partial<DraftData>) => void;
  loadDraft: (draftId: string) => DraftData | null;
  deleteDraft: (draftId: string) => void;
  listDrafts: () => DraftData[];
  setAutoSaveInterval: (interval: number) => void;
  enableAutoSave: (enabled: boolean) => void;
}

const initialState: DraftContextState = {
  drafts: [],
  currentDraftId: null,
  isAutoSaving: false,
  lastSaved: null,
  autoSaveInterval: 30000, // 30 seconds
};

type DraftAction =
  | { type: 'CREATE_DRAFT'; payload: { draftId: string; merchantInfo: any } }
  | { type: 'SAVE_DRAFT_START'; payload: string }
  | { type: 'SAVE_DRAFT_SUCCESS'; payload: { draftId: string; data: Partial<DraftData>; timestamp: Date } }
  | { type: 'SAVE_DRAFT_ERROR'; payload: { draftId: string; error: string } }
  | { type: 'LOAD_DRAFT'; payload: string }
  | { type: 'DELETE_DRAFT'; payload: string }
  | { type: 'SET_AUTO_SAVE_INTERVAL'; payload: number }
  | { type: 'LOAD_DRAFTS_FROM_STORAGE'; payload: DraftData[] };

const draftReducer = (state: DraftContextState, action: DraftAction): DraftContextState => {
  switch (action.type) {
    case 'CREATE_DRAFT':
      const newDraft: DraftData = {
        draftId: action.payload.draftId,
        merchantInfo: action.payload.merchantInfo,
        lastSaved: new Date(),
        autoSaveEnabled: true,
        syncStatus: 'local',
        version: 1,
      };
      
      return {
        ...state,
        drafts: [...state.drafts, newDraft],
        currentDraftId: action.payload.draftId,
      };

    case 'SAVE_DRAFT_START':
      return {
        ...state,
        isAutoSaving: true,
      };

    case 'SAVE_DRAFT_SUCCESS':
      const updatedDrafts = state.drafts.map(draft => 
        draft.draftId === action.payload.draftId
          ? {
              ...draft,
              ...action.payload.data,
              lastSaved: action.payload.timestamp,
              version: draft.version + 1,
            }
          : draft
      );

      return {
        ...state,
        drafts: updatedDrafts,
        isAutoSaving: false,
        lastSaved: action.payload.timestamp,
      };

    case 'DELETE_DRAFT':
      return {
        ...state,
        drafts: state.drafts.filter(draft => draft.draftId !== action.payload),
        currentDraftId: state.currentDraftId === action.payload ? null : state.currentDraftId,
      };

    case 'LOAD_DRAFT':
      return {
        ...state,
        currentDraftId: action.payload,
      };

    case 'SET_AUTO_SAVE_INTERVAL':
      return {
        ...state,
        autoSaveInterval: action.payload,
      };

    case 'LOAD_DRAFTS_FROM_STORAGE':
      return {
        ...state,
        drafts: action.payload,
      };

    default:
      return state;
  }
};

const DraftContext = createContext<{
  state: DraftContextState;
  actions: DraftContextActions;
} | null>(null);

interface DraftProviderProps {
  children: ReactNode;
}

export const DraftProvider: React.FC<DraftProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(draftReducer, initialState);

  // Load drafts from localStorage on mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('review-drafts');
    if (savedDrafts) {
      try {
        const drafts = JSON.parse(savedDrafts);
        dispatch({ type: 'LOAD_DRAFTS_FROM_STORAGE', payload: drafts });
      } catch (error) {
        console.error('Failed to load drafts from storage:', error);
      }
    }
  }, []);

  // Save drafts to localStorage whenever drafts change
  useEffect(() => {
    if (state.drafts.length > 0) {
      localStorage.setItem('review-drafts', JSON.stringify(state.drafts));
    }
  }, [state.drafts]);

  const actions: DraftContextActions = {
    createDraft: useCallback((merchantInfo: { id: string; name: string; category: BusinessCategory }) => {
      const draftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      dispatch({ type: 'CREATE_DRAFT', payload: { draftId, merchantInfo } });
      return draftId;
    }, []),

    saveDraft: useCallback((draftId: string, data: Partial<DraftData>) => {
      dispatch({ type: 'SAVE_DRAFT_START', payload: draftId });
      
      // Simulate async save operation
      setTimeout(() => {
        dispatch({ 
          type: 'SAVE_DRAFT_SUCCESS', 
          payload: { 
            draftId, 
            data, 
            timestamp: new Date() 
          } 
        });
      }, 500);
    }, []),

    loadDraft: useCallback((draftId: string) => {
      const draft = state.drafts.find(d => d.draftId === draftId);
      if (draft) {
        dispatch({ type: 'LOAD_DRAFT', payload: draftId });
        return draft;
      }
      return null;
    }, [state.drafts]),

    deleteDraft: useCallback((draftId: string) => {
      dispatch({ type: 'DELETE_DRAFT', payload: draftId });
    }, []),

    listDrafts: useCallback(() => {
      return state.drafts;
    }, [state.drafts]),

    setAutoSaveInterval: useCallback((interval: number) => {
      dispatch({ type: 'SET_AUTO_SAVE_INTERVAL', payload: interval });
    }, []),

    enableAutoSave: useCallback((enabled: boolean) => {
      // This will be implemented when we add the auto-save functionality
      console.log('Auto-save enabled:', enabled);
    }, []),
  };

  return (
    <DraftContext.Provider value={{ state, actions }}>
      {children}
    </DraftContext.Provider>
  );
};

export const useDraftContext = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDraftContext must be used within a DraftProvider');
  }
  return context;
};

export default DraftContext;