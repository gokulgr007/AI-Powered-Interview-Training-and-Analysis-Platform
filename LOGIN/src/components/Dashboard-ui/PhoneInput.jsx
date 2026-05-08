import React from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './phone-input.css';

// Reusable phone editor using react-phone-number-input
// Props: value (E.164 string), onChange (val => void), defaultCountry (ISO2)
const PhoneEditor = ({ value, onChange, defaultCountry = 'IN', placeholder = 'Enter phone number' }) => {
  const [touched, setTouched] = React.useState(false);

  const valid = value ? isValidPhoneNumber(value) : false;

  return (
    <div>
      <PhoneInput
        international
        defaultCountry={defaultCountry}
        value={value}
        onChange={(val) => {
          onChange(val);
          if (!touched) setTouched(true);
        }}
        placeholder={placeholder}
        className="react-phone-input"
      />

      {touched && value && !valid && (
        <div className="text-xs text-red-600 mt-1">Please enter a valid phone number</div>
      )}
    </div>
  );
};

export default PhoneEditor;
