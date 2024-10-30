// components/ModalDelete.js
import React from 'react';
import './styles/ModalDelete.css';

export default function ModalDelete({ showModal, onClose, onDelete }) {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Exclusão</h2>
        <p>Tem certeza de que deseja excluir este livro?</p>
        <div className="modal-buttons">
          <button className='delete' onClick={onDelete}>Sim, excluir</button>
          <button className='cancel'onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
