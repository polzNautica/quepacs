// lib/validationSchemas.ts
import * as yup from 'yup';

export const registerSchema = yup.object({
  fullname: yup.string().min(2, 'Nama mesti sekurang-kurangnya 2 aksara').required('Nama diperlukan'),
  email: yup.string().email('Format email tidak sah').required('Email diperlukan'),
  password: yup.string()
    .min(6, 'Kata laluan mesti sekurang-kurangnya 6 aksara')
    .matches(/(?=.*[a-z])/, 'Mesti mengandungi huruf')
    // .matches(/(?=.*[A-Z])/, 'Mesti mengandungi huruf besar')
    .matches(/(?=.*\d)/, 'Mesti mengandungi sekurang-kurangnya satu nombor')
    .required('Kata laluan diperlukan'),
  confirmPassword: yup.string()
    .required('Kata laluan tidak sepadan'),
  nationality: yup.string().oneOf(['Malaysian','NonMalaysian']).required('Kewarganegaraan diperlukan'),
  nric: yup.string().matches(/^[0-9]{12}$/, 'Format NRIC tidak sah').required('NRIC/Passport diperlukan'),
  phone: yup.string().matches(/^[0-9]{9,11}$/, 'Format telefon tidak sah').required('Telefon diperlukan'),
  gender: yup.string().oneOf(['Male', 'Female']).required('Jantina diperlukan'),
  referralCode: yup.string().optional(),
});
// Create individual field validators
export const registerFieldValidator = (fieldName: string) => {
  return (value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] || '' : value; 
    try {
      registerSchema.validateSyncAt(fieldName, { [fieldName]: stringValue });
      return null;
    } catch (error: any) {
      return error.message;
    }
  };
};
export const createConfirmPasswordValidator = (currentPassword: string) => {
  return (value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] || '' : value;   
    if (!stringValue) return 'Sahkan kata laluan diperlukan';
    if (stringValue !== currentPassword) return 'Kata laluan tidak sepadan';
    return null;
  };
};