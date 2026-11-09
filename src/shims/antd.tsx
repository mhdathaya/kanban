                                                 
import React from 'react';

                        
export interface TagProps {
  color?: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export const Tag = ({ color, style, className, children }: TagProps) => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    green: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    orange: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    cyan: { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' },
    error: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    warning: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    success: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    default: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
    yellow: { bg: '#fefce8', text: '#ca8a04', border: '#fef08a' },
  };

  const theme =
    color && colorMap[color]
      ? colorMap[color]
      : { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: '4px',
        background: theme.bg,
        color: theme.text,
        border: `1px solid ${theme.border}`,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

                           
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  htmlType?: 'button' | 'submit' | 'reset'
  size?: 'small' | 'middle' | 'large'
  icon?: React.ReactNode
}

export const Button = ({
  type: _type = 'default',
  htmlType = 'button',
  size = 'middle',
  style,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={htmlType}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        padding: size === 'small' ? '4px 8px' : '6px 14px',
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        borderRadius: '6px',
        border: '1px solid transparent',
        ...style,
      }}
      {...props}
    >
    </button>
  )
}

                          
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  allowClear?: boolean;
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export const TextArea = ({ rows = 3, style, className, ...props }: TextAreaProps) => {
  return (
    <textarea
      rows={rows}
      className={className}
      style={{
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #cbd5e1',
        fontSize: '0.875rem',
        outline: 'none',
        background: '#ffffff',
        color: '#1e293b',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        resize: 'vertical',
        ...style,
      }}
      {...props}
    />
  );
};

interface InputComponent extends React.FC<InputProps> {
  TextArea: typeof TextArea;
}

export const Input: InputComponent = ({ style, className, ...props }: InputProps) => {
  return (
    <input
      className={className}
      style={{
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid #cbd5e1',
        fontSize: '0.875rem',
        outline: 'none',
        background: '#ffffff',
        color: '#1e293b',
        ...style,
      }}
      {...props}
    />
  );
};

Input.TextArea = TextArea;

                           
export interface SelectOption {
  label: React.ReactNode;
  value: string | number;
}

export interface SelectProps {
  value?: any;
  onChange?: (value: any) => void;
  options?: SelectOption[];
  style?: React.CSSProperties;
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

export const Select = ({
  value,
  onChange,
  options = [],
  style,
  className,
  size = 'middle',
}: SelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={className}
      style={{
        padding: size === 'small' ? '3px 8px' : '6px 12px',
        borderRadius: '6px',
        border: '1px solid #cbd5e1',
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        background: '#ffffff',
        color: '#1e293b',
        cursor: 'pointer',
        outline: 'none',
        ...style,
      }}
    >
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

                          
export interface ModalProps {
  title?: React.ReactNode;
  open?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}

export const Modal = ({
  title,
  open,
  onOk,
  onCancel,
  okText = 'OK',
  cancelText = 'Batal',
  children,
}: ModalProps) => {
  if (!open) return null;

  return (
    <div
      className="app-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(2px)',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div
        className="app-modal-dialog"
        style={{
          width: 'min(500px, 100%)',
          maxWidth: '100%',
          maxHeight: 'calc(100dvh - 32px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          className="app-modal-header"
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>
            {title}
          </h3>
          <button type="button" onClick={onCancel} aria-label="Tutup dialog" style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div className="app-modal-body" style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {children}
        </div>

        <div className="app-modal-footer"
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            background: '#f8fafc',
          }}
        >
          <button type="button" onClick={onCancel} aria-label="Tutup dialog" style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onOk}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: '#4f46e5',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {okText}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export { message, notification } from './antd-utils';

export const Avatar = ({ src, alt, style, className }: any) => (
  <img
    src={src || '/placeholder-avatar.png'}
    alt={alt || 'Avatar'}
    className={className}
    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', ...style }}
  />
);

export const Drawer = ({ open, onClose, title, children }: any) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)' }}>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 320,
          background: '#fff',
          padding: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h4>{title}</h4>
          <button onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const antd = {
  Tag,
  Button,
  Input,
  TextArea,
  Select,
  Modal,
  Avatar,
  Drawer,
             
                  
};

export default antd;
