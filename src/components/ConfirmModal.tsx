import { Modal } from '@mantine/core';
import { ReactNode } from 'react';

export default function ConfirmModal({ opened, onClose, title, children }: { opened: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      classNames={{content: 'bg-white dark:bg-[#0a0e14]',
      header: 'bg-white dark:bg-slate-700'}}
    >
      {children}
    </Modal>
  );
}
