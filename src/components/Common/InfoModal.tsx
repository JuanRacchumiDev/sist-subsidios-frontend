import React from "react";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  open,
  onClose,
  title,
  content,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-md">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="mb-4">{content}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
