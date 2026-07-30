import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the multi-step Forgot Password page with OTP verification
    navigate('/forgot-password', { replace: true });
  }, [navigate]);

  return null;
}
