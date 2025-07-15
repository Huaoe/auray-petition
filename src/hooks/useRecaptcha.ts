import { useRef, useCallback } from 'react';
import type Reaptcha from 'reaptcha';

export const useRecaptcha = () => {
  const recaptchaRef = useRef<Reaptcha>(null);

  const executeRecaptcha = useCallback(async () => {
    await recaptchaRef.current?.execute();
  }, []);

  const resetRecaptcha = useCallback(() => {
    recaptchaRef.current?.reset();
  }, []);

  return {
    recaptchaRef,
    executeRecaptcha,
    resetRecaptcha,
  };
};
