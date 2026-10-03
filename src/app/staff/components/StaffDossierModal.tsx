'use client';

import React from 'react';
import { StudentCase, StaffTabType } from '../types';
import ExpedienteCards from '@/components/expediente/ExpedienteCards';
import { DossierHeader } from './dossier/DossierHeader';
import { DossierChatFooter } from './dossier/DossierChatFooter';

interface StaffDossierModalProps {
  selectedCaseModal: StudentCase | null;
  caseModalGroup: StudentCase[];
  setSelectedCaseModal: React.Dispatch<React.SetStateAction<StudentCase | null>>;
  onClose: () => void;
  onMoveStatus: (caseId: string, newStatus: StaffTabType) => void;
  onDeleteCase: (targetCase: StudentCase) => void;
  onStartChat: (targetCase: StudentCase) => void;
  onCopy: (text: string, label: string) => void;
  onCaseUpdated?: () => void;
  deletingCaseId: string | null;
  isEditingDossier: boolean;
  editedFormData: Record<string, string>;
  setEditedFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  dossierSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  startEditingDossier: () => void;
  stopEditingDossier: () => void;
}

export const StaffDossierModal: React.FC<StaffDossierModalProps> = ({
  selectedCaseModal,
  caseModalGroup,
  setSelectedCaseModal,
  onClose,
  onMoveStatus,
  onDeleteCase,
  onStartChat,
  onCopy,
  onCaseUpdated,
  deletingCaseId,
  isEditingDossier,
  editedFormData,
  setEditedFormData,
  dossierSaveStatus,
  startEditingDossier,
  stopEditingDossier,
}) => {
  if (!selectedCaseModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-[1560px] h-[95vh] max-h-[95vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modular Header */}
        <DossierHeader
          selectedCaseModal={selectedCaseModal}
          caseModalGroup={caseModalGroup}
          setSelectedCaseModal={setSelectedCaseModal}
          onClose={onClose}
          onMoveStatus={onMoveStatus}
          onDeleteCase={onDeleteCase}
          onCopy={onCopy}
          isEditingDossier={isEditingDossier}
          editedFormData={editedFormData}
          startEditingDossier={startEditingDossier}
          stopEditingDossier={stopEditingDossier}
        />

        {/* Mismas tarjetas que el cliente ve en "Mi proceso": Datos Personales + los 25 servicios */}
        <div className="p-6 md:p-8 overflow-y-auto text-slate-900 flex-1 min-h-0 sleek-scrollbar bg-slate-50/60">
          {selectedCaseModal.email ? (
            <ExpedienteCards email={selectedCaseModal.email} mode="staff" request={fetch} />
          ) : (
            <p className="text-sm text-slate-500">Este expediente no tiene correo registrado.</p>
          )}
        </div>

        {/* Modal Footer: Live Embedded Chat with Client */}
        {selectedCaseModal.email && (
          <DossierChatFooter
            clientEmail={selectedCaseModal.email}
            clientName={selectedCaseModal.name}
            onCaseUpdated={onCaseUpdated}
          />
        )}
      </div>
    </div>
  );
};
