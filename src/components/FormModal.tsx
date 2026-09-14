import { Modal } from '@mantine/core';
import { ReactNode } from 'react';

export default function FormModal({ opened, onClose, title, children }: { opened: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <Modal className='bg-slate-800' opened={opened} onClose={onClose} title={title} centered>
      {children}
    </Modal>
  );
}