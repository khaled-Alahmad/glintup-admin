import { parsePhoneNumber, isValidPhoneNumber, formatNumber, getCountryCallingCode } from 'libphonenumber-js';
import formatPhoneNumberIntl from 'libphonenumber-js';

/**
 * تحقق من صحة رقم الهاتف
 * @param phoneNumber رقم الهاتف المراد التحقق منه
 * @param defaultCountry رمز الدولة الافتراضي (مثل 'KW' للكويت، 'SA' للسعودية)
 * @returns true إذا كان الرقم صحيحًا، false إذا كان غير صحيح
 */
export const isValidPhone = (phoneNumber: string, defaultCountry: string = 'KW'): boolean => {
  if (!phoneNumber) return false;
  try {
    return isValidPhoneNumber(phoneNumber, defaultCountry as any);
  } catch (error) {
    return false;
  }
};

/**
 * تنسيق رقم الهاتف بالتنسيق المحلي للدولة
 * @param phoneNumber رقم الهاتف المراد تنسيقه
 * @param defaultCountry رمز الدولة الافتراضي
 * @returns رقم الهاتف بعد التنسيق أو الرقم الأصلي في حالة الخطأ
 */
export const formatPhone = (phoneNumber: string, defaultCountry: string = 'KW'): string => {
  if (!phoneNumber) return '';
  try {
    return formatNumber(phoneNumber, defaultCountry as any, 'NATIONAL');
  } catch (error) {
    return phoneNumber;
  }
};

/**
 * تنسيق رقم الهاتف بالتنسيق الدولي
 * @param phoneNumber رقم الهاتف المراد تنسيقه
 * @param defaultCountry رمز الدولة الافتراضي
 * @returns رقم الهاتف بالتنسيق الدولي أو الرقم الأصلي في حالة الخطأ
 */
export const formatPhoneIntl = (phoneNumber: string, defaultCountry: string = 'KW'): string => {
  if (!phoneNumber) return '';
  try {
    const formatted = formatPhoneNumberIntl(phoneNumber);
    return formatted !== undefined ? formatted.toString() : phoneNumber;
  } catch (error) {
    return phoneNumber;
  }
};

/**
 * الحصول على رمز الدولة من رقم الهاتف
 * @param phoneNumber رقم الهاتف
 * @returns رمز الدولة (مثل 965 للكويت) أو سلسلة فارغة في حالة الخطأ
 */
export const getCountryCode = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    if (parsed) {
      return getCountryCallingCode(parsed.country || 'KW');
    }
    return '';
  } catch (error) {
    return '';
  }
};

/**
 * استخراج الرقم المحلي بدون كود الدولة
 * @param phoneNumber رقم الهاتف
 * @returns الرقم المحلي بدون كود الدولة أو الرقم الأصلي في حالة الخطأ
 */
export const getNationalNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    return parsed ? parsed.nationalNumber : phoneNumber;
  } catch (error) {
    return phoneNumber;
  }
};

/**
 * تحويل الرقم إلى تنسيق E.164 (مثال: +96512345678)
 * @param phoneNumber رقم الهاتف
 * @param defaultCountry رمز الدولة الافتراضي
 * @returns رقم الهاتف بتنسيق E.164 أو الرقم الأصلي في حالة الخطأ
 */
export const formatE164 = (phoneNumber: string, defaultCountry: string = 'KW'): string => {
  if (!phoneNumber) return '';
  try {
    const parsed = parsePhoneNumber(phoneNumber, { defaultCountry: defaultCountry as any });
    return parsed ? parsed.format('E.164') : phoneNumber;
  } catch (error) {
    return phoneNumber;
  }
};
