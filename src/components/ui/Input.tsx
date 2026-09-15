import { forwardRef } from 'react';
import { TextInput, MantineSize } from '@mantine/core';

export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  size?: MantineSize;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ value = '', onChange, onBlur, error, disabled, name, label = 'Email address', placeholder = 'Your email', size = 'md' }, ref) => {
    return (
      <TextInput
        ref={ref}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.currentTarget.value)}
        onBlur={onBlur}
        error={error}
        disabled={disabled}
        label={label}
        placeholder={placeholder}
        size={size}
        radius="md"
        type="email"
        autoComplete="email"
        styles={{
          input: {
            paddingInlineStart: '18px',
            paddingInlineEnd: '20px',
          },
        }}
      />
    );
  }
);

Input.displayName = 'Input';