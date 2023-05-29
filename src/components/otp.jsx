import React, { useRef } from 'react';
import InputMask from 'react-input-mask';
import { TextField } from '@mui/material';

const OTPInput = ({ length }) => {
  const inputRefs = useRef([]);
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (value.length === length && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData('text/plain');
    const otpArray = pastedData.slice(0, length).split('');
    otpArray.forEach((otp, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = otp;
        if (index === length - 1) {
          inputRefs.current[index].focus();
        }
      }
    });
    e.preventDefault();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const inputs = Array.from({ length }, (_, index) => (
    <InputMask
      key={index}
      mask="9"
      maskChar={null}
      onChange={(e) => handleChange(index, e)}
      onKeyDown={(e) => handleKeyDown(index, e)}
      ref={(ref) => (inputRefs.current[index] = ref)}
    >
      {(inputProps) => (
        <TextField
          variant="outlined"
          size="small"
          type="text"
          inputProps={{ maxLength: 1 }}
          {...inputProps}
        />
      )}
    </InputMask>
  ));

  return (
    <div>
      <label>OTP:</label>
      {inputs}
    </div>
  );
};

export default OTPInput;