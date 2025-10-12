import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  as?: 'input' | 'select' | 'textarea';
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  options,
  as = 'input',
  placeholder
}) => {
  if (as === 'select' && options) {
    return (
      <Form.Group className="mb-3">
        <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>
        <Form.Select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    );
  } else if (as === 'textarea') {
    return (
      <Form.Group className="mb-3">
        <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>
        <Form.Control
          as="textarea"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={3}
        />
      </Form.Group>
    );
  } else {
    return (
      <Form.Group className="mb-3">
        <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>
        <Form.Control
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      </Form.Group>
    );
  }
};

export default InputField;