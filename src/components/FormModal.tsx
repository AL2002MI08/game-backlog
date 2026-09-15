import { Modal } from '@mantine/core';
import { ReactNode } from 'react';

export default function FormModal({ opened, onClose, title, children }: { opened: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      classNames={{ content: 'bg-white dark:bg-[#090e1c]', header: 'bg-white dark:bg-[#090e1c]' }}
    >
      {children}
    </Modal>
  );
}